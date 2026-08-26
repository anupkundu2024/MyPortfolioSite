import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { config } from "../config/default.js";
import { isDatabaseReady } from "../config/database.js";
import { User } from "../models/User.js";
import { badRequest, conflict, serviceUnavailable, unauthorized } from "../utils/httpErrors.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;

/**
 * A throwaway hash compared against when an email does not exist, so a failed
 * login costs the same time whether or not the account is real. Without this,
 * response timing alone reveals which emails are registered.
 */
let decoyHash = null;
const getDecoyHash = () => {
  if (!decoyHash) {
    decoyHash = bcrypt.hashSync(crypto.randomBytes(24).toString("hex"), config.bcryptRounds);
  }
  return decoyHash;
};

const assertDatabase = () => {
  if (!isDatabaseReady()) {
    throw serviceUnavailable("Accounts are temporarily unavailable. Please try again shortly.");
  }
};

const normalizeEmail = (value) => String(value || "").trim().toLowerCase();

const validateCredentials = ({ email, password }) => {
  const cleanEmail = normalizeEmail(email);

  if (!cleanEmail || !EMAIL_PATTERN.test(cleanEmail) || cleanEmail.length > 254) {
    throw badRequest("Please provide a valid email address.");
  }

  if (typeof password !== "string" || password.length < MIN_PASSWORD_LENGTH) {
    throw badRequest(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
  }

  // bcrypt only ever reads the first 72 bytes; the cap simply bounds the work
  // an unauthenticated request can ask the server to do.
  if (password.length > MAX_PASSWORD_LENGTH) {
    throw badRequest(`Password must be ${MAX_PASSWORD_LENGTH} characters or fewer.`);
  }

  return { email: cleanEmail, password };
};

export const registerUser = async ({ name, email, password, consent }) => {
  assertDatabase();

  const cleanName = String(name || "").trim();
  if (cleanName.length < 2 || cleanName.length > 80) {
    throw badRequest("Please provide your name (2–80 characters).");
  }

  // Consent must be given actively — the checkbox is never pre-checked client side.
  if (consent !== true) {
    throw badRequest("Please agree to the collection of your name and email to continue.");
  }

  const credentials = validateCredentials({ email, password });
  const passwordHash = await bcrypt.hash(credentials.password, config.bcryptRounds);

  try {
    const user = await User.create({
      name: cleanName,
      email: credentials.email,
      passwordHash,
      authProvider: "local",
      consentAcceptedAt: new Date(),
      lastLoginAt: new Date(),
    });

    return user;
  } catch (error) {
    // 11000 = duplicate key on the unique email index.
    if (error?.code === 11000) {
      throw conflict("An account with this email already exists. Please sign in instead.");
    }
    throw error;
  }
};

export const authenticateUser = async ({ email, password }) => {
  assertDatabase();

  const credentials = validateCredentials({ email, password });

  const user = await User.findOne({ email: credentials.email }).select("+passwordHash");

  // Identical message and comparable cost for both failure modes.
  const hash = user?.passwordHash || getDecoyHash();
  const passwordMatches = await bcrypt.compare(credentials.password, hash);

  if (!user || !user.passwordHash || !passwordMatches) {
    throw unauthorized("Invalid email or password.");
  }

  user.lastLoginAt = new Date();
  await user.save();

  return user;
};

export const findUserById = async (id) => {
  assertDatabase();
  if (!id || typeof id !== "string") return null;
  // Guard against CastError on malformed ids from tampered tokens.
  if (!/^[a-f\d]{24}$/i.test(id)) return null;
  return User.findById(id);
};

export const recordCvAccess = async (user, action) => {
  const now = new Date();

  user.lastCvAccessAt = now;
  user.cvAccessCount = (user.cvAccessCount || 0) + 1;

  // Persisted separately so a logging failure can never block CV delivery.
  await user.save();

  return { action, accessedAt: now };
};
