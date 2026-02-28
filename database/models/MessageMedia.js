"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class MessageMedia extends Model {
    static associate(models) {
      MessageMedia.belongsTo(models.Message, { foreignKey: "messageId" });
    }
  }

  MessageMedia.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
      },
      messageId: {
        type: DataTypes.BIGINT,
      },
      mediaUrl: {
        type: DataTypes.STRING(500),
      },
      mediaType: {
        type: DataTypes.ENUM("image", "video", "audio", "file"),
      },
      fileSize: {
        type: DataTypes.BIGINT,
      },
    },
    {
      sequelize,
      modelName: "MessageMedia",
      tableName: "MessageMedia",
      timestamps: true,
      createdAt: "createdAt",
      updatedAt: "updatedAt",
      indexes: [
        { fields: ["messageId"] },
      ],
    }
  );

  return MessageMedia;
};
