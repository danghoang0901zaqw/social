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

module.exports = { signUpValidator, signInValidator };
