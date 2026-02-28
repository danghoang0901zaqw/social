
-- =========================================================
-- FULL PRODUCTION CHAT SYSTEM SCHEMA
-- Includes: Auth, OAuth, Presence, Friend, Conversation,
-- Message Core, Read System, Reaction, Stat Optimization
-- =========================================================

-- =========================
-- USER
-- =========================
CREATE TABLE User (
    userId BIGINT PRIMARY KEY,

    firstName VARCHAR(100),
    lastName VARCHAR(100),
    email VARCHAR(150) UNIQUE,

    emailVerifiedAt DATETIME NULL,
    avatar VARCHAR(500) NULL,
    cover VARCHAR(500) NULL,
    bio VARCHAR(500) NULL,

    deletedAt DATETIME NULL,

    createdAt DATETIME,
    updatedAt DATETIME,

    INDEX(deletedAt),
    INDEX(email, deletedAt),
    INDEX(createdAt)
);

-- =========================
-- AUTH TOKEN
-- =========================
CREATE TABLE AuthToken (
    id BIGINT PRIMARY KEY,
    userId BIGINT NOT NULL,

    type ENUM('refresh','reset_password','verify_email','login_otp'),
    tokenHash VARCHAR(255),

    expiredAt DATETIME,
    usedAt DATETIME NULL,

    ip VARCHAR(100),
    userAgent VARCHAR(500),

    createdAt DATETIME,
    updatedAt DATETIME,

    INDEX(userId),
    INDEX(tokenHash),
    INDEX(userId, type),
    INDEX(expiredAt),

    FOREIGN KEY (userId) REFERENCES User(userId)
);

-- =========================
-- OAUTH ACCOUNT
-- =========================
CREATE TABLE OAuthAccount (
    id BIGINT PRIMARY KEY,
    userId BIGINT NOT NULL,

    provider ENUM('google','facebook','github','apple'),
    providerUserId VARCHAR(255) NOT NULL,
    providerEmail VARCHAR(255) NULL,

    accessToken TEXT NULL,
    refreshToken TEXT NULL,
    tokenExpiredAt DATETIME NULL,

    createdAt DATETIME,
    updatedAt DATETIME,

    UNIQUE(provider, providerUserId),
    INDEX(userId),

    FOREIGN KEY (userId) REFERENCES User(userId)
);

-- =========================
-- USER PRESENCE
-- =========================
CREATE TABLE UserPresence (
    userId BIGINT PRIMARY KEY,

    status ENUM('online','offline','away'),
    lastActiveAt DATETIME,

    createdAt DATETIME,
    updatedAt DATETIME,

    INDEX(status, lastActiveAt),

    FOREIGN KEY (userId) REFERENCES User(userId)
);

-- =========================
-- FRIEND
-- =========================
CREATE TABLE Friend (
    id BIGINT PRIMARY KEY,
    userId BIGINT,
    friendId BIGINT,

    createdAt DATETIME,
    updatedAt DATETIME,

    UNIQUE(userId, friendId),
    INDEX(userId),
    INDEX(friendId),

    FOREIGN KEY (userId) REFERENCES User(userId),
    FOREIGN KEY (friendId) REFERENCES User(userId)
);

-- =========================
-- FRIEND REQUEST
-- =========================
CREATE TABLE FriendRequest (
    friendRequestId BIGINT PRIMARY KEY,

    senderId BIGINT,
    receiverId BIGINT,

    status ENUM('pending','accepted','rejected','cancelled'),

    createdAt DATETIME,
    updatedAt DATETIME,

    UNIQUE(senderId, receiverId),
    INDEX(receiverId),
    INDEX(receiverId, status),
    INDEX(senderId, status),

    FOREIGN KEY (senderId) REFERENCES User(userId),
    FOREIGN KEY (receiverId) REFERENCES User(userId)
);

-- =========================
-- CONVERSATION
-- =========================
CREATE TABLE Conversation (
    conversationId BIGINT PRIMARY KEY,

    conversationName VARCHAR(255),
    type ENUM('private','group','channel'),

    deletedAt DATETIME NULL,

    createdAt DATETIME,
    updatedAt DATETIME,

    INDEX(type),
    INDEX(deletedAt)
);

