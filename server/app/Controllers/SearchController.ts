import CommentModel from "@root/server/app/Models/CommentModel";
import BaseController from "./BaseController";
import SearchModel from "@root/server/app/Models/SearchModel";
import UserModel from "@root/server/app/Models/UserModel";
import PostModel from "@root/server/app/Models/PostModel";
import PostImageModel from "@root/server/app/Models/PostImages";
import PostVideoModel from "@root/server/app/Models/PostVideos";
import ApiException from "@app/Exceptions/ApiException";
import LikeModel from "@root/server/app/Models/LikeModel";
import _ from "lodash";
import { raw } from "objection";

interface SearchInput {
  userId: number;
  keyword: string | null | undefined;
  index: number;
  count: number;
}

export default class LikeController extends BaseController {
  SearchModel = SearchModel;
  UserModel = UserModel;
  PostModel = PostModel;
  LikeModel = LikeModel;
  CommentModel = CommentModel;
  PostImageModel = PostImageModel;
  PostVideoModel = PostVideoModel;

  async searchPost() {
    const inputs = this.request.all();
    const allowFields = {
      token: "string!",
      user_id: "string!",
      keyword: "string!",
      index: "number!",
      count: "number!"
    };
    let data = this.validate(inputs, allowFields, {
      removeNotAllow: true
    });
    let user = await this.validateUserToken(this.request.auth.id);
    if (
      !/^\d+$/.test(data.user_id) ||
      data.user_id !== user.id + "" ||
      data.index < 0 ||
      data.count < 0
    ) {
      throw new ApiException(1003, "Parameter type is invalid.");
    }
    let posts = await this.retrievePost(data.keyword, data.index, data.count, user.id);
    const postIds = posts.map((post) => post.id);
    const [postsImages, postsVideos] = await Promise.all([
      this.getPostImages(postIds),
      this.getPostVideos(postIds)
    ]);
    return posts.map((post) => {
      return {
        ...post,
        image: postsImages.filter((image) => image.post_id === post.id),
        video: postsVideos.filter((video) => video.post_id === post.id)
      };
    });
  }

  async delSavedSearch() {
    const inputs = this.request.all();
    const allowFields = {
      token: "string!",
      search_id: "number",
      all: "string!"
    };
    let data = this.validate(inputs, allowFields, {
      removeNotAllow: true
    });
    let user = await this.validateUserToken(this.request.auth.id);
    if (data.all === "0") {
      await this.checkPermission(user.id, data.search_id);
    }
    await this.deleteSearch(data.search_id, data.all === "1", user.id);
    return "Delete successfully";
  }

  async getSavedSearch() {
    const inputs = this.request.all();
    const allowFields = {
      token: "string!",
      keyword: "string",
      index: "number!",
      count: "number!"
    };
    let data = this.validate(inputs, allowFields, {
      removeNotAllow: true
    });
    let user = await this.validateUserToken(this.request.auth.id);
    const searchInput: SearchInput = {
      userId: user.id,
      keyword: data.keyword || "",
      index: data.index,
      count: data.count
    };
    let search = await this.retrieveSearch(searchInput);
    return search;
  }

  async validateUserToken(userId) {
    let user = await this.UserModel.query().findById(userId);
    if (!user) {
      throw new ApiException(9995, "User is not validated");
    }
    return user;
  }

  async retrieveSearch(searchInput: SearchInput) {
    let search = await this.SearchModel.query()
      .select()
      .where("keyword", "like", `%${searchInput.keyword}%`)
      .andWhere("user_id", searchInput.userId)
      .orderBy("created_at")
      .limit(searchInput.count)
      .offset(searchInput.index);
    return search;
  }

  async checkPermission(userId, searchId) {
    let search = await this.SearchModel.query()
      .select()
      .where("user_id", userId)
      .andWhere("id", searchId);
    if (!search.length) {
      throw new ApiException(1009, "Not access");
    }
    return true;
  }

  async deleteSearch(id, isDeleteAll, userId) {
    if (isDeleteAll) {
      await this.SearchModel.query().delete().where("user_id", userId);
    } else {
      await this.SearchModel.query().delete().where("id", id);
    }
  }

  async retrievePost(keyword, index, count, userId) {
    let posts: any = await this.PostModel.query()
      .select(
        raw(
          "posts.*, users.id as posterId, users.name as posterName, users.avatar as posterAvatar, COALESCE(l.cnl, 0) AS like, COALESCE(c.cnc, 0) AS comment, CASE WHEN lk.id IS NULL THEN false ELSE true END AS is_liked"
        )
      )
      .where("described", "like", `%${keyword}%`)
      .leftJoin(
        this.LikeModel.query().select(raw("post_id, COUNT(*) as cnl")).groupBy("post_id").as("l"),
        "posts.id",
        "l.post_id"
      )
      .leftJoin(
        this.CommentModel.query()
          .select(raw("post_id, COUNT(*) as cnc"))
          .groupBy("post_id")
          .as("c"),
        "posts.id",
        "c.post_id"
      )
      .leftJoin(
        this.LikeModel.query().select().where("user_id", userId).as("lk"),
        "posts.id",
        "lk.post_id"
      )
      .leftJoin("users", "posts.user_id", "users.id")
      .offset(index)
      .limit(count)
      .orderBy("id", "DESC");
    return posts.map((post) => {
      const { posterid, postername, posteravatar } = post;
      delete post.posterid;
      delete post.postername;
      delete post.posteravatar;
      delete post.user_id;
      delete post.state;
      delete post.banned;
      delete post.createdAt;
      delete post.updatedAt;
      delete post.can_comment;
      post.author = { id: posterid + "", username: postername, avatar: posteravatar };
      return post;
    });
  }

  async getPostImages(postIds: number[]) {
    let postImages = await this.PostImageModel.query()
      .select()
      .whereIn("post_id", postIds)
      .orderBy("index")
      .orderBy("id");
    let apiHost = process.env.API_HOST;
    return postImages.map((image) => {
      return {
        id: image.id,
        post_id: image.post_id,
        url: apiHost + image.url,
        index: image.index
      };
    });
  }

  async getPostVideos(postIds: number[]) {
    let postImages = await this.PostVideoModel.query().select().whereIn("post_id", postIds);
    let apiHost = process.env.API_HOST;
    return postImages.map((video) => {
      return {
        id: video.id,
        post_id: video.post_id,
        url: apiHost + video.url,
        thumb: apiHost + video.thumb
      };
    });
  }
}
