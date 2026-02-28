"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      Message.belongsTo(models.Conversation, { foreignKey: "conversationId" });
      Message.belongsTo(models.User, { foreignKey: "senderId", as: "sender" });
      Message.belongsTo(models.Message, { foreignKey: "replyToMessageId", as: "replyTo" });
      Message.hasMany(models.Message, { foreignKey: "replyToMessageId", as: "replies" });
      Message.hasMany(models.MessageMedia, { foreignKey: "messageId" });
      Message.hasMany(models.ReactionMessage, { foreignKey: "messageId" });
    }
  }

  Message.init(
    {
      messageId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
      },
      conversationId: {
        type: DataTypes.BIGINT,
      },
      messageSeq: {
        type: DataTypes.BIGINT,
      },
      senderId: {
        type: DataTypes.BIGINT,
      },
      replyToMessageId: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      content: {
        type: DataTypes.TEXT,
      },
      messageType: {
        type: DataTypes.ENUM("text", "image", "video", "file", "system"),
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Message",
      tableName: "Message",
      timestamps: true,
      createdAt: "createdAt",
      updatedAt: "updatedAt",
      indexes: [
        { fields: ["conversationId", "messageSeq"] },
        { fields: ["conversationId", "createdAt"] },
        { fields: ["senderId"] },
        { fields: ["replyToMessageId"] },
        { fields: ["conversationId", "deletedAt", "messageSeq"] },
      ],
    }
  );

  return Message;
};
