/**
 * Standardized API Response Format
 * All API responses follow this format:
 * {
 *   status: true/false,
 *   message: "string",
 *   data: {} (optional),
 *   error: {} (optional)
 * }
 */

/**
 * Success Response
 * @param {string} message - Success message
 * @param {any} data - Response data (optional)
 * @returns {object} Formatted response object
 */
export const successResponse = (message, data = null) => {
  const response = {
    status: true,
    message,
  };
  
  if (data !== null && data !== undefined) {
    response.data = data;
  }
  
  return response;
};

/**
 * Error Response
 * @param {string} message - Error message
 * @param {any} error - Error details (optional)
 * @returns {object} Formatted response object
 */
export const errorResponse = (message, error = null) => {
  const response = {
    status: false,
    message,
  };
  
  if (error !== null && error !== undefined) {
    response.error = error;
  }
  
  return response;
};

/**
 * Send Success Response
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code (default: 200)
 * @param {string} message - Success message
 * @param {any} data - Response data (optional)
 */
export const sendSuccess = (res, message, data = null, statusCode = 200) => {
  res.status(statusCode).json(successResponse(message, data));
};

/**
 * Send Error Response
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code (default: 400)
 * @param {string} message - Error message
 * @param {any} error - Error details (optional)
 */
export const sendError = (res, message, statusCode = 400, error = null) => {
  res.status(statusCode).json(errorResponse(message, error));
};

/**
 * Handle Validation Errors
 * @param {object} res - Express response object
 * @param {array} errors - Array of validation errors
 */
export const sendValidationError = (res, errors) => {
  const message = errors.length > 0 ? errors[0].message : 'Validation error';
  res.status(400).json(errorResponse(message, errors));
};

export default {
  successResponse,
  errorResponse,
  sendSuccess,
  sendError,
  sendValidationError,
};
