"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ConversationMember extends Model {
    static associate(models) {
      ConversationMember.belongsTo(models.Conversation, { foreignKey: "conversationId" });
      ConversationMember.belongsTo(models.User, { foreignKey: "userId" });
    }
  }

  ConversationMember.init(
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
      role: {
        type: DataTypes.ENUM("member", "admin", "owner"),
      },
      joinedAt: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "ConversationMember",
      tableName: "ConversationMember",
      timestamps: true,
      createdAt: "createdAt",
      updatedAt: "updatedAt",
      indexes: [
        { unique: true, fields: ["conversationId", "userId"] },
        { fields: ["userId"] },
      ],
    }
  );

  return ConversationMember;
};
