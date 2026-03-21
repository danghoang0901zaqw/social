const { Router } = require("express");
const {
  signInValidator,
  signUpValidator,
  refreshTokenValidator,
  signOutValidator,
  forgotPasswordValidator,
  verifyPasswordTokenValidator,
  resetPasswordValidator,
} = require("../validations/auth.validation");
const catchAsync = require("../middlewares/catchAsync.middlewares");
const { authenticate } = require("../middlewares/auth.middlewares");
const passport = require("../config/passport");
const AuthControllers = require("../controllers/auth.controllers");
const authRouter = Router();

authRouter.post(
  "/sign-up",
  signUpValidator,
  catchAsync(AuthControllers.signUp),
);
authRouter.post(
  "/sign-in",
  signInValidator,
  catchAsync(AuthControllers.signIn),
);
authRouter.post(
  "/refresh-token",
  authenticate,
  refreshTokenValidator,
  catchAsync(AuthControllers.refreshToken),
);
authRouter.post(
  "/sign-out",
  authenticate,
  signOutValidator,
  catchAsync(AuthControllers.signOut),
);

authRouter.post(
  "/forgot-password",
  forgotPasswordValidator,
  catchAsync(AuthControllers.forgotPassword),
);

authRouter.post(
  "/verify-password-token",
  verifyPasswordTokenValidator,
  catchAsync(AuthControllers.verifyPasswordToken),
);

authRouter.post(
  "/reset-password",
  resetPasswordValidator,
  catchAsync(AuthControllers.resetPassword),
);

// // Passport OAuth routes (redirect + callback)

// authRouter.get(
//   "/oauth/google",
//   passport.authenticate("google", { scope: ["profile", "email"] }),
// );

// authRouter.get("/oauth/google/callback", (req, res, next) => {
//   passport.authenticate("google", { session: false }, async (err, data) => {
//     if (err) return next(err);
//     try {
//       const { provider, profile, accessToken, refreshToken } = data;
//       const result = await AuthServices.oauthFromProfile(provider, profile, accessToken, refreshToken);
//       const redirectTo = process.env.OAUTH_SUCCESS_REDIRECT;
//       if (redirectTo) {
//         return res.redirect(`${redirectTo}?accessToken=${result.accessToken}&refreshToken=${result.refreshToken}`);
//       }
//       return res.status(200).json({ status: 200, message: "Sign in successfully", data: result });
//     } catch (e) {
//       return next(e);
//     }
//   })(req, res, next);
// });

// authRouter.get(
//   "/oauth/facebook",
//   passport.authenticate("facebook", { scope: ["email"] }),
// );

// authRouter.get("/oauth/facebook/callback", (req, res, next) => {
//   passport.authenticate("facebook", { session: false }, async (err, data) => {
//     if (err) return next(err);
//     try {
//       const { provider, profile, accessToken, refreshToken } = data;
//       const result = await AuthServices.oauthFromProfile(provider, profile, accessToken, refreshToken);
//       const redirectTo = process.env.OAUTH_SUCCESS_REDIRECT;
//       if (redirectTo) {
//         return res.redirect(`${redirectTo}?accessToken=${result.accessToken}&refreshToken=${result.refreshToken}`);
//       }
//       return res.status(200).json({ status: 200, message: "Sign in successfully", data: result });
//     } catch (e) {
//       return next(e);
//     }
//   })(req, res, next);
// });

module.exports = authRouter;
