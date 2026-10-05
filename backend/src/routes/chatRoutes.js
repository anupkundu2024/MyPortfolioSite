import { Router } from "express";
import { chat } from "../controllers/chatController.js";
import { chatBurstLimiter } from "../middleware/rateLimiter.js";

const router = Router();

// "Anup AI" portfolio assistant. No auth required; protected by a per-address
// burst limit here, separate Gemini-only limits in the controller, input
// limits, and a server-side Gemini timeout.
router.post("/", chatBurstLimiter, chat);

export default router;
