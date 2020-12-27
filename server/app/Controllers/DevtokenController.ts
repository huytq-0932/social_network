import BaseController from "./BaseController";
import DevtokenModel from "@root/server/app/Models/DevtokenModel";
import UserModel from "@root/server/app/Models/UserModel";
import NotificationModel from "@root/server/app/Models/NotificationModel";
import ApiException from "@app/Exceptions/ApiException";
import _ from "lodash";

export default class DevtokenController extends BaseController {
  DevtokenModel = DevtokenModel;
  UserModel = UserModel;
  NotificationModel = NotificationModel;

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
    if (!["0", "1"].includes(data.devtype)) throw new ApiException(1004);
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

  async checkNewVersion() {
    const inputs = this.request.all();
    const allowFields = {
      token: "string!",
      last_update: "string!"
    };
    let data = this.validate(inputs, allowFields, {
      removeNotAllow: true
    });
    let userInfo = await this.validateUserToken(this.request.auth.id);
    if (!/^[0-9]((\.)[0-9]){0,2}$/.test(data.last_update)) throw new ApiException(1004);
    let user = { id: userInfo.id, active: userInfo.activeStatus };
    const badge = await this.NotificationModel.query()
      .select()
      .where({ read: "0", user_id: user.id });
    return {
      version: {
        version: data.last_update,
        require: "0",
        url:
          "https://play.google.com/store/apps/details?id=com.dija.download.downloadmanager&hl=en&gl=US"
      },
      user,
      badge: badge.length,
      unread_message: 0,
      now: new Date()
    };
  }

  async validateUserToken(userId) {
    let user = await this.UserModel.query().findById(userId);
    if (!user) {
      throw new ApiException(9995, "User is not validated");
    }
    return user;
  }
}
