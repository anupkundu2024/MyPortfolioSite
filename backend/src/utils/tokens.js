import jwt from "jsonwebtoken";
import { config } from "../config/default.js";

const ISSUER = "portfolio-backend";

/**
 * Distinct audiences mean a long-lived session token can never be replayed as a
 * CV ticket in a URL query string, and vice versa — even though both are signed
 * with the same secret.
 */
const AUDIENCE_SESSION = "portfolio:session";
const AUDIENCE_CV_TICKET = "portfolio:cv-ticket";

const requireSecret = () => {
  if (!config.jwt.secret) {
    const error = new Error("Authentication is not configured on this server.");
    error.status = 503;
    error.expose = true;
    throw error;
  }
  return config.jwt.secret;
};

export const signSessionToken = (user) =>
  jwt.sign({ sub: String(user._id), provider: user.authProvider }, requireSecret(), {
    expiresIn: config.jwt.sessionTtlSeconds,
    issuer: ISSUER,
    audience: AUDIENCE_SESSION,
  });

export const verifySessionToken = (token) =>
  jwt.verify(token, requireSecret(), {
    issuer: ISSUER,
    audience: AUDIENCE_SESSION,
  });

/**
 * Short-lived token used only to open/download the PDF.
 *
 * A token in the URL is unavoidable here: `window.open()` cannot attach an
 * Authorization header, and cross-site cookies are unreliable (Safari ITP).
 * The exposure is bounded by the CV_TICKET_TTL_SECONDS lifetime (5 minutes by
 * default) and the `cv:read` scope, which grants nothing but the PDF.
 */
export const signCvTicket = (user) =>
  jwt.sign({ sub: String(user._id), scope: "cv:read" }, requireSecret(), {
    expiresIn: config.jwt.cvTicketTtlSeconds,
    issuer: ISSUER,
    audience: AUDIENCE_CV_TICKET,
  });

export const verifyCvTicket = (token) => {
  const payload = jwt.verify(token, requireSecret(), {
    issuer: ISSUER,
    audience: AUDIENCE_CV_TICKET,
  });

  if (payload.scope !== "cv:read") {
    throw new jwt.JsonWebTokenError("invalid scope");
  }

  return payload;
};

/** Cookie flags for the session cookie. */
export const sessionCookieOptions = () => ({
  httpOnly: true,
  // SameSite=None requires Secure. In production the frontend (Vercel) and the
  // backend (Render) are different sites, so None is the only value that works.
  secure: config.isProduction,
  sameSite: config.isProduction ? "none" : "lax",
  maxAge: config.jwt.sessionTtlSeconds * 1000,
  path: "/",
});

/** Same flags minus maxAge — required for res.clearCookie to actually match. */
export const clearCookieOptions = () => {
  const { maxAge, ...rest } = sessionCookieOptions();
  return rest;
};
