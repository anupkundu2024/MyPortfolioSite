import { redactUrl } from "../utils/redactUrl.js";

/**
 * Minimal request log. The query string is redacted rather than printed
 * verbatim — see utils/redactUrl.js for why.
 */
export const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${redactUrl(req.originalUrl)}`);
  next();
};
