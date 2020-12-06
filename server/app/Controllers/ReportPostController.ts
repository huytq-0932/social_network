import BaseController from "./BaseController";
import ReportPostModel from "@root/server/app/Models/ReportPostModel";
import UserModel from "@root/server/app/Models/UserModel";
import ApiException from "@app/Exceptions/ApiException";

export default class ReportPostController extends BaseController {
  ReportPostModel = ReportPostModel;
  UserModel = UserModel;

  async reportPost() {
    const inputs = this.request.all();
    const allowFields = {
      token: "string!",
      id: "number",
      subject: "string!",
      details: "string!"
    };
    let data = this.validate(inputs, allowFields, {
      removeNotAllow: true
    });
    let auth = this.request.auth;
    let user = await this.UserModel.query().findById(auth.id);
    if (!user) {
      throw new ApiException(9995, "User is not validated");
    }
    let { id, subject, details } = data;
    await this.ReportPostModel.query().insert({
      post_id: id,
      subject,
      detail: details
    });
    return "Report successfully";
  }
}
