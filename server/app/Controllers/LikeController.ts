import BaseController from "./BaseController";
import LikeModel from "@root/server/app/Models/LikeModel";
import UserModel from "@root/server/app/Models/UserModel";
import PostModel from "@root/server/app/Models/PostModel";
import ApiException from "@app/Exceptions/ApiException";
import _ from "lodash";

export default class ReportPostController extends BaseController {
  LikeModel = LikeModel;
  UserModel = UserModel;
  PostModel = PostModel;

  async like() {
    const inputs = this.request.all();
    const allowFields = {
      token: "string!",
      id: "number"
    };
    let data = this.validate(inputs, allowFields, {
      removeNotAllow: true
    });
    let auth = this.request.auth;
    let user = await this.UserModel.query().findById(auth.id);
    if (!user) {
      throw new ApiException(9995, "User is not validated");
    }

    let postId = data.id;
    let userId = user.id;
    let post = await this.PostModel.query().findById(postId);
    if (!post) throw new ApiException(9992, "Post is not existed");
    let likes = await this.getLikesOfPost(postId);
    if (_.findIndex(likes, { post_id: postId, user_id: userId }) > -1) {
      await this.LikeModel.query()
        .where({ post_id: postId, user_id: userId })
        .delete();
      return { like: likes.length - 1 };
    } else {
      await this.LikeModel.query().insert({ post_id: postId, user_id: userId });
      return { like: likes.length + 1 };
    }
  }

  async getLikesOfPost(postId) {
    return this.LikeModel.query().select().where("post_id", postId);
  }
}
