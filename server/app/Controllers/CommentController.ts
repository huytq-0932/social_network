import BaseController from "./BaseController";
import CommentModel from "@root/server/app/Models/CommentModel";
import UserModel from "@root/server/app/Models/UserModel";
import PostModel from "@root/server/app/Models/PostModel";
import ApiException from "@app/Exceptions/ApiException";
import _ from "lodash";

export default class CommentController extends BaseController {
  CommentModel = CommentModel;
  UserModel = UserModel;
  PostModel = PostModel;

  async getComment() {
    const inputs = this.request.all();
    const allowFields = {
      token: "string!",
      id: "number!",
      index: "number!",
      count: "number!"
    };
    let data = this.validate(inputs, allowFields, {
      removeNotAllow: true
    });
    await this.validateUserToken(this.request.auth.id);

    let postId = data.id;
    let { index, count } = data;
    if (!(await this.isPostExist(postId))) {
      throw new ApiException(9992, "Post is not existed");
    }
    return this.retrieveListComment(postId, index, count);
  }

  async setComment() {
    const inputs = this.request.all();
    const allowFields = {
      token: "string!",
      id: "number!",
      comment: "string!",
      index: "number!",
      count: "number!"
    };
    let data = this.validate(inputs, allowFields, {
      removeNotAllow: true
    });
    let user = await this.validateUserToken(this.request.auth.id);

    let postId = data.id;
    if (!(await this.isPostExist(postId))) {
      throw new ApiException(9992, "Post is not existed");
    }
    await this.insertComment(postId, user.id, data.comment);
    return this.retrieveListComment(postId, data.index, data.count);
  }

  async validateUserToken(userId) {
    let user = await this.UserModel.query().findById(userId);
    if (!user) {
      throw new ApiException(9995, "User is not validated");
    }
    return user;
  }

  async isPostExist(postId) {
    let post = await this.PostModel.query().findById(postId);
    return !!post;
  }

  async insertComment(postId, userId, comment) {
    await this.CommentModel.query().insert({
      user_id: userId,
      post_id: postId,
      comment
    });
    return true;
  }

  async retrieveListComment(postId, index, count) {
    let comments: any = await this.CommentModel.query()
      .select(
        "comments.id",
        "comments.comment",
        "comments.createdAt as created",
        "users.id as posterId",
        "users.name as posterName",
        "users.avatar as posterAvatar"
      )
      .leftJoin("users", "comments.user_id", "users.id")
      .where({ post_id: postId })
      .orderBy("id", "DESC")
      .offset(index)
      .limit(count);
    return comments.map((comment) => {
      const { posterId, posterName, posterAvatar } = comment;
      delete comment.posterId;
      delete comment.posterName;
      delete comment.posterAvatar;
      comment.poster = { id: posterId, name: posterName, avatar: posterAvatar };
      return comment;
    });
  }
}
