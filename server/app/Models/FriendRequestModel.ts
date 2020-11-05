import BaseModel from "./BaseModel";

class FriendRequestModel extends BaseModel {
  static tableName = "friend_requests";

  //fields
  id: number;
  from_user_id: number;
  to_user_id: number;
}

export default FriendRequestModel;