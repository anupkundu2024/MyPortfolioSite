import rateLimit from "express-rate-limit";

const jsonLimitResponse = (message, code = "RATE_LIMITED") => (req, res) =>
  res.status(429).json({
    success: false,
    error: { code, message },
    message,
    timestamp: new Date().toISOString(),
  });

const baseOptions = {
  standardHeaders: true,
  legacyHeaders: false,
};

/**
 * Guards account creation and sign-in against credential stuffing and
 * enumeration sweeps. Counts every attempt, successful or not.
 */
export const authLimiter = rateLimit({
  ...baseOptions,
  windowMs: 15 * 60 * 1000,
  limit: 10,
  handler: jsonLimitResponse("Too many attempts. Please try again in about 15 minutes."),
});

/** Looser limit for reading the current session on page load. */
export const sessionLimiter = rateLimit({
  ...baseOptions,
  windowMs: 15 * 60 * 1000,
  limit: 120,
  handler: jsonLimitResponse("Too many requests. Please slow down."),
});

/** Bounds how often the protected PDF can be pulled from one address. */
export const cvLimiter = rateLimit({
  ...baseOptions,
  windowMs: 15 * 60 * 1000,
  limit: 40,
  // PDF viewers issue Range follow-ups; those must not burn the budget.
  skip: (req) => Boolean(req.headers.range),
  handler: jsonLimitResponse("Too many CV requests. Please try again later."),
});

/**
 * Chatbot limits, per client address.
 *
 * - chatBurstLimiter guards the route itself (every message, including the
 *   instant answers served from the verified profile).
 * - chatAiMinuteLimiter / chatAiDailyLimiter are applied by the controller
 *   only when a message actually needs Gemini, so cheap static answers never
 *   burn the paid budget, and the paid budget can never be exceeded.
 */
const CHAT_LIMIT_MESSAGE = "You're sending messages too quickly. Please wait a moment.";

export const chatBurstLimiter = rateLimit({
  ...baseOptions,
  windowMs: 60 * 1000,
  limit: 15,
  handler: jsonLimitResponse(CHAT_LIMIT_MESSAGE, "CHAT_RATE_LIMITED"),
});

export const chatAiMinuteLimiter = rateLimit({
  ...baseOptions,
  windowMs: 60 * 1000,
  limit: 8,
  handler: jsonLimitResponse(CHAT_LIMIT_MESSAGE, "CHAT_RATE_LIMITED"),
});

export const chatAiDailyLimiter = rateLimit({
  ...baseOptions,
  windowMs: 24 * 60 * 60 * 1000,
  limit: 100,
  handler: jsonLimitResponse(
    "You've reached today's chat limit. Please use the Contact section to reach Anup.",
    "CHAT_DAILY_LIMIT"
  ),
});
