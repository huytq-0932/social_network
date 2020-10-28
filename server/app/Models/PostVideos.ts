import BaseModel from "./BaseModel";

class PostVideos extends BaseModel {
  static tableName = "post_videos";

  //fields
  id: number;
  post_id: number;
  url: string;
  thumb: string;
}

export default PostVideos;
