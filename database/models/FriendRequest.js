"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class FriendRequest extends Model {
    static associate(models) {
      FriendRequest.belongsTo(models.User, { foreignKey: "senderId", as: "sender" });
      FriendRequest.belongsTo(models.User, { foreignKey: "receiverId", as: "receiver" });
    }
  }

  FriendRequest.init(
    {
      friendRequestId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
      },
      senderId: {
        type: DataTypes.BIGINT,
      },
      receiverId: {
        type: DataTypes.BIGINT,
      },
      status: {
        type: DataTypes.ENUM("pending", "accepted", "rejected", "cancelled"),
      },
    },
    {
      sequelize,
      modelName: "FriendRequest",
      tableName: "FriendRequest",
      timestamps: true,
      createdAt: "createdAt",
      updatedAt: "updatedAt",
      indexes: [
        { unique: true, fields: ["senderId", "receiverId"] },
        { fields: ["receiverId"] },
        { fields: ["receiverId", "status"] },
        { fields: ["senderId", "status"] },
      ],
    }
  );

  return FriendRequest;
};
