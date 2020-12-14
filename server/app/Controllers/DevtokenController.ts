import BaseController from "./BaseController";
import DevtokenModel from "@root/server/app/Models/DevtokenModel";
import UserModel from "@root/server/app/Models/UserModel";
import ApiException from "@app/Exceptions/ApiException";
import _ from "lodash";

export default class DevtokenController extends BaseController {
  DevtokenModel = DevtokenModel;
  UserModel = UserModel;

  async setDevtoken() {
    const inputs = this.request.all();
    const allowFields = {
      token: "string!",
      devtype: "string!",
      devtoken: "string!"
    };
    let data = this.validate(inputs, allowFields, {
      removeNotAllow: true
    });
    let user = await this.validateUserToken(this.request.auth.id);
    let insertObj = {
      user_id: user.id,
      devtype: data.devtype === "1" ? "1" : "0",
      devtoken: data.devtoken
    };
    let devToken = await this.DevtokenModel.query().findOne({ user_id: user.id });
    if (devToken) {
      devToken = await this.DevtokenModel.query().patchAndFetchById(devToken.id, insertObj);
    } else {
      devToken = await this.DevtokenModel.query().insert(insertObj);
    }
    return devToken;
  }

  async validateUserToken(userId) {
    let user = await this.UserModel.query().findById(userId);
    if (!user) {
      throw new ApiException(9995, "User is not validated");
    }
    return user;
  }
}
