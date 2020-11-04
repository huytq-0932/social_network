import BaseModel from "./BaseModel";

class CommentModel extends BaseModel {
  static tableName = "comments";

  //fields
  id: number;
  user_id: number;
  post_id: number;
  comment: string;
}

export default CommentModel;
