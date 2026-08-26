import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { config, validateConfig } from "./config/default.js";
import { connectDatabase } from "./config/database.js";
import { CvAccessLog } from "./models/CvAccessLog.js";
import { User } from "./models/User.js";
import { requestLogger } from "./middleware/requestLogger.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import apiRoutes from "./routes/apiRoutes.js";

validateConfig();

const app = express();

// Render terminates TLS at its proxy; needed for correct client IPs in rate limiting.
if (config.isProduction) {
  app.set("trust proxy", 1);
}

app.disable("x-powered-by");

/**
 * Explicit origin allowlist with credentials enabled.
 *
 * `credentials: true` is required for the session cookie to be sent, and it is
 * incompatible with a wildcard origin — so every allowed origin is listed
 * through configuration instead.
 */
const corsOptions = {
  origin: (origin, callback) => {
    // Same-origin requests, curl, and health checks send no Origin header.
    if (!origin) return callback(null, true);

    if (config.allowedOrigins.includes(origin.replace(/\/+$/, ""))) {
      return callback(null, true);
    }

    const error = new Error("Origin not allowed.");
    error.code = "CORS_ORIGIN_DENIED";
    return callback(error);
  },
  credentials: true,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 600,
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json({ limit: "32kb" }));
app.use(express.urlencoded({ extended: true, limit: "32kb" }));
app.use(cookieParser());
app.use(requestLogger);

// Mount API routes
app.use("/api", apiRoutes);

// Root informational endpoint
app.get("/", (req, res) => {
  res.json({
    service: "Portfolio API Service",
    version: "1.1.0",
    healthCheck: "/api/health",
    timestamp: new Date().toISOString(),
  });
});

app.use(notFoundHandler);

// Centralized error handling
app.use(errorHandler);

// Connect to MongoDB without blocking startup — the site stays up even if Atlas
// is briefly unreachable, and auth endpoints answer 503 until it recovers.
connectDatabase()
  .then(async (connection) => {
    if (!connection) return;
    // Build the declared indexes (notably the unique email constraint) before the
    // first registration arrives, so duplicates are rejected by the database.
    await Promise.all([User.init(), CvAccessLog.init()]);
    console.log("🔑 Database indexes ready.");
  })
  .catch(() => {
    console.warn("⚠️  Starting without a database connection; account features will return 503.");
  });

const server = app.listen(config.port, "0.0.0.0", () => {
  console.log(`🚀 Portfolio backend server running on port ${config.port} [${config.nodeEnv}]`);
});

const shutdown = (signal) => {
  console.log(`\n${signal} received — shutting down.`);
  server.close(() => process.exit(0));
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

export default app;
