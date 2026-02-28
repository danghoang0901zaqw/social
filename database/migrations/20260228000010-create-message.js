"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Message", {
      messageId: {
        type: Sequelize.BIGINT,
        primaryKey: true,
      },
      conversationId: {
        type: Sequelize.BIGINT,
        references: { model: "Conversation", key: "conversationId" },
        onDelete: "CASCADE",
      },
      messageSeq: {
        type: Sequelize.BIGINT,
      },
      senderId: {
        type: Sequelize.BIGINT,
        references: { model: "User", key: "userId" },
        onDelete: "SET NULL",
      },
      replyToMessageId: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: { model: "Message", key: "messageId" },
        onDelete: "SET NULL",
      },
      content: {
        type: Sequelize.TEXT,
      },
      messageType: {
        type: Sequelize.ENUM("text", "image", "video", "file", "system"),
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

    await queryInterface.addIndex("Message", ["conversationId", "messageSeq"]);
    await queryInterface.addIndex("Message", ["conversationId", "createdAt"]);
    await queryInterface.addIndex("Message", ["senderId"]);
    await queryInterface.addIndex("Message", ["replyToMessageId"]);
    await queryInterface.addIndex("Message", ["conversationId", "deletedAt", "messageSeq"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Message");
  },
};
