"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ReactionMessage", {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
      },
      messageId: {
        type: Sequelize.BIGINT,
        references: { model: "Message", key: "messageId" },
        onDelete: "CASCADE",
      },
      reactionId: {
        type: Sequelize.INTEGER,
        references: { model: "Reaction", key: "reactionId" },
        onDelete: "CASCADE",
      },
      userId: {
        type: Sequelize.BIGINT,
        references: { model: "User", key: "userId" },
        onDelete: "CASCADE",
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addIndex("ReactionMessage", ["messageId", "reactionId", "userId"], { unique: true });
    await queryInterface.addIndex("ReactionMessage", ["messageId"]);
    await queryInterface.addIndex("ReactionMessage", ["userId"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("ReactionMessage");
  },
};
