import { config } from "../config/default.js";
import { authenticateUser, registerUser } from "../services/authService.js";
import { sendSuccess } from "../utils/responseHandler.js";
import { clearCookieOptions, sessionCookieOptions, signSessionToken } from "../utils/tokens.js";

/**
 * Issues the session.
 *
 * The token is set as an HTTP-only cookie (primary, survives reloads) and also
 * returned in the body. The SPA keeps the body copy in memory only — never in
 * localStorage — as a fallback for browsers that block cross-site cookies.
 */
const establishSession = (res, user) => {
  const token = signSessionToken(user);

  res.cookie(config.cookie.name, token, sessionCookieOptions());

  return {
    user: user.toPublicJSON(),
    accessToken: token,
    expiresInSeconds: config.jwt.sessionTtlSeconds,
  };
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, consent } = req.body ?? {};
    const user = await registerUser({ name, email, password, consent });

    return sendSuccess(res, establishSession(res, user), "Account created. CV access granted.", 201);
  } catch (error) {
    return next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body ?? {};
    const user = await authenticateUser({ email, password });

    return sendSuccess(res, establishSession(res, user), "Signed in successfully.");
  } catch (error) {
    return next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie(config.cookie.name, clearCookieOptions());
    return sendSuccess(res, { authenticated: false }, "Signed out successfully.");
  } catch (error) {
    return next(error);
  }
};

/** Restores session state after a page reload. Always 200 — never an error path. */
export const getCurrentUser = async (req, res, next) => {
  try {
    if (!req.user) {
      return sendSuccess(res, { authenticated: false, user: null }, "Not authenticated.");
    }

    return sendSuccess(
      res,
      { authenticated: true, user: req.user.toPublicJSON() },
      "Session is active."
    );
  } catch (error) {
    return next(error);
  }
};
