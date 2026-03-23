const { Op } = require("sequelize");
const db = require("../../database/models");
const { AppError } = require("../middlewares/errorHandler.middlewares");
const STATUS_CODES = require("../constants/statusCode");
const { FRIEND_MESSAGES, AUTH_MESSAGES } = require("../constants/messages");
const { Snowflake } = require("@sapphire/snowflake");
const { FRIEND_REQUEST_STATUS } = require("../constants/enum");

const snowflake = new Snowflake(1n);

class FriendServices {
  generateId() {
    return snowflake.generate().toString();
  }

  async sendRequest({ senderId, receiverId }) {
    if (senderId === receiverId) {
      throw new AppError(
        FRIEND_MESSAGES.CANNOT_ADD_YOURSELF,
        STATUS_CODES.BAD_REQUEST,
      );
    }
    const receiver = await db.User.findOne({
      where: { userId: receiverId },
    });
    if (!receiver) {
      throw new AppError(
        AUTH_MESSAGES.USER_NOT_FOUND,
        STATUS_CODES.BAD_REQUEST,
      );
    }

    const [alreadyFriends, existingRequest] = await Promise.all([
      db.Friend.findOne({ where: { userId: senderId, friendId: receiverId } }),
      db.FriendRequest.findOne({
        where: { senderId, receiverId, status: FRIEND_REQUEST_STATUS.PENDING },
      }),
    ]);

    if (alreadyFriends) {
      throw new AppError(
        FRIEND_MESSAGES.ALREADY_FRIENDS,
        STATUS_CODES.CONFLICT,
      );
    }
    if (existingRequest) {
      throw new AppError(
        FRIEND_MESSAGES.REQUEST_ALREADY_SENT,
        STATUS_CODES.CONFLICT,
      );
    }

    const request = await db.FriendRequest.create({
      friendRequestId: this.generateId(),
      senderId,
      receiverId,
      status: FRIEND_REQUEST_STATUS.PENDING,
    });

    return request;
  }

  async cancelRequest({ senderId, friendRequestId }) {
    const request = await db.FriendRequest.findOne({
      where: {
        friendRequestId,
        senderId,
        status: FRIEND_REQUEST_STATUS.PENDING,
      },
    });
    if (!request) {
      throw new AppError(
        FRIEND_MESSAGES.REQUEST_NOT_FOUND,
        STATUS_CODES.NOT_FOUND,
      );
    }

    await request.update({ status: FRIEND_REQUEST_STATUS.CANCELLED });
    return true;
  }

  async acceptRequest({ userId, friendRequestId }) {
    const request = await db.FriendRequest.findOne({
      where: {
        friendRequestId,
        status: FRIEND_REQUEST_STATUS.PENDING,
      },
    });
    if (!request) {
      throw new AppError(
        FRIEND_MESSAGES.REQUEST_NOT_FOUND,
        STATUS_CODES.NOT_FOUND,
      );
    }
    if (request.receiverId !== userId) {
      throw new AppError(
        FRIEND_MESSAGES.NOT_ACCEPT_REQUEST,
        STATUS_CODES.FORBIDDEN,
      );
    }

    const transaction = await db.sequelize.transaction();
    try {
      await request.update(
        { status: FRIEND_REQUEST_STATUS.ACCEPTED },
        { transaction },
      );

      // Find existing private conversation between the two users
      const existingMember = await db.ConversationMember.findOne({
        where: { userId: request.senderId },
        include: [
          {
            model: db.Conversation,
            where: { type: "private" },
            required: true,
            include: [
              {
                model: db.ConversationMember,
                where: { userId: request.receiverId },
                required: true,
              },
            ],
          },
        ],
      });

      await Promise.all([
        db.Friend.create(
          {
            id: this.generateId(),
            userId: request.senderId,
            friendId: request.receiverId,
          },
          { transaction },
        ),
        db.Friend.create(
          {
            id: this.generateId(),
            userId: request.receiverId,
            friendId: request.senderId,
          },
          { transaction },
        ),
      ]);

      if (!existingMember) {
        const conversationId = this.generateId();
        await db.Conversation.create(
          { conversationId, type: "private" },
          { transaction },
        );
        await Promise.all([
          db.ConversationMember.create(
            {
              id: this.generateId(),
              conversationId,
              userId: request.senderId,
              role: "member",
              joinedAt: new Date(),
            },
            { transaction },
          ),
          db.ConversationMember.create(
            {
              id: this.generateId(),
              conversationId,
              userId: request.receiverId,
              role: "member",
              joinedAt: new Date(),
            },
            { transaction },
          ),
        ]);
      }

      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async rejectRequest({ userId, friendRequestId }) {
    const request = await db.FriendRequest.findOne({
      where: {
        friendRequestId,
        status: FRIEND_REQUEST_STATUS.PENDING,
      },
    });
    if (!request) {
      throw new AppError(
        FRIEND_MESSAGES.REQUEST_NOT_FOUND,
        STATUS_CODES.NOT_FOUND,
      );
    }
    if (request.receiverId !== userId) {
      throw new AppError(
        FRIEND_MESSAGES.NOT_REJECT_REQUEST,
        STATUS_CODES.FORBIDDEN,
      );
    }

    await request.update({ status: FRIEND_REQUEST_STATUS.REJECTED });
    return true;
  }

  async unfriend({ userId, friendId }) {
    const transaction = await db.sequelize.transaction();
    try {
      await db.Friend.destroy({
        where: {
          [Op.or]: [
            { userId, friendId },
            { userId: friendId, friendId: userId },
          ],
        },
        transaction,
      });
      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async getFriends({ userId, page = 1, limit = 10, search = "" }) {
    const offset = (page - 1) * limit;
    const { rows: friends, count } = await db.Friend.findAndCountAll({
      where: { userId },
      include: [
        {
          model: db.User,
          as: "friend",
          attributes: { exclude: ["password"] },
          where: search
            ? {
                [Op.or]: [
                  { firstName: { [Op.like]: `%${search}%` } },
                  { lastName: { [Op.like]: `%${search}%` } },
                  { email: { [Op.like]: `%${search}%` } },
                ],
              }
            : undefined,
        },
      ],
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return { data: friends, pagination: { total: count, page, limit } };
  }

  async getReceivedRequests({ userId, page = 1, limit = 10 }) {
    const offset = (page - 1) * limit;
    const { rows: requests, count } = await db.FriendRequest.findAndCountAll({
      where: { receiverId: userId, status: FRIEND_REQUEST_STATUS.PENDING },
      include: [
        { model: db.User, as: "sender", attributes: { exclude: ["password"] } },
      ],
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return { data: requests, pagination: { total: count, page, limit } };
  }

  async getSentRequests({ userId, page = 1, limit = 10 }) {
    const offset = (page - 1) * limit;
    const { rows: requests, count } = await db.FriendRequest.findAndCountAll({
      where: { senderId: userId, status: FRIEND_REQUEST_STATUS.PENDING },
      include: [
        {
          model: db.User,
          as: "receiver",
          attributes: { exclude: ["password"] },
        },
      ],
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return { data: requests, pagination: { total: count, page, limit } };
  }
}

module.exports = new FriendServices();
