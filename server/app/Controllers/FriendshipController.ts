import BaseController from "./BaseController";
import UserModel from "@root/server/app/Models/UserModel";
import ApiException from "@app/Exceptions/ApiException";
import FriendRequestModel from "@root/server/app/Models/FriendRequestModel";
import FriendshipModel from "@app/Models/FriendshipModel";

export default class FriendshipController extends BaseController {
  Friendship = FriendshipModel;
  UserModel = UserModel;

  static Constant = {
    REQUEST_ACCEPT: "1",
    REQUEST_REJECT: "0",
    TYPE_BLOCK: 0,
    TYPE_UNBLOCK: 1
  }

  async setRequestFriend() {
    const inputs = this.request.all();
    const allowFields = {
      token: "string!",
      user_id: "number!"
    };
    const data = this.validate(inputs, allowFields);
    const auth = this.request.auth;
    if (data.user_id == auth.id) {
      throw new ApiException(1010, "Cannot send request to yourself")
    }

    const result = await this.Friendship.sendRequest(auth.id, data.user_id)
    if (!result) throw new ApiException(1010, "Action has been done previously by this user")

    this.response.success({
      requested_friends: (await this.Friendship.getSentRequests(auth.id)).length.toString()
    })
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
    const friendRequests = await this.Friendship.getReceivedRequests(auth.id)
    const users = await this.UserModel.query()
    const requests = friendRequests.map(request => {
      const user = users.filter(user => user.id == request.action_user_id)[0]
      return {
        id: user.id,
        username: user.name,
        avatar: user.avatar,
        created: request.createdAt
      }
    })

    this.response.success({
      request: requests.slice(data.index, data.index + data.count),
      total: requests.length
    })
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
      throw new ApiException(1010, "Cannot accept request of yourself")
    }

    const friendship = await this.Friendship.getFriendship(data.user_id, auth.id)
    if (!friendship || friendship.status != FriendshipModel.Constant.STATUS_REQUEST) {
      throw new ApiException(1010, "This request is not exist")
    }

    if (data.is_accept == FriendshipController.Constant.REQUEST_ACCEPT) {
      const acceptResult = await this.Friendship.acceptFriendRequest(data.user_id, auth.id)
      if (!acceptResult) {
        if (!acceptResult) throw new ApiException(1010, "Can't accept this request")
      }

      return {
        message: "Accept request successfully"
      }
    }

    const result = await this.Friendship.removeFriendship(data.user_id, auth.id)
    if (!result) {
      if (!result) throw new ApiException(1010, "Can't reject this request")
    }

    return {
      message: "Reject request successfully"
    }
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
      throw new ApiException(1010, "Cannot block yourself")
    }

    if (data.type == FriendshipController.Constant.TYPE_BLOCK) {
      const block = await this.Friendship.block(auth.id, data.user_id)
      if (!block) {
        throw new ApiException(1010, "Cannot block this user")
      }
      return {}
    }
    const unblock = await this.Friendship.unblock(auth.id, data.user_id)
    if (!unblock) {
      throw new ApiException(1010, "Cannot unblock this user")
    }
    return {
      message: unblock ? "Unblock user successfully" : "Cannot unblock this user"
    }
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
    const blockedFriendship = await this.Friendship.getBlockedFriendship(auth.id)
    const users = await this.UserModel.query()
    const blockedUsers = blockedFriendship.map(friendship => {
      const id = auth.id == friendship.user_two_id ? friendship.user_one_id : friendship.user_two_id
      const user = users.filter(user => user.id == id)[0]
      return {
        id: user.id,
        name: user.name,
        avatar: user.avatar
      }
    })

    this.response.success(blockedUsers)
  }
}
