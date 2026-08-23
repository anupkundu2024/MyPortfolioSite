import { Router } from "express";
import contactRoutes from "./contactRoutes.js";
import { sendSuccess } from "../utils/responseHandler.js";

const router = Router();

// Health check endpoint
router.get("/health", (req, res) => {
  sendSuccess(
    res,
    {
      status: "healthy",
      service: "portfolio-backend",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
    "Portfolio API is operational"
  );
});

// Contact endpoint
router.use("/contact", contactRoutes);

export default router;
