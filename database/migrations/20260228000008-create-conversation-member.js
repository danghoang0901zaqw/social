"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ConversationMember", {
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
      role: {
        type: Sequelize.ENUM("member", "admin", "owner"),
      },
      joinedAt: {
        type: Sequelize.DATE,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addIndex("ConversationMember", ["conversationId", "userId"], { unique: true });
    await queryInterface.addIndex("ConversationMember", ["userId"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("ConversationMember");
  },
};
