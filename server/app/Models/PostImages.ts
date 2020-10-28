import BaseModel from "./BaseModel";

class PostImages extends BaseModel {
  static tableName = "post_images";

  //fields
  id: number;
  post_id: number;
  url: string;
  index: number;
}

export default PostImages;
