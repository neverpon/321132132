const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/responseHandler');
const User = require('../models/User');
const logger = require('../utils/logger');

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return errorResponse(res, 401, 'UNAUTHORIZED', 'You are not logged in. Please log in to get access');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return errorResponse(res, 401, 'UNAUTHORIZED', 'The user belonging to this token no longer exists');
    }

    if (user.changedPasswordAfter(decoded.iat)) {
      return errorResponse(res, 401, 'UNAUTHORIZED', 'User recently changed password. Please log in again');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return errorResponse(res, 401, 'UNAUTHORIZED', 'Invalid token. Please log in again');
    }
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 401, 'UNAUTHORIZED', 'Your token has expired. Please log in again');
    }

    logger.error('Authentication error:', error);
    return errorResponse(res, 500, 'INTERNAL_SERVER_ERROR', 'An unexpected error occurred');
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return errorResponse(res, 403, 'FORBIDDEN', 'You do not have permission to perform this action');
    }
    next();
  };
};