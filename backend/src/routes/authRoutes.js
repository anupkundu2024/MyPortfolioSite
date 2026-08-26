import { Router } from "express";
import { getCurrentUser, login, logout, register } from "../controllers/authController.js";
import { attachUserIfPresent } from "../middleware/authMiddleware.js";
import { authLimiter, sessionLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);

// Always answers 200 with { authenticated: boolean } so the SPA can restore state.
router.get("/me", sessionLimiter, attachUserIfPresent, getCurrentUser);

// Deliberately not requireAuth: signing out must always clear the cookie, even
// when the session has already expired. Otherwise a stale cookie would linger
// behind a 401 the user cannot recover from.
router.post("/logout", sessionLimiter, attachUserIfPresent, logout);

export default router;
