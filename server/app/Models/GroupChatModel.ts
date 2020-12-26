import BaseModel from "./BaseModel";

class Model extends BaseModel {
  static tableName = "group_chats";

  //fields
  id: number;
  user_ids: any;
  createdAt: Date;
  
}

export default Model;
