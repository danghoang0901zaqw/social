"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ConversationSetting extends Model {
    static associate(models) {
      ConversationSetting.belongsTo(models.Conversation, { foreignKey: "conversationId" });
      ConversationSetting.belongsTo(models.User, { foreignKey: "userId" });
    }
  }

  ConversationSetting.init(
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
      isMuted: {
        type: DataTypes.BOOLEAN,
      },
      isPinned: {
        type: DataTypes.BOOLEAN,
      },
      isArchived: {
        type: DataTypes.BOOLEAN,
      },
    },
    {
      sequelize,
      modelName: "ConversationSetting",
      tableName: "ConversationSetting",
      timestamps: true,
      createdAt: "createdAt",
      updatedAt: "updatedAt",
      indexes: [
        { unique: true, fields: ["conversationId", "userId"] },
        { fields: ["userId"] },
      ],
    }
  );

  return ConversationSetting;
};
