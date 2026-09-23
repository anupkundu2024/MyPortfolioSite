import { answerFromFaq } from "../services/chatFaq.js";
import { ChatServiceError, generateChatReply } from "../services/aiChatService.js";
import { httpError } from "../utils/httpErrors.js";

/**
 * POST /api/chat
 *
 * Body: { message: string, history?: [{ role: "user" | "assistant", content: string }] }
 * Reply: { success: true, reply: string }
 *
 * Privacy: messages are processed in memory only. Nothing is written to the
 * database and message text is never logged.
 */

export const CHAT_LIMITS = Object.freeze({
  maxMessageLength: 500, // characters in the new question
  maxHistoryItems: 10, // turns accepted from the client
  historyItemsUsed: 8, // most recent turns actually sent to Gemini
  maxHistoryItemLength: 2000, // characters per history turn (assistant replies can be long)
  maxTotalHistoryLength: 8000, // characters across the history actually used
});

const FRIENDLY = {
  NOT_CONFIGURED: [503, "The chat assistant isn't available right now. Please use the Contact section instead."],
  TIMEOUT: [504, "That took too long to answer. Please try again in a moment."],
  RATE_LIMITED: [503, "Anup AI is very busy right now. Please try again in a moment."],
  UPSTREAM: [503, "I'm having trouble connecting right now. Please try again in a moment."],
  EMPTY: [503, "I couldn't come up with an answer to that. Could you rephrase your question?"],
};

// Strip control characters (except newlines/tabs) without otherwise touching the text.
const clean = (text) => text.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();

const isPlainObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

function validate(body) {
  if (!isPlainObject(body)) throw httpError(400, "Invalid request.");

  const { message, history = [] } = body;

  if (typeof message !== "string") throw httpError(400, "Please type a message.");
  const cleanMessage = clean(message);
  if (!cleanMessage) throw httpError(400, "Please type a message.");
  if (cleanMessage.length > CHAT_LIMITS.maxMessageLength) {
    throw httpError(400, `Please keep your message under ${CHAT_LIMITS.maxMessageLength} characters.`);
  }

  if (!Array.isArray(history) || history.length > CHAT_LIMITS.maxHistoryItems) {
    throw httpError(400, "Invalid conversation history.");
  }

  const cleanHistory = history.map((turn) => {
    if (
      !isPlainObject(turn) ||
      !["user", "assistant"].includes(turn.role) ||
      typeof turn.content !== "string" ||
      !turn.content.trim() ||
      turn.content.length > CHAT_LIMITS.maxHistoryItemLength
    ) {
      throw httpError(400, "Invalid conversation history.");
    }
    return { role: turn.role, content: clean(turn.content) };
  });

  // Keep only the most recent turns, within the total size budget.
  const recent = [];
  let total = 0;
  for (const turn of cleanHistory.slice(-CHAT_LIMITS.historyItemsUsed).reverse()) {
    total += turn.content.length;
    if (total > CHAT_LIMITS.maxTotalHistoryLength) break;
    recent.unshift(turn);
  }
  // Gemini expects the conversation to start with a user turn.
  while (recent.length && recent[0].role !== "user") recent.shift();

  return { message: cleanMessage, history: recent };
}

export async function chat(req, res, next) {
  try {
    const { message, history } = validate(req.body);

    const faqReply = answerFromFaq(message);
    if (faqReply) {
      return res.json({ success: true, reply: faqReply });
    }

    const { reply } = await generateChatReply({ message, history });
    return res.json({ success: true, reply });
  } catch (error) {
    if (error instanceof ChatServiceError) {
      const [status, message] = FRIENDLY[error.code] || FRIENDLY.UPSTREAM;
      // Log the failure class and upstream status only — never message text or keys.
      console.warn(`Chat: ${error.code}${error.cause?.status ? ` (upstream ${error.cause.status})` : ""}`);
      return next(httpError(status, message));
    }
    return next(error);
  }
}
