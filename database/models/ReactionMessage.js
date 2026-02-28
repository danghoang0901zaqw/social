"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ReactionMessage extends Model {
    static associate(models) {
      ReactionMessage.belongsTo(models.Message, { foreignKey: "messageId" });
      ReactionMessage.belongsTo(models.Reaction, { foreignKey: "reactionId" });
      ReactionMessage.belongsTo(models.User, { foreignKey: "userId" });
    }
  }

  ReactionMessage.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
      },
      messageId: {
        type: DataTypes.BIGINT,
      },
      reactionId: {
        type: DataTypes.INTEGER,
      },
      userId: {
        type: DataTypes.BIGINT,
      },
    },
    {
      sequelize,
      modelName: "ReactionMessage",
      tableName: "ReactionMessage",
      timestamps: true,
      createdAt: "createdAt",
      updatedAt: "updatedAt",
      indexes: [
        { unique: true, fields: ["messageId", "reactionId", "userId"] },
        { fields: ["messageId"] },
        { fields: ["userId"] },
      ],
    }
  );

  return ReactionMessage;
};
