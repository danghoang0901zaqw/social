"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class AuthToken extends Model {
    static associate(models) {
      AuthToken.belongsTo(models.User, { foreignKey: "userId" });
    }
  }

  AuthToken.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("refresh", "reset_password", "verify_email", "login_otp"),
      },
      tokenHash: {
        type: DataTypes.STRING(255),
      },
      expiredAt: {
        type: DataTypes.DATE,
      },
      usedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      ip: {
        type: DataTypes.STRING(100),
      },
      userAgent: {
        type: DataTypes.STRING(500),
      },
    },
    {
      sequelize,
      modelName: "AuthToken",
      tableName: "AuthToken",
      timestamps: true,
      createdAt: "createdAt",
      updatedAt: "updatedAt",
      indexes: [
        { fields: ["userId"] },
        { fields: ["tokenHash"] },
        { fields: ["userId", "type"] },
        { fields: ["expiredAt"] },
      ],
    }
  );

  return AuthToken;
};
