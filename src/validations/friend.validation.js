const { checkSchema } = require("express-validator");
const validate = require("../utils/validate");
const { FRIEND_MESSAGES, COMMON_MESSAGES } = require("../constants/messages");

const sendRequestValidator = validate(
  checkSchema(
    {
      receiverId: {
        notEmpty: { errorMessage: FRIEND_MESSAGES.RECEIVER_ID_REQUIRED },
        isString: { errorMessage: FRIEND_MESSAGES.RECEIVER_ID_INVALID },
        trim: true,
      },
    },
    ["body"],
  ),
);

const friendRequestIdValidator = validate(
  checkSchema(
    {
      friendRequestId: {
        notEmpty: { errorMessage: FRIEND_MESSAGES.FRIEND_REQUEST_ID_REQUIRED },
        isString: { errorMessage: FRIEND_MESSAGES.FRIEND_REQUEST_ID_INVALID },
        trim: true,
      },
    },
    ["params"],
  ),
);

const friendIdValidator = validate(
  checkSchema(
    {
      friendId: {
        notEmpty: { errorMessage: FRIEND_MESSAGES.FRIEND_ID_REQUIRED },
        isString: { errorMessage: FRIEND_MESSAGES.FRIEND_ID_INVALID },
        trim: true,
      },
    },
    ["params"],
  ),
);

const paginationValidator = validate(
  checkSchema(
    {
      page: {
        optional: true,
        isInt: { options: { min: 1 }, errorMessage: COMMON_MESSAGES.PAGE_INVALID },
        toInt: true,
      },
      limit: {
        optional: true,
        isInt: { options: { min: 1, max: 100 }, errorMessage: COMMON_MESSAGES.LIMIT_INVALID },
        toInt: true,
      },
    },
    ["query"],
  ),
);

const getFriendsValidator = validate(
  checkSchema(
    {
      page: {
        optional: true,
        isInt: { options: { min: 1 }, errorMessage: COMMON_MESSAGES.PAGE_INVALID },
        toInt: true,
      },
      limit: {
        optional: true,
        isInt: { options: { min: 1, max: 100 }, errorMessage: COMMON_MESSAGES.LIMIT_INVALID },
        toInt: true,
      },
      search: {
        optional: true,
        isString: { errorMessage: FRIEND_MESSAGES.SEARCH_INVALID },
        trim: true,
      },
    },
    ["query"],
  ),
);

module.exports = {
  sendRequestValidator,
  friendRequestIdValidator,
  friendIdValidator,
  paginationValidator,
  getFriendsValidator,
};
