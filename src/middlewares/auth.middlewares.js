const dotenv = require("dotenv");
dotenv.config({ path: "./.env.development" });

const { AppError } = require("./errorHandler.middlewares");
const STATUS_CODES = require("../constants/statusCode");
const { AUTH_MESSAGES } = require("../constants/messages");
const { verifyToken } = require("../utils/jwt");

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(
      new AppError(AUTH_MESSAGES.TOKEN_REQUIRED, STATUS_CODES.UNAUTHORIZED),
    );
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET);
    if (!decoded || !decoded.userId) {
      return next(
        new AppError(AUTH_MESSAGES.USER_NOT_FOUND, STATUS_CODES.UNAUTHORIZED),
      );
    }
    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    console.log(error)
    return next(
      new AppError(AUTH_MESSAGES.TOKEN_INVALID, STATUS_CODES.UNAUTHORIZED),
    );
  }
};

module.exports = { authenticate };
