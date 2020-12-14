import BaseController from "./BaseController";
import NotificationModel from "@root/server/app/Models/NotificationModel";
import UserModel from "@root/server/app/Models/UserModel";
import ApiException from "@app/Exceptions/ApiException";
import _ from "lodash";

export default class NotificationController extends BaseController {
  UserModel = UserModel;
  NotificationModel = NotificationModel;

  async getNotification() {
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
    let notifications = await this.NotificationModel.query()
      .select()
      .where("user_id", user.id)
      .offset(data.index)
      .limit(data.count)
      .orderBy("id", "ASC");
    return notifications;
  }

  async setReadNotification() {
    // Luân làm phần này liên quan đến push (2 trường badge và last_update)
  }

  async validateUserToken(userId) {
    let user = await this.UserModel.query().findById(userId);
    if (!user) {
      throw new ApiException(9995, "User is not validated");
    }
    return user;
  }
}
