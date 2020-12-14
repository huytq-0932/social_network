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
}

export default NotificationModel;
