import _ from "lodash";
import BaseController from "./BaseController";
import UserModel from "@root/server/app/Models/UserModel";
import PostModel from "@root/server/app/Models/PostModel";
import LikeModel from "@root/server/app/Models/LikeModel";
import PostBlockedUsers from "@root/server/app/Models/PostBlockedUsers";
import PostImages from "@root/server/app/Models/PostImages";
import PostVideos from "@root/server/app/Models/PostVideos";
import ApiException from "@app/Exceptions/ApiException";
import Auth from "@libs/Auth";
import fs from "fs";
import path from "path";

export default class PostController extends BaseController {
  UserModel = UserModel;
  PostModel = PostModel;
  LikeModel = LikeModel;
  PostBlockedUserModel = PostBlockedUsers;
  PostImageModel = PostImages;
  PostVideoModel = PostVideos;

  async editPost() {
    const inputs = this.request.all();
    const allowFields = {
      token: "string!",
      id: "number!",
      described: "string!",
      status: "string",
      image_del: ["number"],
      image_sort: ["number"],
      auto_accept: "string",
      auto_block: "string"
    };
    let data = this.validate(inputs, allowFields, {
      removeNotAllow: true
    });
    let auth = this.request.auth;
    let user = await this.UserModel.query().findById(auth.id);
    if (!user) {
      throw new ApiException(9995, "User is not validated");
    }
    let postInfo = await this.PostModel.query().findById(data.id);
    if (!postInfo) throw new ApiException(9992, "Post is not existed");
    if (postInfo.user_id !== user.id)
      throw new ApiException(1009, "Not access");

    // Check permission delete image in post
    let imageDelRecord = await this.PostImageModel.query()
      .select()
      .whereIn("id", data.image_del);
    if (
      _.findIndex(imageDelRecord, (record) => record.post_id !== data.id) > -1
    ) {
      throw new ApiException(1009, "Not access");
    }

    let updatePost = JSON.parse(JSON.stringify(data));
    updatePost.state = updatePost.status;
    updatePost.updatedAt = new Date();
    delete updatePost["token"];
    delete updatePost["image_del"];
    delete updatePost["image_sort"];
    delete updatePost["id"];
    delete updatePost["status"];
    await Promise.all([
      this.PostModel.query().update(updatePost).where({ id: data.id }),
      this.PostImageModel.query().whereIn("id", data.image_del).delete(),
      this.writeAndInsertFile(this.request.files, data.id, data.image_sort)
    ]);
    return "VietAnhdeptrai";
  }

  async deletePostById() {
    let inputs = this.request.all();

    const allowFields = {
      id: "number!",
      token: "string!"
    };
    let data = this.validate(inputs, allowFields, {
      removeNotAllow: true
    });
    let auth = this.request.auth;

    let user = await this.UserModel.query().findById(auth.id);

    if (!user) {
      throw new ApiException(9995, "User is not validated");
    }

    let postInfo = await this.PostModel.query().findById(data.id);
    if (!postInfo) throw new ApiException(9992, "Post is not existed");

    await this.PostModel.query().delete().where("id", "=", postInfo.id);

    return "VietAnhdeptrai";
  }

  async createPost() {
    const inputs = this.request.all();
    const allowFields = {
      described: "string!",
      token: "string!",
      image_sort: ["number"]
    };
    let data = this.validate(inputs, allowFields, {
      removeNotAllow: false
    });
    let auth = this.request.auth;
    let user = await this.UserModel.query().findById(auth.id);
    if (!user) {
      throw new ApiException(9995, "User is not validated");
    }

    // INSERT POST
    let post = await this.PostModel.query().insert({
      user_id: auth.id,
      described: data.described,
      state: 0,
      banned: "0"
    });
    const { files } = this.request;
    this.writeAndInsertFile(files, post.id, data.image_sort);
    return "VietAnhdeptrai";
  }

  async writeAndInsertFile(files, postId, imageSort) {
    if (files) {
      if (files.image) {
        let postImages =
          files.image instanceof Array ? files.image : [files.image];

        let insertPostImages = [];

        // WRITE IMAGE FILE TO SERVER
        postImages.forEach((image, index) => {
          let imageName = image.name;
          fs.writeFileSync(
            path.join(
              __dirname,
              "../../../public/static/data/images/",
              imageName
            ),
            image.data
          );
          insertPostImages.push({
            post_id: postId,
            url: `/static/data/images/${imageName}`,
            index:
              imageSort && imageSort.length && imageSort[index] !== undefined
                ? imageSort[index]
                : index
          });
        });

        // INSERT POST_IMAGES
        await this.PostImageModel.query().insert(insertPostImages);
      }

      if (files.video) {
        fs.writeFileSync(
          path.join(
            __dirname,
            "../../../public/static/data/videos/",
            files.video.name
          ),
          files.video.data
        );
        if (files.thumb) {
          fs.writeFileSync(
            path.join(
              __dirname,
              "../../../public/static/data/images/",
              files.thumb.name
            ),
            files.thumb.data
          );
        }

        // INSERT POST_VIDEOS
        await this.PostVideoModel.query().insert({
          post_id: postId,
          url: `/static/data/images/${files.video.name}`,
          thumb: `/static/data/images/${files.thumb.name}`
        });
      }
    }
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
    let auth = this.request.auth;

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
    let isBlocked = await this.PostBlockedUserModel.query()
      .select()
      .where("post_id", postId)
      .andWhere("user_id", userId);
    return isBlocked.length > 0;
  }

  async getPostImages(postId: number) {
    let postImages = await this.PostImageModel.query()
      .select("id", "url", "index")
      .where("post_id", postId)
      .orderBy("index")
      .orderBy("id");
    let apiHost = process.env.API_HOST;
    return postImages.map((image) => {
      return { id: image.id, url: apiHost + image.url, index: image.index };
    });
  }

  async getPostVideos(postId: number) {
    let postImages = await this.PostVideoModel.query()
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
