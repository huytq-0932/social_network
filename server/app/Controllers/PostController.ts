import BaseController from "./BaseController";
import UserModel from "@root/server/app/Models/UserModel";
import PostModel from "@root/server/app/Models/PostModel";
import LikeModel from "@root/server/app/Models/LikeModel";
import PostBlockedUsers from "@root/server/app/Models/PostBlockedUsers";
import PostImages from "@root/server/app/Models/PostImages";
import PostVideos from "@root/server/app/Models/PostVideos";
import ApiException from "@app/Exceptions/ApiException";
import Auth from "@libs/Auth";
import authConfig from "@config/auth";

export default class PostController extends BaseController {
  UserModel = UserModel;
  PostModel = PostModel;
  LikeModel = LikeModel;
  PostBlockedUsers = PostBlockedUsers;
  PostImages = PostImages;
  PostVideos = PostVideos;

  async createPost() {
    let inputs = this.request.all();
    const allowFields = {
      id: "number!",
      token: "string!"
    };
    let req = this.validate(inputs, allowFields, {
      removeNotAllow: true
    });
  }

  async getPostById() {
    let inputs = this.request.all();

    const allowFields = {
      id: "number!",
      token: "string!"
    };
    let data = this.validate(inputs, allowFields, {
      removeNotAllow: true
    });
    let auth = await Auth.verify(data.token);

    let user = await this.UserModel.query().findById(auth.id);

    if (!user) {
      throw new ApiException(9995, "User is not validated");
    }

    let postInfo = await this.PostModel.query().findById(data.id);
    if (!postInfo) throw new ApiException(9992, "Post is not existed");

    const [
      postAuthor,
      postLikes,
      isBlocked,
      postImages,
      postVideos
    ] = await Promise.all([
      this.getPostAuthor(postInfo.user_id),
      this.getPostLikes(data.id),
      this.getIsBlocked(data.id, postInfo.user_id),
      this.getPostImages(data.id),
      this.getPostVideos(data.id)
    ]);

    this.response.success({
      ...postInfo,
      author: postAuthor,
      like: postLikes.length,
      is_liked:
        postLikes.findIndex((like) => like.user_id === postAuthor[0].id) > -1,
      is_blocked: isBlocked,
      can_edit: postInfo.user_id === user.id,
      image: postImages,
      video: postVideos
    });
  }

  async getPostAuthor(userId: number) {
    let postAuthor = await this.UserModel.query()
      .select("id", "name", "avatar", "online")
      .where("id", userId);
    return postAuthor;
  }

  async getPostLikes(postId: number) {
    let postLikes = await this.LikeModel.query()
      .select()
      .where("post_id", postId);
    return postLikes;
  }

  // Người tạo post có block mình không
  async getIsBlocked(postId: number, userId: number) {
    let isBlocked = await this.PostBlockedUsers.query()
      .select()
      .where("post_id", postId)
      .andWhere("user_id", userId);
    return isBlocked.length > 0;
  }

  async getPostImages(postId: number) {
    let postImages = await this.PostImages.query()
      .select("id", "url", "index")
      .where("post_id", postId)
      .orderBy("index")
      .orderBy("id");
    let apiHost = process.env.API_HOST;
    return postImages.map((image) => {
      return { id: image.id, url: apiHost + image.url };
    });
  }

  async getPostVideos(postId: number) {
    let postImages = await this.PostVideos.query()
      .select()
      .where("post_id", postId);
    let apiHost = process.env.API_HOST;
    return postImages.map((video) => {
      return {
        id: video.id,
        url: apiHost + video.url,
        thumb: apiHost + video.thumb
      };
    });
  }
}
