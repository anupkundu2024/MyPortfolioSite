import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError, apiRequest } from "@/lib/apiClient";
import { ChatWindow } from "./ChatWindow";
import {
  MAX_HISTORY_ITEM_LENGTH,
  MAX_HISTORY_ITEMS,
  MAX_MESSAGE_LENGTH,
  MAX_MESSAGES_IN_VIEW,
  NETWORK_RETRY_DELAY_MS,
  REQUEST_TIMEOUT_MS,
} from "./chatLimits";

/**
 * Lazy-loaded chat controller: conversation state + calls to POST /api/chat.
 *
 * The conversation lives only in this component's memory. It is never written
 * to storage and disappears when the tab is closed or reloaded. The Gemini key
 * never reaches the browser — only the backend talks to Gemini.
 *
 * Contract: success -> { success: true, reply }, failure ->
 * { success: false, error: { code, message } }. Each failure code maps to its
 * own message below, so a rate limit, a timeout and an outage read differently.
 */

const GREETING = {
  id: "greeting",
  role: "assistant",
  content: "Hi! I'm Anup AI 👋\nAsk me about Anup's skills, projects, education, availability, or how to get in touch.",
};

const UNAVAILABLE = "Anup AI is temporarily unavailable. Please try again shortly.";

// Code -> [client message (null = use the backend's own wording), can retry]
const ERRORS = {
  NETWORK_ERROR: [UNAVAILABLE, true],
  CLIENT_TIMEOUT: ["Anup AI is taking too long to respond. Please try again.", true],
  BAD_RESPONSE: ["Anup AI sent an unexpected response. Please try again.", true],
  CHAT_RATE_LIMITED: ["You're sending messages too quickly. Please wait a moment.", true],
  RATE_LIMITED: ["You're sending messages too quickly. Please wait a moment.", true],
  CHAT_DAILY_LIMIT: [null, false],
  CHAT_INVALID_REQUEST: [null, false],
  CHAT_MESSAGE_TOO_LONG: [`Please keep your message under ${MAX_MESSAGE_LENGTH} characters.`, false],
  REQUEST_TOO_LARGE: [`Please keep your message under ${MAX_MESSAGE_LENGTH} characters.`, false],
  INVALID_JSON: ["Something went wrong sending that message. Please try again.", true],
  GEMINI_NOT_CONFIGURED: [UNAVAILABLE, true],
  GEMINI_AUTH_ERROR: [UNAVAILABLE, true],
  GEMINI_MODEL_ERROR: [UNAVAILABLE, true],
  GEMINI_API_ERROR: [UNAVAILABLE, true],
  GEMINI_RATE_LIMITED: ["Anup AI is very busy right now. Please try again in a moment.", true],
  GEMINI_TIMEOUT: ["That took too long to answer. Please try again.", true],
  GEMINI_RESPONSE_ERROR: ["I couldn't come up with an answer to that. Could you rephrase your question?", true],
};

class ChatClientError extends Error {
  constructor(code) {
    super(code);
    this.code = code;
  }
}

/** Maps any failure to { content, retryable } for the error bubble. */
const describeError = (error) => {
  let code = error?.code;
  if (!code && error instanceof ApiError) {
    code = error.status === 429 ? "RATE_LIMITED" : error.status >= 500 ? "GEMINI_API_ERROR" : null;
  }
  const entry = ERRORS[code];
  if (entry) return { content: entry[0] || error.message || UNAVAILABLE, retryable: entry[1] };
  // Unknown 4xx: the backend only ever returns short, user-facing messages.
  if (error instanceof ApiError && error.status >= 400 && error.status < 500 && error.message) {
    return { content: error.message, retryable: false };
  }
  return { content: UNAVAILABLE, retryable: true };
};

let nextId = 0;
const makeId = () => `m${++nextId}`;

/** Recent successful turns, trimmed to what the backend accepts. */
const buildHistory = (messages) =>
  messages
    // Drop the greeting, error bubbles, and questions whose answer failed, so a
    // new question is never answered together with an old unanswered one.
    .filter((m, i) => m.id !== GREETING.id && !m.error && !(m.role === "user" && messages[i + 1]?.error))
    .slice(-MAX_HISTORY_ITEMS)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_HISTORY_ITEM_LENGTH) }));

