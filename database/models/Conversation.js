"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Conversation extends Model {
    static associate(models) {
      Conversation.hasMany(models.ConversationMember, { foreignKey: "conversationId" });
      Conversation.hasMany(models.ConversationSetting, { foreignKey: "conversationId" });
      Conversation.hasMany(models.Message, { foreignKey: "conversationId" });
      Conversation.hasOne(models.ConversationStat, { foreignKey: "conversationId" });
    }
  }

  Conversation.init(
    {
      conversationId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
      },
      conversationName: {
        type: DataTypes.STRING(255),
      },
      type: {
        type: DataTypes.ENUM("private", "group", "channel"),
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Conversation",
      tableName: "Conversation",
      timestamps: true,
      createdAt: "createdAt",
      updatedAt: "updatedAt",
      indexes: [
        { fields: ["type"] },
        { fields: ["deletedAt"] },
      ],
    }
  );

  return Conversation;
};
