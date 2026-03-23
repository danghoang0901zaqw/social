const FriendServices = require("../services/friend.services");
const STATUS_CODES = require("../constants/statusCode");
const { FRIEND_MESSAGES } = require("../constants/messages");

class FriendControllers {
  async sendRequest(req, res) {
    const { userId: senderId } = req.user;
    const { receiverId } = req.body;
    await FriendServices.sendRequest({ senderId, receiverId });
    res.status(STATUS_CODES.CREATED).json({
      status: STATUS_CODES.CREATED,
      message: FRIEND_MESSAGES.SEND_REQUEST_SUCCESS,
      data: true,
    });
  }

  async cancelRequest(req, res) {
    const { userId: senderId } = req.user;
    const { friendRequestId } = req.params;
    await FriendServices.cancelRequest({ senderId, friendRequestId });
    res.status(STATUS_CODES.OK).json({
      status: STATUS_CODES.OK,
      message: FRIEND_MESSAGES.CANCEL_REQUEST_SUCCESS,
      data: true,
    });
  }

  async acceptRequest(req, res) {
    const { userId } = req.user;
    const { friendRequestId } = req.params;
    await FriendServices.acceptRequest({ userId, friendRequestId });
    res.status(STATUS_CODES.OK).json({
      status: STATUS_CODES.OK,
      message: FRIEND_MESSAGES.ACCEPT_REQUEST_SUCCESS,
      data: true,
    });
  }

  async rejectRequest(req, res) {
    const { userId } = req.user;
    const { friendRequestId } = req.params;
    await FriendServices.rejectRequest({ userId, friendRequestId });
    res.status(STATUS_CODES.OK).json({
      status: STATUS_CODES.OK,
      message: FRIEND_MESSAGES.REJECT_REQUEST_SUCCESS,
      data: true,
    });
  }

  async unfriend(req, res) {
    const { userId } = req.user;
    const { friendId } = req.params;
    await FriendServices.unfriend({ userId, friendId });
    res.status(STATUS_CODES.OK).json({
      status: STATUS_CODES.OK,
      message: FRIEND_MESSAGES.UNFRIEND_SUCCESS,
      data: true,
    });
  }

  async getFriends(req, res) {
    const { userId } = req.user;
    const { page, limit, search } = req.query;
    const data = await FriendServices.getFriends({
      userId,
      page: +page || 1,
      limit: +limit || 10,
      search,
    });
    res.status(STATUS_CODES.OK).json({
      status: STATUS_CODES.OK,
      message: FRIEND_MESSAGES.GET_FRIENDS_SUCCESS,
      ...data,
    });
  }

  async getReceivedRequests(req, res) {
    const { userId } = req.user;
    const { page, limit } = req.query;
    const data = await FriendServices.getReceivedRequests({
      userId,
      page: +page || 1,
      limit: +limit || 10,
    });
    res.status(STATUS_CODES.OK).json({
      status: STATUS_CODES.OK,
      message: FRIEND_MESSAGES.GET_REQUESTS_SUCCESS,
      ...data,
    });
  }

  async getSentRequests(req, res) {
    const { userId } = req.user;
    const { page, limit } = req.query;
    const data = await FriendServices.getSentRequests({
      userId,
      page: +page || 1,
      limit: +limit || 10,
    });
    res.status(STATUS_CODES.OK).json({
      status: STATUS_CODES.OK,
      message: FRIEND_MESSAGES.GET_REQUESTS_SUCCESS,
      ...data,
    });
  }
}

module.exports = new FriendControllers();
