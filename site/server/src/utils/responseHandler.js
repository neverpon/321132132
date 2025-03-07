/**
 * @param {object} res
 * @param {number} statusCode 
 * @param {object|array} data
 */
exports.successResponse = (res, statusCode, data) => {
    res.status(statusCode).json(data);
  };
  
  /**
   * @param {object} res
   * @param {number} statusCode
   * @param {string} code
   * @param {string} message
   * @param {object} details
   */
  exports.errorResponse = (res, statusCode, code, message, details = {}) => {
    res.status(statusCode).json({
      error: {
        code,
        message,
        details
      }
    });
  };