const wait = (ms, signal) =>
  new Promise((resolve, reject) => {
    if (signal.aborted) return reject(new DOMException("Aborted", "AbortError"));
    const timer = setTimeout(resolve, ms);
    signal.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true }
    );
  });

/** One request, plus a single automatic retry when the network itself failed. */
async function requestReply(body, signal) {
  let data;
  try {
    data = await apiRequest("/chat", { method: "POST", body, signal });
  } catch (error) {
    if (!(error instanceof ApiError && error.code === "NETWORK_ERROR")) throw error;
    await wait(NETWORK_RETRY_DELAY_MS, signal);
    data = await apiRequest("/chat", { method: "POST", body, signal });
  }

  if (data?.success === true && typeof data.reply === "string" && data.reply.trim()) return data.reply;
  throw new ChatClientError("BAD_RESPONSE");
}

export default function Chatbot({ open, onClose }) {
  const [messages, setMessagesState] = useState([GREETING]);
  const [pending, setPending] = useState(false);
  const controllerRef = useRef(null);
  // Synchronous mirror of `messages`, so a send can read the current
  // conversation without waiting for a re-render.
  const messagesRef = useRef(messages);

  const setMessages = useCallback((next) => {
    messagesRef.current = next.slice(-MAX_MESSAGES_IN_VIEW);
    setMessagesState(messagesRef.current);
  }, []);

  // Abort an in-flight request if the widget is ever unmounted.
  useEffect(() => () => controllerRef.current?.abort(), []);

  const send = useCallback(
    async (rawText, { retry = false } = {}) => {
      const text = rawText.trim().slice(0, MAX_MESSAGE_LENGTH);
      if (!text || controllerRef.current) return;

      const previous = messagesRef.current;
      // A retry replaces the failed answer (always the latest message) instead
      // of repeating the question; its question is then the last message.
      const base = retry && previous.at(-1)?.error ? previous.slice(0, -1) : previous;
      const history = buildHistory(retry ? base.slice(0, -1) : base);
      setMessages(retry ? base : [...base, { id: makeId(), role: "user", content: text }]);

      setPending(true);
      const controller = new AbortController();
      controllerRef.current = controller;
      let timedOut = false;
      const timer = setTimeout(() => {
        timedOut = true;
        controller.abort();
      }, REQUEST_TIMEOUT_MS);

      try {
        const reply = await requestReply({ message: text, history }, controller.signal);
        if (controllerRef.current !== controller) return; // conversation was reset
        setMessages([...messagesRef.current, { id: makeId(), role: "assistant", content: reply }]);
      } catch (error) {
        if (controllerRef.current !== controller) return; // conversation was reset
        const failure = describeError(timedOut ? { code: "CLIENT_TIMEOUT" } : error);
        setMessages([
          ...messagesRef.current,
          {
            id: makeId(),
            role: "assistant",
            content: failure.content,
            error: true,
            retryText: failure.retryable ? text : undefined,
          },
        ]);
      } finally {
        clearTimeout(timer);
        if (controllerRef.current === controller) {
          controllerRef.current = null;
          setPending(false);
        }
      }
    },
    [setMessages]
  );

  const retry = useCallback((message) => send(message.retryText, { retry: true }), [send]);

  // "New chat": drop the local conversation and any answer still in flight.
  const reset = useCallback(() => {
    const controller = controllerRef.current;
    controllerRef.current = null;
    controller?.abort();
    setPending(false);
    setMessages([GREETING]);
  }, [setMessages]);

  const hasConversation = messages.some((m) => m.role === "user");

  return (
    <ChatWindow
      open={open}
      onClose={onClose}
      messages={messages}
      pending={pending}
      showSuggestions={!hasConversation}
      canReset={hasConversation || pending}
      onSend={send}
      onRetry={retry}
      onReset={reset}
    />
  );
}
