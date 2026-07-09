const { StatusCodes } = require('http-status-codes');

module.exports = (err, req, res, next) => {
  console.error(err);

  let statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  let message = err.message || 'Internal server error';
  let errors = err.errors || [];

  if (err.name === 'ValidationError') {
    statusCode = StatusCodes.BAD_REQUEST;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((e) => e.message);
  }

  if (err.code === 11000) {
    statusCode = StatusCodes.CONFLICT;
    message = 'Duplicate field value';
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};