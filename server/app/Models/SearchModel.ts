import BaseModel from "./BaseModel";

class SearchModel extends BaseModel {
  static tableName = "search";

  //fields
  id: number;
  user_id: number;
  keyword: string;
}

export default SearchModel;
