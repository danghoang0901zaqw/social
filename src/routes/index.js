const STATUS_CODES = require("../constants/statusCode");
const { AppError } = require("../middlewares/errorHandler.middlewares");
const authRouter = require("./auth.routes");
const routes = (app) => {
  app.use("/v1/auth", authRouter);
  app.all(/(.*)/, (req, res, next) => {
    next(
      new AppError(
        `Can't find ${req.originalUrl} on this server!`,
        STATUS_CODES.NOT_FOUND,
      ),
    );
  });
};

module.exports = routes;
