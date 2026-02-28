"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("MessageMedia", {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
      },
      messageId: {
        type: Sequelize.BIGINT,
        references: { model: "Message", key: "messageId" },
        onDelete: "CASCADE",
      },
      mediaUrl: {
        type: Sequelize.STRING(500),
      },
      mediaType: {
        type: Sequelize.ENUM("image", "video", "audio", "file"),
      },
      fileSize: {
        type: Sequelize.BIGINT,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addIndex("MessageMedia", ["messageId"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("MessageMedia");
  },
};
