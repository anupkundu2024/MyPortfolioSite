import { config } from "../config/default.js";
import { findUserById } from "../services/authService.js";
import { clearCookieOptions, verifyCvTicket, verifySessionToken } from "../utils/tokens.js";
import { unauthorized } from "../utils/httpErrors.js";

/**
 * Collect every place a session token could arrive, cookie first.
 *
 * The HTTP-only cookie is the primary mechanism. The Bearer header is a fallback
 * for browsers that block cross-site cookies (Safari ITP), where the SPA holds a
 * token in memory for the current page session only.
 */
const collectSessionTokens = (req) => {
  const tokens = [];

  const cookieToken = req.cookies?.[config.cookie.name];
  if (cookieToken) tokens.push(cookieToken);

  const header = req.get("authorization") || "";
  if (header.toLowerCase().startsWith("bearer ")) {
    const headerToken = header.slice(7).trim();
    if (headerToken) tokens.push(headerToken);
  }

  return tokens;
};

const resolveSessionSubject = (req) => {
  const tokens = collectSessionTokens(req);
  if (!tokens.length) return null;

  for (const token of tokens) {
    try {
      return verifySessionToken(token).sub;
    } catch {
      // Try the next candidate; an expired cookie should not veto a fresh header.
    }
  }

  // Tokens were present but none verified — the session is genuinely stale.
  throw unauthorized("Your session has expired. Please sign in again.");
};

const dropStaleCookie = (req, res) => {
  if (req.cookies?.[config.cookie.name]) {
    res.clearCookie(config.cookie.name, clearCookieOptions());
  }
};

/**
 * Loads req.user from a verified session, or fails with 401.
 * The database is always consulted — a signed token alone is never enough,
 * so deleted accounts lose access immediately.
 */
export const requireAuth = async (req, res, next) => {
  try {
    const subject = resolveSessionSubject(req);

    if (!subject) {
      throw unauthorized("Please sign in to continue.");
    }

    const user = await findUserById(subject);

    if (!user) {
      dropStaleCookie(req, res);
      throw unauthorized("Your session is no longer valid. Please sign in again.");
    }

    req.user = user;
    return next();
  } catch (error) {
    if (error.status === 401) dropStaleCookie(req, res);
    return next(error);
  }
};

/**
 * Populates req.user when a valid session exists, but never rejects.
 * Used by GET /api/auth/me so an anonymous visitor gets a clean
 * "not authenticated" answer instead of an error.
 */
export const attachUserIfPresent = async (req, res, next) => {
  try {
    let subject = null;
    try {
      subject = resolveSessionSubject(req);
    } catch {
      dropStaleCookie(req, res);
      return next();
    }

    if (subject) {
      req.user = (await findUserById(subject)) || undefined;
      if (!req.user) dropStaleCookie(req, res);
    }

    return next();
  } catch {
    // A database hiccup here must not break the page; treat as anonymous.
    return next();
  }
};

/**
 * Authorization for GET /api/cv.
 *
 * Accepts a short-lived CV ticket from the query string in addition to the
 * normal session, because a new-tab navigation cannot send an Authorization
 * header. Falls through to requireAuth when no ticket is supplied.
 */
export const requireCvAccess = async (req, res, next) => {
  const ticket = typeof req.query.ticket === "string" ? req.query.ticket.trim() : "";

  if (!ticket) {
    return requireAuth(req, res, next);
  }

  try {
    const payload = verifyCvTicket(ticket);
    const user = await findUserById(payload.sub);

    if (!user) {
      throw unauthorized("This CV link is no longer valid.");
    }

    req.user = user;
    req.cvTicketUsed = true;
    return next();
  } catch (error) {
    if (error.status) return next(error);
    return next(unauthorized("This CV link has expired. Please request access again."));
  }
};
