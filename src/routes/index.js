const STATUS_CODES = require("../constants/statusCode");
const { AppError } = require("../middlewares/errorHandler.middlewares");
const authRouter = require("./auth.routes");
const userRouter = require("./user.routes");
const friendRouter = require("./friend.routes");
const routes = (app) => {
  app.use("/v1/auth", authRouter);
  app.use("/v1/user", userRouter);
  app.use("/v1/friends", friendRouter);
  app.all(/(.*)/, (req, _res, next) => {
    next(
      new AppError(
        `Can't find ${req.originalUrl} on this server!`,
        STATUS_CODES.NOT_FOUND,
      ),
    );
  });
};

module.exports = routes;
