import dotenv from "dotenv";
dotenv.config();

const nodeEnv = process.env.NODE_ENV || "development";
const isProduction = nodeEnv === "production";

/**
 * Normalize a comma-separated origin list into a clean, de-duplicated array.
 * Trailing slashes are stripped because the browser never sends them in `Origin`.
 */
const parseOrigins = (...sources) => {
  const origins = sources
    .flatMap((source) => String(source || "").split(","))
    .map((origin) => origin.trim().replace(/\/+$/, ""))
    .filter(Boolean);

  return [...new Set(origins)];
};

// Local Vite dev server (see frontend/vite.config.js -> server.port)
const DEV_ORIGINS = ["http://localhost:8080", "http://127.0.0.1:8080"];
// Production frontend deployed on Vercel
const PROD_ORIGINS = ["https://anupportfolio2025.vercel.app"];

const allowedOrigins = parseOrigins(
  process.env.ALLOWED_ORIGINS,
  process.env.CLIENT_ORIGIN,
  isProduction ? PROD_ORIGINS : DEV_ORIGINS
);

const toInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const sessionTtlDays = toInt(process.env.SESSION_TTL_DAYS, 7);

export const config = {
  port: toInt(process.env.PORT, 5000),
  nodeEnv,
  isProduction,

  // Retained for backwards compatibility with the original single-origin setup
  clientOrigin: process.env.CLIENT_ORIGIN || DEV_ORIGINS[0],
  allowedOrigins,

  mongoUri: process.env.MONGODB_URI || "",

  jwt: {
    secret: process.env.JWT_SECRET || "",
    // Long-lived browser session for the CV gate
    sessionTtlSeconds: sessionTtlDays * 24 * 60 * 60,
    // Very short-lived, single-purpose token used only to open/download the PDF
    cvTicketTtlSeconds: toInt(process.env.CV_TICKET_TTL_SECONDS, 300),
  },

  cookie: {
    name: process.env.SESSION_COOKIE_NAME || "pf_session",
  },

  cv: {
    // "file"     -> stream backend/private/<fileName>
    // "proxy"    -> stream CV_EXTERNAL_URL through this server (URL stays server-side)
    // "redirect" -> authenticated 302 to CV_EXTERNAL_URL (browser sees the URL)
    source: (process.env.CV_SOURCE || "file").toLowerCase(),
    fileName: process.env.CV_FILE_NAME || "Anup-Kundu-CV.pdf",
    downloadName: process.env.CV_DOWNLOAD_NAME || "Anup-Kundu-CV.pdf",
    externalUrl: process.env.CV_EXTERNAL_URL || "",
  },

  bcryptRounds: toInt(process.env.BCRYPT_ROUNDS, 12),
};

/**
 * Fail fast on misconfiguration rather than booting an insecure service.
 * In development we only warn so the API stays runnable without a full .env.
 */
export const validateConfig = () => {
  const problems = [];

  if (!config.jwt.secret) {
    problems.push("JWT_SECRET is not set — authentication cannot be used.");
  } else if (config.jwt.secret.length < 32) {
    problems.push("JWT_SECRET is shorter than 32 characters — use a longer random value.");
  }

  if (!config.mongoUri) {
    problems.push("MONGODB_URI is not set — user accounts cannot be persisted.");
  }

  if (!["file", "proxy", "redirect"].includes(config.cv.source)) {
    problems.push(`CV_SOURCE must be "file", "proxy" or "redirect" (got "${config.cv.source}").`);
  }

  if (config.cv.source !== "file" && !config.cv.externalUrl) {
    problems.push(`CV_SOURCE is "${config.cv.source}" but CV_EXTERNAL_URL is empty.`);
  }

  if (config.cv.externalUrl && !/^https:\/\//i.test(config.cv.externalUrl.trim())) {
    problems.push("CV_EXTERNAL_URL must be an https URL.");
  }

  if (!config.allowedOrigins.length) {
    problems.push("No allowed CORS origins resolved — set ALLOWED_ORIGINS.");
  }

  if (problems.length && config.isProduction) {
    throw new Error(`Invalid production configuration:\n- ${problems.join("\n- ")}`);
  }

  problems.forEach((problem) => console.warn(`⚠️  Config: ${problem}`));

  return problems;
};
