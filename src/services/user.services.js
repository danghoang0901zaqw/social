const db = require("../../database/models");
const { AppError } = require("../middlewares/errorHandler.middlewares");
const STATUS_CODES = require("../constants/statusCode");
const { AUTH_MESSAGES } = require("../constants/messages");

class UserServices {
  async getProfile(userId) {
    const userData = await db.User.findOne({
      where: { userId },
      attributes: { exclude: ["password"] },
    });
    const user = userData?.dataValues;
    if (!user) {
      throw new AppError(AUTH_MESSAGES.USER_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }
    return user;
  }
}

module.exports = new UserServices();
