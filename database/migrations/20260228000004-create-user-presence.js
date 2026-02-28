"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("UserPresence", {
      userId: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        references: { model: "User", key: "userId" },
        onDelete: "CASCADE",
      },
      status: {
        type: Sequelize.ENUM("online", "offline", "away"),
      },
      lastActiveAt: {
        type: Sequelize.DATE,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addIndex("UserPresence", ["status", "lastActiveAt"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("UserPresence");
  },
};
