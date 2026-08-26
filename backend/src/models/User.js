import mongoose from "mongoose";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Minimal account record backing the authenticated CV gate.
 *
 * Only the fields genuinely needed to manage access are stored:
 * name, email, authProvider, consent timestamp and access timestamps.
 * No phone number, address, date of birth, IDs or IP addresses.
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
      minlength: [2, "Name must be at least 2 characters."],
      maxlength: [80, "Name must be 80 characters or fewer."],
    },

    email: {
      type: String,
      required: [true, "Email is required."],
      trim: true,
      lowercase: true,
      maxlength: [254, "Email is too long."],
      match: [EMAIL_PATTERN, "Please provide a valid email address."],
    },

    /**
     * bcrypt hash — never a plaintext password.
     * `select: false` keeps it out of every query result unless explicitly requested.
     */
    passwordHash: {
      type: String,
      select: false,
      default: undefined,
    },

    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
      required: true,
    },

    // Optional, only populated by external identity providers.
    profileImage: {
      type: String,
      trim: true,
      default: undefined,
    },

    // Explicit record of the consent checkbox shown before account creation.
    consentAcceptedAt: {
      type: Date,
      default: undefined,
    },

    lastLoginAt: {
      type: Date,
      default: undefined,
    },

    lastCvAccessAt: {
      type: Date,
      default: undefined,
    },

    cvAccessCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true, // createdAt / updatedAt
    versionKey: false,
  }
);

// One account per email address.
userSchema.index({ email: 1 }, { unique: true, name: "uniq_email" });

/** Shape sent to the browser. Deliberately excludes any credential material. */
userSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: String(this._id),
    name: this.name,
    email: this.email,
    authProvider: this.authProvider,
    profileImage: this.profileImage,
    createdAt: this.createdAt,
    lastLoginAt: this.lastLoginAt,
    lastCvAccessAt: this.lastCvAccessAt,
  };
};

// Hard guarantee: the hash can never leak through res.json(user).
userSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.passwordHash;
    return ret;
  },
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
