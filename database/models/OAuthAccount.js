"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class OAuthAccount extends Model {
    static associate(models) {
      OAuthAccount.belongsTo(models.User, { foreignKey: "userId" });
    }
  }

  OAuthAccount.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      provider: {
        type: DataTypes.ENUM("google", "facebook", "github", "apple"),
      },
      providerUserId: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      providerEmail: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      accessToken: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      refreshToken: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      tokenExpiredAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "OAuthAccount",
      tableName: "OAuthAccount",
      timestamps: true,
      createdAt: "createdAt",
      updatedAt: "updatedAt",
      indexes: [
        { unique: true, fields: ["provider", "providerUserId"] },
        { fields: ["userId"] },
      ],
    }
  );

  return OAuthAccount;
};
