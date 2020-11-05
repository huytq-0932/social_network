import BaseController from "./BaseController";
import UserModel from "@root/server/app/Models/UserModel";
import ApiException from "@app/Exceptions/ApiException";
import FriendRequestModel from "@root/server/app/Models/FriendRequestModel";

export default class FriendRequestController extends BaseController {
  FriendRequestModel = FriendRequestModel;
  UserModel = UserModel;

  async setRequestFriend() {
    const inputs = this.request.all();
    const allowFields = {
      token: "string!",
      user_id: "number!"
    };
    const data = this.validate(inputs, allowFields);
    const auth = this.request.auth;
    const user = await this.UserModel.query().findOne({id: data.user_id});
    if (!user) {
      throw new ApiException(9995, "User is not validated");
    }
    const request = {
      from_user_id: auth.id,
      to_user_id: data.user_id
    }

    const requestedFriend = await this.FriendRequestModel.query().findOne(request)
    if (requestedFriend) throw new ApiException(1010, "Action has been done previously by this user")

    const result = await this.FriendRequestModel.query().insert(request);

    const numberRequests = await this.FriendRequestModel.query().where({from_user_id: auth.id})

    this.response.success({
      requested_friends: numberRequests.length.toString()
    })
  }
}
