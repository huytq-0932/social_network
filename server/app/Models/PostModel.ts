import BaseModel from "./BaseModel";

class PostModel extends BaseModel {
  static tableName = "posts";

  //fields
  id: number;
  user_id: number;
  described: string;
  banned: string;
  can_comment: boolean;
}

export default PostModel;
