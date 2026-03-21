const AUTH_MESSAGES = {
  FIRST_NAME_REQUIRED: "First name is required",
  LAST_NAME_REQUIRED: "Last name is required",
  EMAIL_REQUIRED: "Email is required",
  EMAIL_INVALID: "Invalid email format",
  PASSWORD_REQUIRED: "Password is required",
  SIGN_UP_SUCCESS: "Sign up successfully",
  SIGN_IN_SUCCESS: "Sign in successfully",
  EMAIL_ALREADY_EXISTS: "Email already exists",
  INVALID_CREDENTIALS: "Email or password is incorrect",
  TOKEN_REQUIRED: "Access token is required",
  TOKEN_INVALID: "Token is invalid or expired",
  REFRESH_TOKEN_REQUIRED: "Refresh token is required",
  REFRESH_TOKEN_INVALID: "Refresh token is invalid or expired",
  REFRESH_TOKEN_SUCCESS: "Token refreshed successfully",
  SIGN_OUT_SUCCESS: "Sign out successfully",
  USER_NOT_FOUND: "User not found",
  TOKEN_REUSE_DETECTED: "Token reuse detected",
  REFRESH_TOKEN_EXPIRED: "Refresh token has expired",
  EMAIL_NOT_FOUND: "Email not found",
  FORGOT_PASSWORD_SUCCESS: "Forgot password request successfully",
  PASSWORD_RESET_SUCCESS: "Password reset successfully",
  RESET_PASSWORD_TOKEN_REQUIRED: "Reset password token is required",
  RESET_PASSWORD_TOKEN_INVALID: "Reset password token is invalid",
  RESET_PASSWORD_TOKEN_EXPIRED: "Reset password token has expired",
  VERIFY_RESET_PASSWORD_TOKEN_SUCCESS: "Reset password token is valid",
};

const USER_MESSAGES = {};

const COMMON_MESSAGES = {
  PAGE_INVALID: "Page number is invalid",
  LIMIT_INVALID: "Limit number is invalid",
};

module.exports = {
  AUTH_MESSAGES,
  USER_MESSAGES,
  COMMON_MESSAGES,
};
