"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.AuthToken, { foreignKey: "userId" });
      User.hasMany(models.OAuthAccount, { foreignKey: "userId" });
      User.hasOne(models.UserPresence, { foreignKey: "userId" });
      User.hasMany(models.Friend, { foreignKey: "userId", as: "friends" });
      User.hasMany(models.Friend, { foreignKey: "friendId", as: "friendOf" });
      User.hasMany(models.FriendRequest, { foreignKey: "senderId", as: "sentRequests" });
      User.hasMany(models.FriendRequest, { foreignKey: "receiverId", as: "receivedRequests" });
      User.hasMany(models.ConversationMember, { foreignKey: "userId" });
      User.hasMany(models.ConversationSetting, { foreignKey: "userId" });
      User.hasMany(models.Message, { foreignKey: "senderId" });
      User.hasMany(models.ReactionMessage, { foreignKey: "userId" });
    }
  }

  User.init(
    {
      userId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
      },
      firstName: {
        type: DataTypes.STRING(100),
      },
      lastName: {
        type: DataTypes.STRING(100),
      },
      email: {
        type: DataTypes.STRING(150),
        unique: true,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      emailVerifiedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      avatar: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      cover: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      bio: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "User",
      timestamps: true,
      createdAt: "createdAt",
      updatedAt: "updatedAt",
      indexes: [
        { fields: ["deletedAt"] },
        { fields: ["email", "deletedAt"] },
        { fields: ["createdAt"] },
      ],
    }
  );

  return User;
};
