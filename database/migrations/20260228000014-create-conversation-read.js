"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ConversationRead", {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
      },
      conversationId: {
        type: Sequelize.BIGINT,
        references: { model: "Conversation", key: "conversationId" },
        onDelete: "CASCADE",
      },
      userId: {
        type: Sequelize.BIGINT,
        references: { model: "User", key: "userId" },
        onDelete: "CASCADE",
      },
      lastReadMessageSeq: {
        type: Sequelize.BIGINT,
      },
      lastReadAt: {
        type: Sequelize.DATE,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addIndex("ConversationRead", ["conversationId", "userId"], { unique: true });
    await queryInterface.addIndex("ConversationRead", ["userId"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("ConversationRead");
  },
};
