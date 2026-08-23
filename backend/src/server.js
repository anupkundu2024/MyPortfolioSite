import express from "express";
import cors from "cors";
import { config } from "./config/default.js";
import { requestLogger } from "./middleware/requestLogger.js";
import { errorHandler } from "./middleware/errorHandler.js";
import apiRoutes from "./routes/apiRoutes.js";

const app = express();

// Middlewares
app.use(cors({ origin: config.clientOrigin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Mount API routes
app.use("/api", apiRoutes);

// Root informational endpoint
app.get("/", (req, res) => {
  res.json({
    service: "Portfolio API Service",
    version: "1.0.0",
    healthCheck: "/api/health",
    timestamp: new Date().toISOString(),
  });
});

// Centralized error handling
app.use(errorHandler);

const server = app.listen(config.port, () => {
  console.log(`🚀 Portfolio backend server running on port ${config.port} [${config.nodeEnv}]`);
});

export default app;
