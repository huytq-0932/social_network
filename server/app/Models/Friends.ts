import BaseModel from "./BaseModel";

class FriendRequestModel extends BaseModel {
  static tableName = "friends";

  //fields
  id: number;
  user_1_id: number;
  user_2_id: number;
  status:
  createdAt: string;
}

export default FriendRequestModel;
