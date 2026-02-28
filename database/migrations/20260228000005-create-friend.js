"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Friend", {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.BIGINT,
        references: { model: "User", key: "userId" },
        onDelete: "CASCADE",
      },
      friendId: {
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

    await queryInterface.addIndex("Friend", ["userId", "friendId"], { unique: true });
    await queryInterface.addIndex("Friend", ["userId"]);
    await queryInterface.addIndex("Friend", ["friendId"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Friend");
  },
};
