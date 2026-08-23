import { processContactSubmission } from "../services/contactService.js";
import { sendSuccess } from "../utils/responseHandler.js";

/**
 * Controller to handle incoming contact submissions
 */
export const handleContactForm = async (req, res, next) => {
  try {
    const result = await processContactSubmission(req.body);
    return sendSuccess(res, result, "Contact message received successfully.", 201);
  } catch (error) {
    next(error);
  }
};
