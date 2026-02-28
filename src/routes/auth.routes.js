const { Router } = require("express");
const authController = require("../controllers/auth.controllers");
const {
  signInValidator,
  signUpValidator,
} = require("../validations/auth.validation");
const catchAsync = require("../middlewares/catchAsync.middlewares");
const authRouter = Router();

authRouter.post("/sign-in", signInValidator, catchAsync(authController.signIn));
authRouter.post("/sign-up", signUpValidator, catchAsync(authController.signUp));

module.exports = authRouter;
