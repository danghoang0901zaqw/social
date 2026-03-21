const { checkSchema } = require("express-validator");
const validate = require("../utils/validate");
const { AUTH_MESSAGES } = require("../constants/messages");

const signUpValidator = validate(
  checkSchema(
    {
      firstName: {
        trim: true,
        notEmpty: {
          errorMessage: AUTH_MESSAGES.FIRST_NAME_REQUIRED,
        },
      },
      lastName: {
        trim: true,
        notEmpty: {
          errorMessage: AUTH_MESSAGES.LAST_NAME_REQUIRED,
        },
      },
      email: {
        trim: true,
        notEmpty: {
          errorMessage: AUTH_MESSAGES.EMAIL_REQUIRED,
        },
        isEmail: {
          errorMessage: AUTH_MESSAGES.EMAIL_INVALID,
        },
        normalizeEmail: true,
      },
      password: {
        notEmpty: {
          errorMessage: AUTH_MESSAGES.PASSWORD_REQUIRED,
        },
      },
    },
    ["body"],
  ),
);

const signInValidator = validate(
  checkSchema(
    {
      email: {
        trim: true,
        notEmpty: {
          errorMessage: AUTH_MESSAGES.EMAIL_REQUIRED,
        },
        isEmail: {
          errorMessage: AUTH_MESSAGES.EMAIL_INVALID,
        },
        normalizeEmail: true,
      },
      password: {
        notEmpty: {
          errorMessage: AUTH_MESSAGES.PASSWORD_REQUIRED,
        },
      },
    },
    ["body"],
  ),
);
const signOutValidator = validate(
  checkSchema(
    {
      refreshToken: {
        notEmpty: {
          errorMessage: AUTH_MESSAGES.REFRESH_TOKEN_REQUIRED,
        },
      },
    },
    ["body"],
  ),
);

const refreshTokenValidator = validate(
  checkSchema(
    {
      refreshToken: {
        notEmpty: {
          errorMessage: AUTH_MESSAGES.REFRESH_TOKEN_REQUIRED,
        },
      },
    },
    ["body"],
  ),
);

const forgotPasswordValidator = validate(
  checkSchema(
    {
      email: {
        trim: true,
        notEmpty: {
          errorMessage: AUTH_MESSAGES.EMAIL_REQUIRED,
        },
        isEmail: {
          errorMessage: AUTH_MESSAGES.EMAIL_INVALID,
        },
        normalizeEmail: true,
      },
    },
    ["body"],
  ),
);

const verifyPasswordTokenValidator = validate(
  checkSchema(
    {
      token: {
        notEmpty: {
          errorMessage: AUTH_MESSAGES.RESET_PASSWORD_TOKEN_REQUIRED,
        },
      },
    },
    ["body"],
  ),
);

const resetPasswordValidator = validate(
  checkSchema(
    {
      token: {
        notEmpty: {
          errorMessage: AUTH_MESSAGES.RESET_PASSWORD_TOKEN_REQUIRED,
        },
      },
      newPassword: {
        notEmpty: {
          errorMessage: AUTH_MESSAGES.PASSWORD_REQUIRED,
        },
      },
    },
    ["body"],
  ),
);

const oauthValidator = validate(
  checkSchema(
    {
      providerAccessToken: {
        notEmpty: {
          errorMessage: AUTH_MESSAGES.TOKEN_REQUIRED,
        },
      },
    },
    ["body"],
  ),
);

module.exports = {
  signUpValidator,
  signInValidator,
  signOutValidator,
  refreshTokenValidator,
  forgotPasswordValidator,
  verifyPasswordTokenValidator,
  resetPasswordValidator,
  oauthValidator,
};
