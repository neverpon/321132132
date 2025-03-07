const logger = require('../utils/logger');

class AppError extends Error {
  constructor(statusCode, code, message, details = {}) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;
  error.code = err.code || 'INTERNAL_SERVER_ERROR';

  if (error.statusCode === 500) {
    logger.error(`[${req.method}] ${req.path} >> ${error.message}`, {
      error: err,
      stack: err.stack,
      body: req.body,
      params: req.params,
      query: req.query
    });
  } else {
    logger.warn(`[${req.method}] ${req.path} >> ${error.statusCode}: ${error.message}`);
  }

  if (err.name === 'ValidationError') {
    const details = {};
    for (const field in err.errors) {
      details[field] = err.errors[field].message;
    }
    error = new AppError(400, 'VALIDATION_ERROR', 'Invalid input data', details);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = new AppError(
      400,
      'DUPLICATE_ERROR',
      `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
      { field }
    );
  }

  if (err.name === 'CastError') {
    error = new AppError(
      400,
      'INVALID_ID',
      `Invalid ${err.path}: ${err.value}`,
      { path: err.path }
    );
  }

  // Handle CSRF errors
  if (err.code === 'EBADCSRFTOKEN') {
    error = new AppError(403, 'INVALID_CSRF_TOKEN', 'Invalid or missing CSRF token');
  }

  res.status(error.statusCode).json({
    error: {
      code: error.code,
      message: error.message,
      details: error.details || {}
    }
  });
};

module.exports = {
  AppError,
  errorHandler
};