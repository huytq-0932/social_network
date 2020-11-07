import BaseModel from "./BaseModel";

class LikeModel extends BaseModel {
  static tableName = "chats";

  //fields
  id: number;
  send_id: number;
  receive_id: number;
  content: string;
  createdAt: Date;
}

export default LikeModel;
