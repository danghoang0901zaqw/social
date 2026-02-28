"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class UserPresence extends Model {
    static associate(models) {
      UserPresence.belongsTo(models.User, { foreignKey: "userId" });
    }
  }

  UserPresence.init(
    {
      userId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
      },
      status: {
        type: DataTypes.ENUM("online", "offline", "away"),
      },
      lastActiveAt: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "UserPresence",
      tableName: "UserPresence",
      timestamps: true,
      createdAt: "createdAt",
      updatedAt: "updatedAt",
      indexes: [
        { fields: ["status", "lastActiveAt"] },
      ],
    }
  );

  return UserPresence;
};
