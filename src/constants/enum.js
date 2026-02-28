module.exports = {
  AUTH_TOKEN_TYPE: {
    REFRESH: "refresh",
    RESET_PASSWORD: "reset_password",
    VERIFY_EMAIL: "verify_email",
    LOGIN_OTP: "login_otp",
  },

  OAUTH_PROVIDER: {
    GOOGLE: "google",
    FACEBOOK: "facebook",
    GITHUB: "github",
    APPLE: "apple",
  },

  PRESENCE_STATUS: {
    ONLINE: "online",
    OFFLINE: "offline",
    AWAY: "away",
  },

  FRIEND_REQUEST_STATUS: {
    PENDING: "pending",
    ACCEPTED: "accepted",
    REJECTED: "rejected",
    CANCELLED: "cancelled",
  },

  CONVERSATION_TYPE: {
    PRIVATE: "private",
    GROUP: "group",
    CHANNEL: "channel",
  },

  CONVERSATION_MEMBER_ROLE: {
    MEMBER: "member",
    ADMIN: "admin",
    OWNER: "owner",
  },

  MESSAGE_TYPE: {
    TEXT: "text",
    IMAGE: "image",
    VIDEO: "video",
    FILE: "file",
    SYSTEM: "system",
  },

  MEDIA_TYPE: {
    IMAGE: "image",
    VIDEO: "video",
    AUDIO: "audio",
    FILE: "file",
  },
};
