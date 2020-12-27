import BaseModel from "./BaseModel";

class PostModel extends BaseModel {
  static tableName = "posts";

  //fields
  id: number;
  user_id: number;
  described: string;
  banned: string;
  state: number;
  can_comment: boolean;
  image!: Array<Object>;
  createdAt: Date;
  updatedAt: Date;
}

export default PostModel;
