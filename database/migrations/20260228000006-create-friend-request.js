"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("FriendRequest", {
      friendRequestId: {
        type: Sequelize.BIGINT,
        primaryKey: true,
      },
      senderId: {
        type: Sequelize.BIGINT,
        references: { model: "User", key: "userId" },
        onDelete: "CASCADE",
      },
      receiverId: {
        type: Sequelize.BIGINT,
        references: { model: "User", key: "userId" },
        onDelete: "CASCADE",
      },
      status: {
        type: Sequelize.ENUM("pending", "accepted", "rejected", "cancelled"),
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addIndex("FriendRequest", ["senderId", "receiverId"], { unique: true });
    await queryInterface.addIndex("FriendRequest", ["receiverId"]);
    await queryInterface.addIndex("FriendRequest", ["receiverId", "status"]);
    await queryInterface.addIndex("FriendRequest", ["senderId", "status"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("FriendRequest");
  },
};
