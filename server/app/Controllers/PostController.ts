import _ from "lodash";
import BaseController from "./BaseController";
import UserModel from "@root/server/app/Models/UserModel";
import PostModel from "@root/server/app/Models/PostModel";
import CommentModel from "@root/server/app/Models/CommentModel";
import LikeModel from "@root/server/app/Models/LikeModel";
import PostBlockedUsers from "@root/server/app/Models/PostBlockedUsers";
import PostImages from "@root/server/app/Models/PostImages";
import PostVideos from "@root/server/app/Models/PostVideos";
import ApiException from "@app/Exceptions/ApiException";

export default class PostController extends BaseController {
  UserModel = UserModel;
  PostModel = PostModel;
  LikeModel = LikeModel;
  CommentModel = CommentModel;
  PostBlockedUserModel = PostBlockedUsers;
  PostImageModel = PostImages;
  PostVideoModel = PostVideos;

  async getListVideos() {
    const inputs = this.request.all();
    const allowFields = {
      token: "string!",
      user_id: "number",
      // in_campaign: "string",
      // campaign_id: "number",
      // latitude: "string",
      // longitude: "string",
      last_id: "number",
      index: "number",
      count: "number"
    };
    let data = this.validate(inputs, allowFields, {
      removeNotAllow: true
    });
    let auth = this.request.auth;
    let user = await this.UserModel.query().findById(auth.id);
    if (!user) {
      throw new ApiException(9995, "User is not validated");
    }

    let count = data.count || 20;
    let index = data.index || 0;
    let { videos, currentLastVideoId } = await this.getNLastVideo(data.last_id, index, count);
    let postIds = videos.map((video) => video.post_id);
    let posts = await this.PostModel.query().select().whereIn("id", postIds);
    let postsUserIds = posts.map((post) => post.user_id);

    const [
      postsAuthors,
      postsLikes,
      postsBlocked,
      postsImages,
      postsVideos,
      comments
    ] = await Promise.all([
      this.getPostAuthor(postsUserIds),
      this.getPostLikes(postIds),
      this.getPostsBlocked(postIds, user.id),
      this.getPostImages(postIds),
      this.getPostVideos(postIds),
      this.getPostComments(postIds)
    ]);
    let postsInfo = posts.map((post) => {
      let postLikes = postsLikes.filter((like) => like.post_id === post.id);
      return {
        ...post,
        author: _.find(postsAuthors, { id: post.user_id }),
        like: postLikes.length,
        is_liked: postLikes.findIndex((like) => like.user_id === user.id) > -1,
        is_blocked: postsBlocked.filter((block) => block.post_id === post.id).length > 0,
        can_edit: post.user_id === user.id,
        image: postsImages.filter((image) => image.post_id === post.id),
        video: postsVideos.filter((video) => video.post_id === post.id),
        comment: comments.length
      };
    });
    return {
      posts: postsInfo,
      new_items:
        !data.last_id || currentLastVideoId === data.last_id
          ? 0
          : videos.filter((video) => video.id > data.last_id).length,
      last_id: currentLastVideoId
    };
  }

  async checkNewItem() {
    const inputs = this.request.all();
    const allowFields = {
      token: "string!",
      last_id: "number",
      category_id: "number"
    };
    let data = this.validate(inputs, allowFields, {
      removeNotAllow: true
    });
    let auth = this.request.auth;
    let user = await this.UserModel.query().findById(auth.id);
    if (!user) {
      throw new ApiException(9995, "User is not validated");
    }

    const new_items: any = await this.PostModel.query().count().where("id", ">", data.last_id);
    return { new_items: parseInt(new_items[0].count) };
  }

  async getListPosts() {
    const inputs = this.request.all();
    const allowFields = {
      token: "string!",
      user_id: "number",
      in_campaign: "string",
      campaign_id: "number",
      latitude: "string",
      longitude: "string",
      last_id: "number",
      index: "number",
      count: "number"
    };
    let data = this.validate(inputs, allowFields, {
      removeNotAllow: true
    });
    let auth = this.request.auth;
    let user = await this.UserModel.query().findById(auth.id);
    if (!user) {
      throw new ApiException(9995, "User is not validated");
    }

    let count = data.count || 20;
    let index = data.index || 0;
    let { posts, currentLastPostId } = await this.getNLastPost(data.last_id, index, count);
    let postIds = posts.map((post) => post.id);
    let postsUserIds = posts.map((post) => post.user_id);

    const [
      postsAuthors,
      postsLikes,
      postsBlocked,
      postsImages,
      postsVideos,
      postComments
    ] = await Promise.all([
      this.getPostAuthor(postsUserIds),
      this.getPostLikes(postIds),
      this.getPostsBlocked(postIds, user.id),
      this.getPostImages(postIds),
      this.getPostVideos(postIds),
      this.getPostComments(postIds)
    ]);
    let postsInfo = posts.map((post) => {
      let postLikes = postsLikes.filter((like) => like.post_id === post.id);
      return {
        ...post,
        author: _.find(postsAuthors, { id: post.user_id }),
        like: postLikes.length,
        is_liked: postLikes.findIndex((like) => like.user_id === user.id) > -1,
        is_blocked: postsBlocked.filter((block) => block.post_id === post.id).length > 0,
        can_edit: post.user_id === user.id,
        image: postsImages.filter((image) => image.post_id === post.id),
        video: postsVideos.filter((video) => video.post_id === post.id),
        comment: postComments.length
      };
    });
    return {
      posts: postsInfo,
      new_items:
        !data.last_id || currentLastPostId === data.last_id
          ? 0
          : posts.filter((post) => post.id > data.last_id).length,
      last_id: currentLastPostId
    };
  }

