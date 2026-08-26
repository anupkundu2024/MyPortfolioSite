import mongoose from "mongoose";

/**
 * Lightweight audit trail for CV access.
 *
 * Stores only which account performed which action and when — no IP addresses,
 * no user agents, no behavioural tracking. Entries expire automatically after
 * 180 days so the log does not accumulate indefinitely.
 */
const cvAccessLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    action: {
      type: String,
      enum: ["cv_view", "cv_download"],
      required: true,
    },

    accessedAt: {
      type: Date,
      default: () => new Date(),
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

// Automatic retention limit (180 days).
cvAccessLogSchema.index(
  { accessedAt: 1 },
  { expireAfterSeconds: 180 * 24 * 60 * 60, name: "ttl_accessedAt" }
);

export const CvAccessLog =
  mongoose.models.CvAccessLog || mongoose.model("CvAccessLog", cvAccessLogSchema);

export default CvAccessLog;
