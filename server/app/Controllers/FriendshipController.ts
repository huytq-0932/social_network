import BaseController from "./BaseController";
import UserModel from "@root/server/app/Models/UserModel";
import ApiException from "@app/Exceptions/ApiException";
import FriendRequestModel from "@root/server/app/Models/FriendRequestModel";
import FriendshipModel from "@app/Models/FriendshipModel";

export default class FriendshipController extends BaseController {
  Friendship = FriendshipModel;
  UserModel = UserModel;

  async setRequestFriend() {
    const inputs = this.request.all();
    const allowFields = {
      token: "string!",
      user_id: "number!"
    };
    const data = this.validate(inputs, allowFields);
    const auth = this.request.auth;

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
}
