"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("User", {
      userId: {
        type: Sequelize.BIGINT,
        primaryKey: true,
      },
      firstName: {
        type: Sequelize.STRING(100),
      },
      lastName: {
        type: Sequelize.STRING(100),
      },
      email: {
        type: Sequelize.STRING(150),
        unique: true,
      },
      emailVerifiedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      avatar: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      cover: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      bio: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      deletedAt: {
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

    await queryInterface.addIndex("User", ["deletedAt"]);
    await queryInterface.addIndex("User", ["email", "deletedAt"]);
    await queryInterface.addIndex("User", ["createdAt"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("User");
  },
};
