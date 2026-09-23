import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError, apiRequest } from "@/lib/apiClient";
import { ChatWindow } from "./ChatWindow";
import {
  MAX_HISTORY_ITEM_LENGTH,
  MAX_HISTORY_ITEMS,
  MAX_MESSAGE_LENGTH,
  MAX_MESSAGES_IN_VIEW,
  REQUEST_TIMEOUT_MS,
} from "./chatLimits";

/**
 * Lazy-loaded chat controller: conversation state + calls to POST /api/chat.
 *
 * The conversation lives only in this component's memory. It is never written
 * to storage and disappears when the tab is closed or reloaded. The Gemini key
 * never reaches the browser — only the backend talks to Gemini.
 */

const GREETING = {
  id: "greeting",
  role: "assistant",
  content: "Hi! I'm Anup AI 👋\nAsk me about Anup's skills, projects, experience, or how to get in touch.",
};

const CONNECTION_ERROR = "I'm having trouble connecting right now. Please try again in a moment.";

let nextId = 0;
const makeId = () => `m${++nextId}`;

const friendlyError = (error) => {
  if (error?.name === "AbortError" || error?.name === "TimeoutError") {
    return "That took too long to answer. Please try again in a moment.";
  }
  // The backend only ever returns short, user-facing messages.
  if (error instanceof ApiError && error.status && error.message) return error.message;
  return CONNECTION_ERROR;
};

/** Recent successful turns, trimmed to what the backend accepts. */
const buildHistory = (messages) =>
  messages
    // Drop the greeting, error bubbles, and questions whose answer failed, so a
    // new question is never answered together with an old unanswered one.
    .filter((m, i) => m.id !== GREETING.id && !m.error && !(m.role === "user" && messages[i + 1]?.error))
    .slice(-MAX_HISTORY_ITEMS)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_HISTORY_ITEM_LENGTH) }));

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
      if (!text || pending) return;

      const previous = messagesRef.current;
      // A retry replaces the failed answer (always the latest message) instead
      // of repeating the question; its question is then the last message.
      const base = retry && previous.at(-1)?.error ? previous.slice(0, -1) : previous;
      const history = buildHistory(retry ? base.slice(0, -1) : base);
      setMessages(retry ? base : [...base, { id: makeId(), role: "user", content: text }]);

      setPending(true);
      const controller = new AbortController();
      controllerRef.current = controller;
      const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

      try {
        const data = await apiRequest("/chat", {
          method: "POST",
          body: { message: text, history },
          signal: controller.signal,
        });
        const reply = typeof data?.reply === "string" && data.reply.trim() ? data.reply : null;
        if (!reply) throw new Error("Empty reply");

        setMessages([...messagesRef.current, { id: makeId(), role: "assistant", content: reply }]);
      } catch (error) {
        setMessages([
          ...messagesRef.current,
          { id: makeId(), role: "assistant", content: friendlyError(error), error: true, retryText: text },
        ]);
      } finally {
        clearTimeout(timer);
        controllerRef.current = null;
        setPending(false);
      }
    },
    [pending, setMessages]
  );

  const retry = useCallback(
    (message) => send(message.retryText, { retry: true }),
    [send]
  );

  const hasConversation = messages.some((m) => m.role === "user");

  return (
    <ChatWindow
      open={open}
      onClose={onClose}
      messages={messages}
      pending={pending}
      showSuggestions={!hasConversation}
      onSend={send}
      onRetry={retry}
    />
  );
}
