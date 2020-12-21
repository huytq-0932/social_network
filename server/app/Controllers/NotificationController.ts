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
    const inputs = this.request.all();
    const allowFields = {
      token: "string!",
      notification_id: "string!"
    };
    let data = this.validate(inputs, allowFields, {
      removeNotAllow: true
    });
    let user = await this.validateUserToken(this.request.auth.id);
    if (!/^\d+$/.test(data.notification_id))
      throw new ApiException(9994, "No Data or end of list data");
    let notification = await this.NotificationModel.query().findById(data.notification_id);
    if (!notification) throw new ApiException(9994, "No Data or end of list data");
    if (notification.user_id !== user.id) throw new ApiException(1009, "Not access.");
    let newNotification = await notification.setRead();
    const badge = await this.NotificationModel.query()
      .select()
      .where({ read: "0", user_id: user.id });
    return { badge: badge.length + "", last_update: newNotification.last_update };
  }

  async validateUserToken(userId) {
    let user = await this.UserModel.query().findById(userId);
    if (!user) {
      throw new ApiException(9995, "User is not validated");
    }
    return user;
  }
}
