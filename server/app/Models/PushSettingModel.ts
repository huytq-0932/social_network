import BaseModel from "./BaseModel";

class PushSettingModel extends BaseModel {
  static tableName = "push_settings";

  //fields
  id: number;
  user_id: number;
  like_comment: string;
  from_friends: string;
  request_friend: string;
  suggest_friend: string;
  birthday: string;
  video: string;
  report: string;
  sound_on: string;
  notification_on: string;
  vibrant_on: string;
  led_on: string;
}

export default PushSettingModel;
