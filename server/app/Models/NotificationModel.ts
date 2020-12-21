import BaseModel from "./BaseModel";

class NotificationModel extends BaseModel {
  static tableName = "notifications";

  //fields
  id: number;
  user_id: number;
  type: string;
  object_id: string;
  title: string;
  suggest_friend: string;
  avatar: string;
  group: string;
  read: string;
  last_update: Date;

  setRead() {
    return this.$query().patchAndFetchById(this.id, {
      read: "1",
      last_update: new Date()
    });
  }
}

export default NotificationModel;
