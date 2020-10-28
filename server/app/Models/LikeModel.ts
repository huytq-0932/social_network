import BaseModel from "./BaseModel";

class LikeModel extends BaseModel {
  static tableName = "likes";

  //fields
  id: number;
  user_id: number;
  post_id: number;
}

export default LikeModel;
