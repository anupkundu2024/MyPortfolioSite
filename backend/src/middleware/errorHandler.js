import { config } from "../config/default.js";
import { redactUrl } from "../utils/redactUrl.js";

const GENERIC_MESSAGE = "Something went wrong. Please try again.";

/**
 * Translates internal failures into safe client responses.
 *
 * Only messages explicitly marked `expose` (see utils/httpErrors.js) or produced
 * by the mappers below are sent to the browser. Everything else collapses to a
 * generic message so stack traces, driver internals and connection strings
 * never leave the server.
 */
const classify = (err) => {
  // Malformed JSON body
  if (err?.type === "entity.parse.failed") {
    return { status: 400, message: "Malformed request body." };
  }

  // Body larger than the configured limit
  if (err?.type === "entity.too.large") {
    return { status: 413, message: "Request body is too large." };
  }

  // Mongoose schema validation
  if (err?.name === "ValidationError") {
    const detail = Object.values(err.errors || {})
      .map((issue) => issue.message)
      .filter(Boolean)
      .join(" ");
    return { status: 400, message: detail || "Some of the submitted values are invalid." };
  }

  // Malformed ObjectId
  if (err?.name === "CastError") {
    return { status: 400, message: "Malformed request." };
  }

  // Unique index violation
  if (err?.code === 11000) {
    return { status: 409, message: "That value is already registered." };
  }

  // JWT verification problems that reached here unhandled
  if (err?.name === "TokenExpiredError") {
    return { status: 401, message: "Your session has expired. Please sign in again." };
  }
  if (err?.name === "JsonWebTokenError" || err?.name === "NotBeforeError") {
    return { status: 401, message: "Invalid authentication token." };
  }

  // Rejected by the CORS origin allowlist
  if (err?.code === "CORS_ORIGIN_DENIED") {
    return { status: 403, message: "Origin not allowed." };
  }

  // Database unreachable
  if (err?.name === "MongooseServerSelectionError" || err?.name === "MongoNetworkError") {
    return { status: 503, message: "Service temporarily unavailable. Please try again shortly." };
  }

  const status = Number.isInteger(err?.status) ? err.status : 500;

  return {
    status,
    // Only messages our own code deliberately marked as client-safe are sent
    // through. Anything else — including 4xx thrown by a dependency — collapses
    // to a generic string so internal wording can never leak.
    message: err?.expose === true && err?.message ? err.message : GENERIC_MESSAGE,
  };
};

export const errorHandler = (err, req, res, next) => {
  const { status, message } = classify(err);

  // Full detail stays server-side only, minus any credential in the query string.
  const logLine = `${req.method} ${redactUrl(req.originalUrl)} -> ${status}: ${err?.message}`;
  if (status >= 500) {
    console.error(`Unhandled Error: ${logLine}`, config.isProduction ? "" : err?.stack || "");
  } else {
    console.warn(`Request Error: ${logLine}`);
  }

  if (res.headersSent) {
    return res.end();
  }

  return res.status(status).json({
    success: false,
    message,
    timestamp: new Date().toISOString(),
  });
};

/** 404 for unmatched routes, so unknown paths return JSON rather than HTML. */
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found.",
    timestamp: new Date().toISOString(),
  });
};
