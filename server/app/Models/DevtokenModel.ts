import BaseModel from "./BaseModel";

class DevtokenModel extends BaseModel {
  static tableName = "devtokens";

  //fields
  id: number;
  user_id: number;
  devtype: string;
  devtoken: string;
}

export default DevtokenModel;
