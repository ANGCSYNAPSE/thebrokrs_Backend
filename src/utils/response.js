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
    success: true,
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
  return {
    success: false,
    message,
  };
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
 * Map an internal/raw error to a short, safe, client-facing message.
 * Never leak stack traces, DB column/table names, connection strings,
 * or provider-specific internals — those stay in server-side logs only.
 * @param {any} error - The caught error object
 * @returns {string} Short, safe message describing the category of failure
 */
const getSafeErrorMessage = (error) => {
  if (!error) return 'Something went wrong. Please try again later.';

  // JWT / authorization errors
  if (['JsonWebTokenError', 'TokenExpiredError', 'NotBeforeError'].includes(error.name)) {
    return 'Authorization token is missing, invalid, or expired.';
  }

  // Network / connectivity errors (DB unreachable, external service down, etc.)
  if (['ECONNREFUSED', 'ETIMEDOUT', 'ENOTFOUND', 'ECONNRESET', 'EAI_AGAIN'].includes(error.code)) {
    return 'Service is temporarily unavailable. Please try again later.';
  }

  // Prisma known error codes (https://www.prisma.io/docs/reference/api-reference/error-reference)
  if (typeof error.code === 'string' && error.code.startsWith('P')) {
    switch (error.code) {
      case 'P2002':
        return 'A record with this information already exists.';
      case 'P2025':
        return 'The requested record was not found.';
      case 'P2003':
        return 'This action references data that does not exist.';
      case 'P1001':
      case 'P1002':
        return 'Unable to reach the database. Please try again later.';
      default:
        // Includes P2021/P2022 (missing table/column) and any other schema
        // or query errors — these indicate a server-side misconfiguration,
        // never something the client can fix or needs the details of.
        return 'A server error occurred. Please try again later or contact support.';
    }
  }

  // Fallback for any other unexpected/internal error
  return 'Something went wrong on our end. Please try again later.';
};

/**
 * Send Error Response
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code (default: 400)
 * @param {string} message - Error message
 * @param {any} error - Error details (optional). When provided, the raw
 *   error is logged server-side only, and the client receives a short,
 *   safe, categorized message instead of the raw `message` argument.
 */
export const sendError = (res, message, statusCode = 400, error = null) => {
  let clientMessage = message;

  if (error) {
    // eslint-disable-next-line no-console
    console.error('Internal error:', error);
    clientMessage = getSafeErrorMessage(error);
  }

  res.status(statusCode).json(errorResponse(clientMessage));
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
