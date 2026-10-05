import { routeMessage } from "../services/chatIntents.js";
import { ChatServiceError, generateChatReply } from "../services/aiChatService.js";
import { chatAiDailyLimiter, chatAiMinuteLimiter } from "../middleware/rateLimiter.js";
import { httpError } from "../utils/httpErrors.js";

/**
 * POST /api/chat
 *
 * Body:    { message: string, history?: [{ role: "user" | "assistant", content: string }] }
 * Success: { success: true, reply: string }
 * Failure: { success: false, error: { code, message }, message }
 *
 * Flow: validate -> intent routing (instant verified answers) -> Gemini for
 * nuanced / follow-up questions -> plain-text reply.
 *
 * Privacy: messages are processed in memory only. Nothing is written to the
 * database and message text is never logged.
 */

export const CHAT_LIMITS = Object.freeze({
  maxMessageLength: 500, // characters in the new question
  maxHistoryItems: 50, // hard cap on turns accepted from the client (older ones are dropped, not rejected)
  historyItemsUsed: 12, // most recent turns actually sent to Gemini
  maxHistoryItemLength: 2000, // characters per history turn (assistant replies can be long)
  maxTotalHistoryLength: 8000, // characters across the history actually used
});

// Status and client-safe wording for each service failure.
const SERVICE_ERRORS = {
  GEMINI_NOT_CONFIGURED: [503, "Anup AI is temporarily unavailable. Please try again shortly."],
  GEMINI_AUTH_ERROR: [503, "Anup AI is temporarily unavailable. Please try again shortly."],
  GEMINI_MODEL_ERROR: [503, "Anup AI is temporarily unavailable. Please try again shortly."],
  GEMINI_RATE_LIMITED: [503, "Anup AI is very busy right now. Please try again in a moment."],
  GEMINI_TIMEOUT: [504, "That took too long to answer. Please try again."],
  GEMINI_RESPONSE_ERROR: [502, "I couldn't come up with an answer to that. Could you rephrase your question?"],
  GEMINI_API_ERROR: [503, "AI service temporarily unavailable. Please try again shortly."],
};

const invalid = (message) => httpError(400, message, { code: "CHAT_INVALID_REQUEST" });

// Strip control characters (except newlines/tabs) without otherwise touching the text.
const clean = (text) => text.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();

const isPlainObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

function validate(body) {
  if (!isPlainObject(body)) throw invalid("Invalid request.");

  const { message, history = [] } = body;

  if (typeof message !== "string") throw invalid("Please enter a message.");
  const cleanMessage = clean(message);
  if (!cleanMessage) throw invalid("Please enter a message.");
  if (cleanMessage.length > CHAT_LIMITS.maxMessageLength) {
    throw httpError(400, `Please keep your message under ${CHAT_LIMITS.maxMessageLength} characters.`, {
      code: "CHAT_MESSAGE_TOO_LONG",
    });
  }

  if (!Array.isArray(history) || history.length > CHAT_LIMITS.maxHistoryItems) {
    throw invalid("Invalid conversation history.");
  }

  // Only the most recent turns matter; anything older is ignored rather than rejected.
  const cleanHistory = history.slice(-CHAT_LIMITS.historyItemsUsed).map((turn) => {
    if (
      !isPlainObject(turn) ||
      !["user", "assistant"].includes(turn.role) ||
      typeof turn.content !== "string" ||
      !turn.content.trim() ||
      turn.content.length > CHAT_LIMITS.maxHistoryItemLength
    ) {
      throw invalid("Invalid conversation history.");
    }
    return { role: turn.role, content: clean(turn.content) };
  });

  // Keep only the most recent turns, within the total size budget.
  const recent = [];
  let total = 0;
  for (const turn of [...cleanHistory].reverse()) {
    total += turn.content.length;
    if (total > CHAT_LIMITS.maxTotalHistoryLength) break;
    recent.unshift(turn);
  }
  // Gemini expects the conversation to start with a user turn.
  while (recent.length && recent[0].role !== "user") recent.shift();

  return { message: cleanMessage, history: recent };
}

/** Runs an express-rate-limit middleware inline; resolves true if the request may continue. */
const passes = (limiter, req, res) =>
  new Promise((resolve, reject) => {
    limiter(req, res, (error) => (error ? reject(error) : resolve(true)));
    // When the limit is hit the handler responds and never calls next().
    res.once("finish", () => resolve(false));
  });

export async function chat(req, res, next) {
  const startedAt = Date.now();
  try {
    const { message, history } = validate(req.body);
    const { intent, reply: staticReply } = routeMessage(message);
    console.log(`[CHAT] request received intent=${intent} chars=${message.length} history=${history.length}`);

    if (staticReply) {
      console.log(`[CHAT] response returned source=static ms=${Date.now() - startedAt}`);
      return res.json({ success: true, reply: staticReply });
    }

    // Only messages that actually cost a Gemini call count against these budgets.
    if (!(await passes(chatAiMinuteLimiter, req, res))) return undefined;
    if (!(await passes(chatAiDailyLimiter, req, res))) return undefined;

    const { reply } = await generateChatReply({ message, history });
    console.log(`[CHAT] response returned source=gemini ms=${Date.now() - startedAt}`);
    return res.json({ success: true, reply });
  } catch (error) {
    if (error instanceof ChatServiceError) {
      const [status, message] = SERVICE_ERRORS[error.code] || SERVICE_ERRORS.GEMINI_API_ERROR;
      // Failure class only — never message text or keys.
      console.warn(`[CHAT] failed code=${error.code} ms=${Date.now() - startedAt}`);
      return next(httpError(status, message, { code: error.code }));
    }
    return next(error);
  }
}
