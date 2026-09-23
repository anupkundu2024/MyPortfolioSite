import { Router } from "express";
import { chat } from "../controllers/chatController.js";
import { chatBurstLimiter, chatDailyLimiter } from "../middleware/rateLimiter.js";

const router = Router();

// "Anup AI" portfolio assistant. No auth required; protected by rate limits,
// input limits and a server-side Gemini timeout.
router.post("/", chatBurstLimiter, chatDailyLimiter, chat);

export default router;
