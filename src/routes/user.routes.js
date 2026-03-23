const { Router } = require("express");
const catchAsync = require("../middlewares/catchAsync.middlewares");
const { authenticate } = require("../middlewares/auth.middlewares");
const UserControllers = require("../controllers/user.controllers");

const userRouter = Router();

userRouter.get(
  "/profile",
  authenticate,
  catchAsync(UserControllers.getProfile),
);

module.exports = userRouter;
