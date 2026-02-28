"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ConversationSetting", {
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
      isMuted: {
        type: Sequelize.BOOLEAN,
      },
      isPinned: {
        type: Sequelize.BOOLEAN,
      },
      isArchived: {
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addIndex("ConversationSetting", ["conversationId", "userId"], { unique: true });
    await queryInterface.addIndex("ConversationSetting", ["userId"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("ConversationSetting");
  },
};
