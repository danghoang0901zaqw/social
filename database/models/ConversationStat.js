"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ConversationStat extends Model {
    static associate(models) {
      ConversationStat.belongsTo(models.Conversation, { foreignKey: "conversationId" });
    }
  }

  ConversationStat.init(
    {
      conversationId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
      },
      lastMessageId: {
        type: DataTypes.BIGINT,
      },
      lastMessageSeq: {
        type: DataTypes.BIGINT,
      },
      lastMessageAt: {
        type: DataTypes.DATE,
      },
      messageCount: {
        type: DataTypes.BIGINT,
      },
    },
    {
      sequelize,
      modelName: "ConversationStat",
      tableName: "ConversationStat",
      timestamps: true,
      createdAt: "createdAt",
      updatedAt: "updatedAt",
      indexes: [
        { fields: ["lastMessageAt"] },
      ],
    }
  );

  return ConversationStat;
};
