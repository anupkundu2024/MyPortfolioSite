/**
 * Contact Service Layer
 * Encapsulates validation and submission processing
 */
export const processContactSubmission = async ({ name, email, subject, message }) => {
  if (!name || !email || !message) {
    const error = new Error("Missing required contact fields: name, email, and message are mandatory.");
    error.status = 400;
    throw error;
  }

  // Future integration: Forward to email provider (e.g. Nodemailer, Resend, or Web3Forms backend)
  return {
    submittedAt: new Date().toISOString(),
    name,
    email,
    subject: subject || "No Subject",
    status: "received",
  };
};
