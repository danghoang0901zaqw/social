const UserServices = require("../services/user.services");
const STATUS_CODES = require("../constants/statusCode");
const { USER_MESSAGES } = require("../constants/messages");

class UserControllers {
  async getProfile(req, res) {
    const { userId } = req.user;
    const user = await UserServices.getProfile(userId);
    res.status(STATUS_CODES.OK).json({
      status: STATUS_CODES.OK,
      message: USER_MESSAGES.GET_PROFILE_SUCCESS,
      data: { user },
    });
  }
}

module.exports = new UserControllers();
