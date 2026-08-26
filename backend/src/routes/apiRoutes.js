import { Router } from "express";
import authRoutes from "./authRoutes.js";
import cvRoutes from "./cvRoutes.js";
import { isDatabaseReady } from "../config/database.js";
import { sendSuccess } from "../utils/responseHandler.js";

const router = Router();

// Health check endpoint
router.get("/health", (req, res) => {
  sendSuccess(
    res,
    {
      status: "healthy",
      service: "portfolio-backend",
      database: isDatabaseReady() ? "connected" : "disconnected",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
    "Portfolio API is operational"
  );
});

// Authentication for the CV gate
router.use("/auth", authRoutes);

// Protected CV resource
router.use("/cv", cvRoutes);

export default router;
