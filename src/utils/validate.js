const { validationResult } = require("express-validator");
const STATUS_CODES = require("../constants/statusCode");
const { AppError } = require("../middlewares/errorHandler.middlewares");

const validate = (validation) => {
  return async (req, res, next) => {
    await validation.run(req);
    const errors = validationResult(req);
    if (errors.isEmpty()) return next();
    const errorObject = errors.mapped();
    for (const key in errorObject) {
      const { msg } = errorObject[key];
      return next(new AppError(msg, STATUS_CODES.UNPROCESSABLE_ENTITY));
    }
  };
};
module.exports = validate;
