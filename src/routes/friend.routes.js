const { Router } = require("express");
const catchAsync = require("../middlewares/catchAsync.middlewares");
const { authenticate } = require("../middlewares/auth.middlewares");
const FriendControllers = require("../controllers/friend.controllers");
const {
  sendRequestValidator,
  friendRequestIdValidator,
  friendIdValidator,
  paginationValidator,
  getFriendsValidator,
} = require("../validations/friend.validation");

const friendRouter = Router();

friendRouter.use(authenticate);

friendRouter.get(
  "/",
  getFriendsValidator,
  catchAsync(FriendControllers.getFriends),
);
friendRouter.post(
  "/request",
  sendRequestValidator,
  catchAsync(FriendControllers.sendRequest),
);
friendRouter.get(
  "/request/received",
  paginationValidator,
  catchAsync(FriendControllers.getReceivedRequests),
);
friendRouter.get(
  "/request/sent",
  paginationValidator,
  catchAsync(FriendControllers.getSentRequests),
);
friendRouter.delete(
  "/request/:friendRequestId",
  friendRequestIdValidator,
  catchAsync(FriendControllers.cancelRequest),
);
friendRouter.patch(
  "/request/:friendRequestId/accept",
  friendRequestIdValidator,
  catchAsync(FriendControllers.acceptRequest),
);
friendRouter.patch(
  "/request/:friendRequestId/reject",
  friendRequestIdValidator,
  catchAsync(FriendControllers.rejectRequest),
);
friendRouter.delete(
  "/:friendId",
  friendIdValidator,
  catchAsync(FriendControllers.unfriend),
);

module.exports = friendRouter;
