"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Reaction", {
      reactionId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      reactionName: {
        type: Sequelize.STRING(100),
      },
      reactionUrl: {
        type: Sequelize.STRING(255),
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Reaction");
  },
};
