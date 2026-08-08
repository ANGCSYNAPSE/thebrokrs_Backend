import jwt from 'jsonwebtoken';
import { sendError } from '../utils/response.js';

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return sendError(res, 'Authorization token is required', 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return sendError(res, 'Authorization token is missing, invalid, or expired', 403, error);
  }
};

export const verifyRole = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'Authorization token is required', 401);
    }

    if (!roles.includes(req.user.role)) {
      return sendError(res, 'You do not have permission to perform this action', 403);
    }

    next();
  };
};
