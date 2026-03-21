const AuthServices = require("../services/auth.services");
const STATUS_CODES = require("../constants/statusCode");
const { AUTH_MESSAGES } = require("../constants/messages");

class AuthControllers {
  async signUp(req, res) {
    const { firstName, lastName, email, password } = req.body;
    const { ip } = req;
    const userAgent = req.headers["user-agent"];
    const { user, accessToken, refreshToken } = await AuthServices.signUp({
      ip,
      userAgent,
      firstName,
      lastName,
      email,
      password,
    });
    res.status(STATUS_CODES.CREATED).json({
      status: STATUS_CODES.CREATED,
      message: AUTH_MESSAGES.SIGN_UP_SUCCESS,
      data: { user, accessToken, refreshToken },
    });
  }

  async signIn(req, res) {
    const { email, password } = req.body;
    const { ip } = req;
    const userAgent = req.headers["user-agent"];
    const { user, accessToken, refreshToken } = await AuthServices.signIn({
      email,
      password,
      ip,
      userAgent,
    });
    res.status(STATUS_CODES.OK).json({
      status: STATUS_CODES.OK,
      message: AUTH_MESSAGES.SIGN_IN_SUCCESS,
      data: { user, accessToken, refreshToken },
    });
  }

  async refreshToken(req, res) {
    const { refreshToken } = req.body;
    const tokens = await AuthServices.refreshToken(refreshToken);
    res.status(STATUS_CODES.OK).json({
      status: STATUS_CODES.OK,
      message: AUTH_MESSAGES.REFRESH_TOKEN_SUCCESS,
      data: tokens,
    });
  }

  async signOut(req, res) {
    const { refreshToken } = req.body;
    await AuthServices.signOut(refreshToken);
    res.status(STATUS_CODES.OK).json({
      status: STATUS_CODES.OK,
      message: AUTH_MESSAGES.SIGN_OUT_SUCCESS,
    });
  }

  async forgotPassword(req, res) {
    const { email } = req.body;
    const result = await AuthServices.forgotPassword(email);
    res.status(STATUS_CODES.OK).json({
      status: STATUS_CODES.OK,
      data: result,
      message: AUTH_MESSAGES.FORGOT_PASSWORD_SUCCESS,
    });
  }

  async verifyPasswordToken(req, res) {
    const { token } = req.body;
    await AuthServices.verifyPasswordToken(token);
    res.status(STATUS_CODES.OK).json({
      status: STATUS_CODES.OK,
      message: AUTH_MESSAGES.VERIFY_RESET_PASSWORD_TOKEN_SUCCESS,
    });
  }

  async resetPassword(req, res) {
    const { token, newPassword } = req.body;
    await AuthServices.resetPassword(token, newPassword);
    res.status(STATUS_CODES.OK).json({
      status: STATUS_CODES.OK,
      message: AUTH_MESSAGES.PASSWORD_RESET_SUCCESS,
    });
  }

  async oauthSignIn(req, res) {
    const { provider } = req.params;
    const { providerAccessToken } = req.body;
    const { user, accessToken, refreshToken } = await AuthServices.oauthSignIn({
      provider,
      providerAccessToken,
    });

    res.status(STATUS_CODES.OK).json({
      status: STATUS_CODES.OK,
      message: AUTH_MESSAGES.SIGN_IN_SUCCESS,
      data: { user, accessToken, refreshToken },
    });
  }
}

module.exports = new AuthControllers();
