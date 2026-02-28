"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("AuthToken", {
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
      type: {
        type: Sequelize.ENUM("refresh", "reset_password", "verify_email", "login_otp"),
      },
      tokenHash: {
        type: Sequelize.STRING(255),
      },
      expiredAt: {
        type: Sequelize.DATE,
      },
      usedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      ip: {
        type: Sequelize.STRING(100),
      },
      userAgent: {
        type: Sequelize.STRING(500),
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addIndex("AuthToken", ["userId"]);
    await queryInterface.addIndex("AuthToken", ["tokenHash"]);
    await queryInterface.addIndex("AuthToken", ["userId", "type"]);
    await queryInterface.addIndex("AuthToken", ["expiredAt"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("AuthToken");
  },
};
