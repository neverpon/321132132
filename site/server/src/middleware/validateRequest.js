const { validationResult } = require('express-validator');
const { errorResponse } = require('../utils/responseHandler');

exports.validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formattedErrors = {};
      errors.array().forEach(err => {
        formattedErrors[err.path] = err.msg;
      });

      return errorResponse(res, 400, 'VALIDATION_ERROR', 'Invalid input data', formattedErrors);
    }

    next();
  };
};