import dns from "node:dns";
import mongoose from "mongoose";
import { config } from "./default.js";

// Ensure resilient DNS resolution for MongoDB Atlas SRV records in local development
try {
  if (!config.isProduction) {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
  }
} catch {
  // Ignore if custom DNS cannot be set
}

/**
 * Single shared MongoDB connection for the whole service.
 * The promise is memoized so repeated calls never open a second pool.
 */
let connectionPromise = null;

export const connectDatabase = async () => {
  if (!config.mongoUri) {
    console.warn("⚠️  MONGODB_URI is not set — skipping database connection.");
    return null;
  }

  if (connectionPromise) return connectionPromise;

  mongoose.set("strictQuery", true);

  connectionPromise = mongoose
    .connect(config.mongoUri, {
      serverSelectionTimeoutMS: 15000,
      maxPoolSize: 10,
    })
    .then((connection) => {
      console.log(`🗄️  MongoDB connected: ${connection.connection.name}`);
      return connection;
    })
    .catch((error) => {
      // Reset so a later request can retry instead of being stuck on a failed promise.
      connectionPromise = null;
      // Never log the URI — it contains credentials.
      console.error(`❌ MongoDB connection failed: ${error.message}`);
      throw error;
    });

  return connectionPromise;
};

/** 1 === connected. Used to return 503 instead of hanging when Atlas is unreachable. */
export const isDatabaseReady = () => mongoose.connection.readyState === 1;

export const disconnectDatabase = async () => {
  connectionPromise = null;
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
};

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️  MongoDB disconnected.");
});

mongoose.connection.on("reconnected", () => {
  console.log("🗄️  MongoDB reconnected.");
});
