import BaseModel from "./BaseModel";

class ReportPostModel extends BaseModel {
  static tableName = "report_posts";

  //fields
  id: number;
  post_id: number;
  subject: string;
  detail: string;
}

export default ReportPostModel;
