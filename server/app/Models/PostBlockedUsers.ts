import BaseModel from "./BaseModel";

class PostBlockedUsers extends BaseModel {
  static tableName = "post_blocked_users";

  //fields
  id: number;
  user_id: number;
  post_id: number;
}

export default PostBlockedUsers;
