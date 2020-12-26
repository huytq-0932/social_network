import BaseController from "./BaseController";
import PushSettingModel from "@root/server/app/Models/PushSettingModel";
import UserModel from "@root/server/app/Models/UserModel";
import ApiException from "@app/Exceptions/ApiException";
import _ from "lodash";

export default class CommentController extends BaseController {
  UserModel = UserModel;
  PushSettingModel = PushSettingModel;

  async getPushSetting() {
    const inputs = this.request.all();
    const allowFields = {
      token: "string!"
    };
    let data = this.validate(inputs, allowFields, {
      removeNotAllow: true
    });
    let user = await this.validateUserToken(this.request.auth.id);
    let pushSetting = await this.PushSettingModel.query().findOne({ user_id: user.id });
    if (!pushSetting) {
      let insertObj = {
        user_id: user.id,
        like_comment: "1",
        from_friends: "1",
        request_friend: "1",
        suggest_friend: "1",
        birthday: "1",
        video: "1",
        report: "1",
        sound_on: "1",
        notification_on: "1",
        vibrant_on: "1",
        led_on: "1"
      };
      pushSetting = await this.PushSettingModel.query().insertAndFetch(insertObj);
    }
    delete pushSetting.user_id;
    delete pushSetting.id;
    return pushSetting;
  }

  async setPushSetting() {
    const inputs = this.request.all();
    const allowFields = {
      token: "string!",
      like_comment: "string",
      from_friends: "string",
      request_friend: "string",
      suggest_friend: "string",
      birthday: "string",
      video: "string",
      report: "string",
      sound_on: "string",
      notification_on: "string",
      vibrant_on: "string",
      led_on: "string"
    };
    let data = this.validate(inputs, allowFields, {
      removeNotAllow: true
    });
    let user = await this.validateUserToken(this.request.auth.id);
    let insertObj = {
      user_id: user.id,
      like_comment: data.like_comment === "1" ? "1" : "0",
      from_friends: data.from_friends === "1" ? "1" : "0",
      request_friend: data.request_friend === "1" ? "1" : "0",
      suggest_friend: data.suggest_friend === "1" ? "1" : "0",
      birthday: data.birthday === "1" ? "1" : "0",
      video: data.video === "1" ? "1" : "0",
      report: data.report === "1" ? "1" : "0",
      sound_on: data.sound_on === "1" ? "1" : "0",
      notification_on: data.notification_on === "1" ? "1" : "0",
      vibrant_on: data.vibrant_on === "1" ? "1" : "0",
      led_on: data.led_on === "1" ? "1" : "0"
    };
    let pushSetting = await this.PushSettingModel.query().findOne({ user_id: user.id });
    if (pushSetting) {
      pushSetting = await this.PushSettingModel.query().patchAndFetchById(
        pushSetting.id,
        insertObj
      );
    } else {
      pushSetting = await this.PushSettingModel.query().insert(insertObj);
    }
    delete pushSetting.user_id;
    delete pushSetting.id;
    return pushSetting;
  }

  async validateUserToken(userId) {
    let user = await this.UserModel.query().findById(userId);
    if (!user) {
      throw new ApiException(9995, "User is not validated");
    }
    return user;
  }
}