  async getNLastPost(lastId, index, count) {
    let currentLastPostId = await this.getLastPostId();
    if (!lastId || currentLastPostId === lastId) {
      let posts = await this.PostModel.query()
        .select()
        .limit(count)
        .offset(index)
        .orderBy("posts.id", "DESC");
      return { posts, currentLastPostId };
    } else {
      let posts = await this.PostModel.query()
        .select()
        .whereNotIn(
          "id",
          this.PostModel.query()
            .select("id")
            .where("id", "<=", lastId)
            .limit(index)
            .orderBy("posts.id", "DESC")
        )
        .limit(count)
        .orderBy("posts.id", "DESC");
      return { posts, currentLastPostId };
    }
  }

  async getLastPostId() {
    let lastPost = await this.PostModel.query().select("id").orderBy("id", "desc").limit(1);
    return lastPost[0].id;
  }

  async getLastVideoId() {
    let lastVideo = await this.PostVideoModel.query().select("id").orderBy("id", "desc").limit(1);
    return lastVideo[0].id;
  }

  async getNLastVideo(lastId, index, count) {
    let currentLastVideoId = await this.getLastVideoId();
    if (!lastId || currentLastVideoId === lastId) {
      let videos = await this.PostVideoModel.query()
        .select()
        .limit(count)
        .offset(index)
        .orderBy("post_videos.id", "DESC");
      return { videos, currentLastVideoId };
    } else {
      let videos = await this.PostVideoModel.query()
        .select()
        .whereNotIn(
          "id",
          this.PostVideoModel.query()
            .select("id")
            .where("id", "<=", lastId)
            .limit(index)
            .orderBy("post_videos.id", "DESC")
        )
        .limit(count)
        .orderBy("post_videos.id", "DESC");
      return { videos, currentLastVideoId };
    }
  }

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
    let postInfo: PostModel = await this.PostModel.query().findById(data.id);
    if (!postInfo) throw new ApiException(9992, "Post is not existed");
    if (postInfo.user_id !== user.id) throw new ApiException(1009, "Not access");

    // Check permission delete image in post
    let imageDelRecord = await this.PostImageModel.query().select().whereIn("id", data.image_del);
    if (_.findIndex(imageDelRecord, (record) => record.post_id !== data.id) > -1) {
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
    return "Edit post successfully";
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
    if (postInfo.user_id !== user.id) throw new ApiException(1009, "Not access.");

    await this.PostModel.query().delete().where("id", "=", postInfo.id);

    return "Delete post successfully";
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
    const { files } = this.request;
    if (files && files.image && files.video) throw new ApiException(1004);
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
    this.writeAndInsertFile(files, post.id, data.image_sort);
    return { id: post.id };
  }

  async writeAndInsertFile(files, postId, imageSort) {
    if (files) {
      if (files.image) {
        let postImages = files.image instanceof Array ? files.image : [files.image];

        let insertPostImages = [];

        // WRITE IMAGE FILE TO SERVER
        postImages.forEach((image, index) => {
          let imageName = this.insertImage(image);
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
      } else if (files.video) {
        let videoName = this.insertVideo(files.video);
        let thumbName = files.thumb ? this.insertImage(files.thumb) : "";

        // INSERT POST_VIDEOS
        await this.PostVideoModel.query().insert({
          post_id: postId,
          url: `/static/data/videos/${videoName}`,
          thumb: thumbName ? `/static/data/images/${thumbName}` : ""
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
      postBlocked,
      postImages,
      postVideos,
      postComments
    ] = await Promise.all([
      this.getPostAuthor([postInfo.user_id]),
      this.getPostLikes([data.id]),
      this.getPostsBlocked([data.id], user.id),
      this.getPostImages([data.id]),
      this.getPostVideos([data.id]),
      this.getPostComments([data.id])
    ]);
    let response: any = {
      ...postInfo,
      author: postAuthor,
      like: postLikes.length + "",
      is_liked: postLikes.findIndex((like) => like.user_id === user.id) > -1 ? "1" : "0",
      is_blocked: postBlocked.length > 0 ? "1" : "0",
      can_edit: postInfo.user_id === user.id ? "1" : "0",
      image: postImages,
      comment: postComments.length + "",
      video: postVideos
    };
    delete response.user_id;
    response.id = response.id + "";
    response.state = response.state + "";
    this.response.success(response);
  }

  async getPostAuthor(userIds: number[]) {
    let postAuthor = await this.UserModel.query()
      .select("id", "name", "avatar", "online")
      .whereIn("id", userIds);
    return postAuthor;
  }

  async getPostLikes(postIds: number[]) {
    let postLikes = await this.LikeModel.query().select().whereIn("post_id", postIds);
    return postLikes;
  }

  async getPostComments(postIds: number[]) {
    let postComments = await this.CommentModel.query().select().whereIn("post_id", postIds);
    return postComments;
  }

  // Người tạo post có block mình không
  async getPostsBlocked(postIds: number[], userId: number) {
    let postsBlocked = await this.PostBlockedUserModel.query()
      .select()
      .whereIn("post_id", postIds)
      .andWhere("user_id", userId);
    return postsBlocked;
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
