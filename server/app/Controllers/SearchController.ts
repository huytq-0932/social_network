import BaseController from "./BaseController";
import SearchModel from "@root/server/app/Models/SearchModel";
import UserModel from "@root/server/app/Models/UserModel";
import PostModel from "@root/server/app/Models/PostModel";
import ApiException from "@app/Exceptions/ApiException";
import _ from "lodash";

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
    return "VietAnhdeptrai";
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
    console.log(search);
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
}
