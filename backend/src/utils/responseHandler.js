import { config } from "../config/default.js";

export const sendSuccess = (res, data, message = "Success", statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
};

export const sendError = (res, message = "An error occurred", statusCode = 500, error = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error: config?.nodeEnv === "development" ? error : undefined,
    timestamp: new Date().toISOString(),
  });
};
