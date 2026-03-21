const jwt = require("jsonwebtoken");
const { AppError } = require("../middlewares/errorHandler.middlewares");
const STATUS_CODES = require("../constants/statusCode");

const generateToken = ({ userId, secretKey, expiresIn }) => {
  return jwt.sign({ userId }, secretKey, {
    expiresIn: expiresIn,
  });
};

const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new AppError(error.message, STATUS_CODES.UNAUTHORIZED);
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
