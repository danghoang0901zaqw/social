"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ConversationStat", {
      conversationId: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        references: { model: "Conversation", key: "conversationId" },
        onDelete: "CASCADE",
      },
      lastMessageId: {
        type: Sequelize.BIGINT,
      },
      lastMessageSeq: {
        type: Sequelize.BIGINT,
      },
      lastMessageAt: {
        type: Sequelize.DATE,
      },
      messageCount: {
        type: Sequelize.BIGINT,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addIndex("ConversationStat", ["lastMessageAt"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("ConversationStat");
  },
};
