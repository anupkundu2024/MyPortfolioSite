import { Router } from "express";
import { getCv, issueCvTicket } from "../controllers/cvController.js";
import { requireAuth, requireCvAccess } from "../middleware/authMiddleware.js";
import { cvLimiter } from "../middleware/rateLimiter.js";

const router = Router();

// Exchange an active session for a short-lived, URL-safe access ticket.
router.post("/ticket", cvLimiter, requireAuth, issueCvTicket);

// The protected resource itself. Never served by static middleware.
router.get("/", cvLimiter, requireCvAccess, getCv);

export default router;
