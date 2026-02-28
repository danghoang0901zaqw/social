"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Reaction extends Model {
    static associate(models) {
      Reaction.hasMany(models.ReactionMessage, { foreignKey: "reactionId" });
    }
  }

  Reaction.init(
    {
      reactionId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      reactionName: {
        type: DataTypes.STRING(100),
      },
      reactionUrl: {
        type: DataTypes.STRING(255),
      },
    },
    {
      sequelize,
      modelName: "Reaction",
      tableName: "Reaction",
      timestamps: true,
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    }
  );

  return Reaction;
};
