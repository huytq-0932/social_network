import BaseController from "./BaseController";
import UserModel from "@root/server/app/Models/UserModel";
import ApiException from "@app/Exceptions/ApiException";
import FriendshipModel from "@app/Models/FriendshipModel";

export default class FriendshipController extends BaseController {
  Friendship = FriendshipModel;
  UserModel = UserModel;

  static Constant = {
    REQUEST_ACCEPT: "1",
    REQUEST_REJECT: "0",
    TYPE_BLOCK: 0,
    TYPE_UNBLOCK: 1
  };

  async setRequestFriend() {
    const inputs = this.request.all();
    const allowFields = {
      token: "string!",
      user_id: "number!"
    };
    const data = this.validate(inputs, allowFields);
    const auth = this.request.auth;
    if (data.user_id == auth.id) {
      throw new ApiException(1004);
    }
    const validatedUser = await this.validateUserToken(data.user_id)
    const numberFriends = await this.validateNumberFriends(auth.id)

    const result = await this.Friendship.sendRequest(auth.id, data.user_id);
    if (!result) throw new ApiException(1010, "Action has been done previously by this user");

    this.response.success({
      requested_friends: (await this.Friendship.getSentRequests(auth.id)).length.toString()
    });
  }

  async getRequestedFriends() {
    const inputs = this.request.all();
    const allowFields = {
      token: "string!",
      index: "number!",
      count: "number!"
    };
    const data = this.validate(inputs, allowFields);
    const auth = this.request.auth;
    if (data.index < 0 || data.count < 0) {
      throw new ApiException(1004)
    }

    const friendRequests = await this.Friendship.getReceivedRequests(auth.id);
    const users = await this.UserModel.query();

    const requests = await Promise.all(friendRequests.map(async (request) => {
      const user = users.filter((user) => user.id == request.action_user_id)[0];
      const multiple = await this.Friendship.getMultipleFriendsCount(user.id, auth.id)
      return {
        user_id: user.id,
        username: user.name,
        avatar: user.avatar,
        same_friends: multiple
      };
    }));

    this.response.success({
      request: requests.slice(data.index, data.index + data.count),
      total: requests.length
    });
  }


  async setAcceptFriend() {
    const inputs = this.request.all();
    const allowFields = {
      token: "string!",
      user_id: "string!",
      is_accept: "string!"
    };
    const data = this.validate(inputs, allowFields);
    const auth = this.request.auth;
    if (data.user_id == auth.id) {
      throw new ApiException(1004);
    }
    const validatedUser = await this.validateUserToken(data.user_id)
    const validateNumberFriends = await this.validateNumberFriends(data.user_id)

    const friendship = await this.Friendship.getFriendship(data.user_id, auth.id);
    if (!friendship || friendship.status != FriendshipModel.Constant.STATUS_REQUEST) {
      throw new ApiException(9995);
    }

    if (data.is_accept == FriendshipController.Constant.REQUEST_ACCEPT) {
      const acceptResult = await this.Friendship.acceptFriendRequest(data.user_id, auth.id);
      if (!acceptResult) {
        if (!acceptResult) throw new ApiException(1004);
      }
      return {}
    }
    if (data.is_accept == FriendshipController.Constant.REQUEST_REJECT) {

      const result = await this.Friendship.removeFriendship(data.user_id, auth.id);
      if (!result) throw new ApiException(1004);
      return {}
    }
    throw new ApiException(1004)
  }

  async setBlock() {
    const inputs = this.request.all();
    const allowFields = {
      token: "string!",
      user_id: "number!",
      type: "number!"
    };
    const data = this.validate(inputs, allowFields);
    const auth = this.request.auth;
    if (data.user_id == auth.id) {
      throw new ApiException(1010, "Cannot block yourself");
    }
    const validatedUser = await this.validateUserToken(data.user_id)

    if (data.type == FriendshipController.Constant.TYPE_BLOCK) {
      const block = await this.Friendship.block(auth.id, data.user_id);
      if (!block) {
        throw new ApiException(1010, "Cannot block this user");
      }
      return {};
    }
    const unblock = await this.Friendship.unblock(auth.id, data.user_id);
    if (!unblock) {
      throw new ApiException(1010, "Cannot unblock this user");
    }
    this.response.success(null);
  }

  async getListBlocks() {
    const inputs = this.request.all();
    const allowFields = {
      token: "string!",
      index: "number!",
      count: "number!"
    };
    const data = this.validate(inputs, allowFields);
    const auth = this.request.auth;
    const blockedFriendship = await this.Friendship.getBlockedFriendship(auth.id);
    const users = await this.UserModel.query();
    const blockedUsers = blockedFriendship.map((friendship) => {
      const id =
        auth.id == friendship.user_two_id ? friendship.user_one_id : friendship.user_two_id;
      const user = users.filter((user) => user.id == id)[0];
      return {
        id: user.id,
        name: user.name,
        avatar: user.avatar
      };
    });

    this.response.success(blockedUsers);
  }

  async getUserFriends() {
    const inputs = this.request.all();
    const allowFields = {
      token: "string!",
      index: "number!",
      count: "number!"
    };
    const data = this.validate(inputs, allowFields);
    const auth = this.request.auth;
    const friendIds = await this.Friendship.getUserFriends(auth.id);
    const users = await this.UserModel.query();
    const userFriends = await Promise.all(
      friendIds.map(async (friend) => {
        const id = auth.id == friend.user_two_id ? friend.user_one_id : friend.user_two_id;
        const user = users.filter((user) => user.id == id)[0];
        return {
          user_id: user.id,
          username: user.name,
          avatar: user.avatar,
          same_friends: await this.Friendship.getMultipleFriendsCount(auth.id, id)
        };
      })
    );
    return {
      list_friends: userFriends
    };
  }

  async getListSuggestedFriends() {
    const inputs = this.request.all();
    const allowFields = {
      token: "string!",
      index: "number!",
      count: "number!"
    };
    let data = this.validate(inputs, allowFields, {
      removeNotAllow: true
    });
    let user = await this.validateUserToken(this.request.auth.id);

    let suggested = await this.UserModel.query()
      .select()
      .whereNotIn(
        "id",
        this.Friendship.query()
          .select("user_one_id")
          .union(this.Friendship.query().select("user_two_id"))
      )
      .andWhereNot("id", user.id)
      .limit(data.count)
      .offset(data.index)
      .orderBy("id");
    return await Promise.all(
      suggested.map(async (item) => {
        let same_friends = await this.Friendship.getMultipleFriendsCount(user.id, item.id);
        return {
          user_id: item.id + "",
          username: item.name,
          avatar: item.avatar,
          same_friends: same_friends + ""
        };
      })
    );
  }

  async validateUserToken(userId) {
    let user = await this.UserModel.query().findById(userId);
    if (!user) {
      throw new ApiException(9995);
    }
    if (await user.isBlocked()) {
      throw new ApiException(9995)
    }
    return user;
  }

  async validateNumberFriends(userId) {
    const numberFriends = (await this.Friendship.getUserFriends(userId)).length
    if (numberFriends >= 5000) {
      throw new ApiException(9994)
    }
  }
}