-- =========================
-- CONVERSATION MEMBER
-- =========================
CREATE TABLE ConversationMember (
    id BIGINT PRIMARY KEY,

    conversationId BIGINT,
    userId BIGINT,

    role ENUM('member','admin','owner'),
    joinedAt DATETIME,

    createdAt DATETIME,
    updatedAt DATETIME,

    UNIQUE(conversationId, userId),
    INDEX(userId),

    FOREIGN KEY (conversationId) REFERENCES Conversation(conversationId),
    FOREIGN KEY (userId) REFERENCES User(userId)
);

-- =========================
-- CONVERSATION SETTING
-- =========================
CREATE TABLE ConversationSetting (
    id BIGINT PRIMARY KEY,

    conversationId BIGINT,
    userId BIGINT,

    isMuted BOOLEAN,
    isPinned BOOLEAN,
    isArchived BOOLEAN,

    createdAt DATETIME,
    updatedAt DATETIME,

    UNIQUE(conversationId, userId),
    INDEX(userId),

    FOREIGN KEY (conversationId) REFERENCES Conversation(conversationId),
    FOREIGN KEY (userId) REFERENCES User(userId)
);

-- =========================
-- MESSAGE
-- =========================
CREATE TABLE Message (
    messageId BIGINT PRIMARY KEY,

    conversationId BIGINT,
    messageSeq BIGINT,
    senderId BIGINT,

    replyToMessageId BIGINT NULL,

    content TEXT,
    messageType ENUM('text','image','video','file','system'),

    deletedAt DATETIME NULL,
    createdAt DATETIME,
    updatedAt DATETIME,

    INDEX(conversationId, messageSeq),
    INDEX(conversationId, createdAt),
    INDEX(senderId),
    INDEX(replyToMessageId),
    INDEX(conversationId, deletedAt, messageSeq),

    FOREIGN KEY (conversationId) REFERENCES Conversation(conversationId),
    FOREIGN KEY (senderId) REFERENCES User(userId),
    FOREIGN KEY (replyToMessageId) REFERENCES Message(messageId)
);

-- =========================
-- MESSAGE MEDIA
-- =========================
CREATE TABLE MessageMedia (
    id BIGINT PRIMARY KEY,

    messageId BIGINT,
    mediaUrl VARCHAR(500),
    mediaType ENUM('image','video','audio','file'),
    fileSize BIGINT,

    createdAt DATETIME,
    updatedAt DATETIME,

    INDEX(messageId),

    FOREIGN KEY (messageId) REFERENCES Message(messageId)
);

-- =========================
-- REACTION
-- =========================
CREATE TABLE Reaction (
    reactionId INT PRIMARY KEY,
    reactionName VARCHAR(100),
    reactionUrl VARCHAR(255),

    createdAt DATETIME,
    updatedAt DATETIME
);

CREATE TABLE ReactionMessage (
    id BIGINT PRIMARY KEY,

    messageId BIGINT,
    reactionId INT,
    userId BIGINT,

    createdAt DATETIME,
    updatedAt DATETIME,

    UNIQUE(messageId, reactionId, userId),
    INDEX(messageId),
    INDEX(userId),

    FOREIGN KEY (messageId) REFERENCES Message(messageId),
    FOREIGN KEY (reactionId) REFERENCES Reaction(reactionId),
    FOREIGN KEY (userId) REFERENCES User(userId)
);

-- =========================
-- CONVERSATION READ
-- =========================
CREATE TABLE ConversationRead (
    id BIGINT PRIMARY KEY,

    conversationId BIGINT,
    userId BIGINT,

    lastReadMessageSeq BIGINT,
    lastReadAt DATETIME,

    createdAt DATETIME,
    updatedAt DATETIME,

    UNIQUE(conversationId, userId),
    INDEX(userId)
);

-- =========================
-- CONVERSATION STAT
-- =========================
CREATE TABLE ConversationStat (
    conversationId BIGINT PRIMARY KEY,

    lastMessageId BIGINT,
    lastMessageSeq BIGINT,
    lastMessageAt DATETIME,

    messageCount BIGINT,

    createdAt DATETIME,
    updatedAt DATETIME,

    INDEX(lastMessageAt),

    FOREIGN KEY (conversationId) REFERENCES Conversation(conversationId)
);
