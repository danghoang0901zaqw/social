const STATUS_CODES = require("../constants/statusCode");

class AppError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status || STATUS_CODES.INTERNAL_SERVER_ERROR;
    this.statusCode = `${this.status}`.startsWith("4") ? "fail" : "error";
    Error.captureStackTrace(this, this.constructor);
  }
}

const sendErrorDev = (err, res) => {
  const status = err.status || STATUS_CODES.INTERNAL_SERVER_ERROR;
  res.status(status).json({
    status,
    message: err.message,
    errors: err.errors || undefined,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  const status = err.status || STATUS_CODES.INTERNAL_SERVER_ERROR;
  res.status(status).json({
    status,
    message: err.message,
    errors: err.errors || undefined,
  });
};

const errorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else {
    sendErrorProd(err, res);
  }
};

module.exports = { AppError, errorHandler };
