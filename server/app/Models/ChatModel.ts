import BaseModel from "./BaseModel";
import to from "await-to-js";
class LikeModel extends BaseModel {
  static tableName = "chats";

  //fields
  id: number;
  send_id: number;
  group_id: number;
  receive_id: number;
  content: string;
  createdAt: Date;
  readed_user_ids: any;
  static async getNumberOfNewMessage(userId, conversationIds) {
    let [error, unreadMessages = []] = await to(
      this.query()
        .whereIn("group_id", conversationIds)
        .whereNot("readed_user_ids", "@>", userId)
        .distinct("group_id")
    );
    return unreadMessages.length;
  }
}

export default LikeModel;
