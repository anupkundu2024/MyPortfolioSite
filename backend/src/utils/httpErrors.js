/**
 * Helper for creating errors that are safe to show to the client.
 *
 * `expose: true` tells the central error handler that this message was written
 * for a user and may be returned verbatim. Anything without it is reported as a
 * generic message so internal details never reach the browser.
 */
export const httpError = (status, message, extra = {}) => {
  const error = new Error(message);
  error.status = status;
  error.expose = true;
  Object.assign(error, extra);
  return error;
};

export const badRequest = (message) => httpError(400, message);
export const unauthorized = (message = "Authentication required.") => httpError(401, message);
export const forbidden = (message = "You do not have access to this resource.") =>
  httpError(403, message);
export const notFound = (message = "Resource not found.") => httpError(404, message);
export const conflict = (message) => httpError(409, message);
export const serviceUnavailable = (message = "Service temporarily unavailable.") =>
  httpError(503, message);
