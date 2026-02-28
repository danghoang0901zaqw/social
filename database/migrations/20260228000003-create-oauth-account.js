"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("OAuthAccount", {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: { model: "User", key: "userId" },
        onDelete: "CASCADE",
      },
      provider: {
        type: Sequelize.ENUM("google", "facebook", "github", "apple"),
      },
      providerUserId: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      providerEmail: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      accessToken: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      refreshToken: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      tokenExpiredAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addIndex("OAuthAccount", ["provider", "providerUserId"], { unique: true });
    await queryInterface.addIndex("OAuthAccount", ["userId"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("OAuthAccount");
  },
};
