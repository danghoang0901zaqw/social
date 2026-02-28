"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Friend extends Model {
    static associate(models) {
      Friend.belongsTo(models.User, { foreignKey: "userId", as: "user" });
      Friend.belongsTo(models.User, { foreignKey: "friendId", as: "friend" });
    }
  }

  Friend.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.BIGINT,
      },
      friendId: {
        type: DataTypes.BIGINT,
      },
    },
    {
      sequelize,
      modelName: "Friend",
      tableName: "Friend",
      timestamps: true,
      createdAt: "createdAt",
      updatedAt: "updatedAt",
      indexes: [
        { unique: true, fields: ["userId", "friendId"] },
        { fields: ["userId"] },
        { fields: ["friendId"] },
      ],
    }
  );

  return Friend;
};
