"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ConversationRead extends Model {
    static associate(models) {
      ConversationRead.belongsTo(models.Conversation, { foreignKey: "conversationId" });
      ConversationRead.belongsTo(models.User, { foreignKey: "userId" });
    }
  }

  ConversationRead.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
      },
      conversationId: {
        type: DataTypes.BIGINT,
      },
      userId: {
        type: DataTypes.BIGINT,
      },
      lastReadMessageSeq: {
        type: DataTypes.BIGINT,
      },
      lastReadAt: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "ConversationRead",
      tableName: "ConversationRead",
      timestamps: true,
      createdAt: "createdAt",
      updatedAt: "updatedAt",
      indexes: [
        { unique: true, fields: ["conversationId", "userId"] },
        { fields: ["userId"] },
      ],
    }
  );

  return ConversationRead;
};
