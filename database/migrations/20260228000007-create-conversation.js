"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Conversation", {
      conversationId: {
        type: Sequelize.BIGINT,
        primaryKey: true,
      },
      conversationName: {
        type: Sequelize.STRING(255),
      },
      type: {
        type: Sequelize.ENUM("private", "group", "channel"),
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

    await queryInterface.addIndex("Conversation", ["type"]);
    await queryInterface.addIndex("Conversation", ["deletedAt"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Conversation");
  },
};
