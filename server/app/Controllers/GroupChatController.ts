import BaseController from "./BaseController";
import Model from "@root/server/app/Models/GroupChatModel";
import ChatModel from "@root/server/app/Models/ChatModel";
import UserModel from "@root/server/app/Models/UserModel";
import FriendshipModel from "@root/server/app/Models/FriendshipModel";
import to from "await-to-js";
import ApiException from "@app/Exceptions/ApiException";
import _ from "lodash";
import moment from "moment";
export default class Controller extends BaseController {
  Model = Model;
  ChatModel = ChatModel;
  UserModel = UserModel;
  FriendshipModel = FriendshipModel;

  async getListConversation() {
    const inputs = this.request.all();
    const allowFields = {
      index: "number!",
      count: "number!",
    };
    const data = this.validate(inputs, allowFields);
    const auth = this.request.auth;
    let result = await this.Model.query()
      .where("user_ids", "@>", auth.id)
      .orderBy("updatedAt", "desc")
      // @ts-ignore
      .getForGridTable({ page: data.index, pageSize: data.count });
    let conversations = result.data || [];
    let [error, lastMessages] = await to(
      Promise.all(
        conversations.map((item) => {
          return this.ChatModel.query()
            .where("group_id", item.id)
            .orderBy("createdAt", "desc")
            .first();
        })
      )
    );
    if (error) {
      throw new ApiException(1001, "Can not connect to DB!");
    }
    let [_error, partners] = await to(
      Promise.all(
        conversations.map((item) => {
          let partnerId = (item.user_ids || []).find((ele) => ele != auth.id);
          if (!partnerId) {
            return;
          }
          return this.UserModel.query().findById(partnerId);
        })
      )
    );
    if (_error) {
      throw new ApiException(1001, "Can not connect to DB!");
    }
    conversations = conversations.map((item, index) => {
      delete item.createdAt;
      delete item.updatedAt;
      delete item.user_ids;
      let partner = (partners[index] || {}) as UserModel;
      item = {
        ...item,
        Partner: {
          id: partner.id,
          username: partner.username,
          avatar: partner.avatar,
        },
      };
      if (!lastMessages[index]) {
        return {
          ...item,
          lastMessage: null,
        };
      }
      let created = _.get(lastMessages[index], "createdAt", "");
      created = moment(created).valueOf();
      return {
        ...item,
        lastMessage: {
          message: _.get(lastMessages[index], "content", ""),
          created: created + "",
          unread: !_.get(lastMessages[index], "readed_user_ids", []).includes(
            auth.id
          ),
        },
      };
    });
    let conversationIds = conversations.map(item => item.id)
    let numNewMessage = await ChatModel.getNumberOfNewMessage(auth.id, conversationIds);
    this.response.addReturnData({ numNewMessage: numNewMessage});
    return conversations;
  }
  async getConversation() {
    const inputs = this.request.all();
    const allowFields = {
      index: "number!",
      count: "number!",
      partner_id: "number",
      conversation_id: "number",
    };
    const auth = this.request.auth;
    const loginUser = await this.UserModel.query()
      .select("id", "username", "avatar")
      .findById(auth.id);
    const data = this.validate(inputs, allowFields);
    let partner = null;
    let is_blocked = false;
    if (!data.partner_id && !data.conversation_id) {
      throw new ApiException(
        1004,
        "Vui lòng truyền partner_id hoặc conversation_id!"
      );
    }
    let chats = [];
    if (data.conversation_id) {
      let conversation = await this.Model.query().findById(
        data.conversation_id
      );
      if (!conversation) {
        chats = [];
      } else {
        let partner_id = (conversation.user_ids || []).find(
          (id) => id !== auth.id
        );

        if (partner_id) {
          partner = await this.UserModel.query()
            .select("id", "username", "avatar")
            .findById(partner_id);
        }
        let messages = await this.ChatModel.query()
          .where("group_id", data.conversation_id)
          .orderBy("createdAt", "desc");
        chats = messages.map((item) => {
          return {
            message: item.content,
            message_id: item.id,
            unread: !(item.readed_user_ids || []).includes(auth.id),
            created: item.createdAt,
            sender: loginUser.id === item.send_id ? loginUser : partner,
          };
        });
      }
    } else {
      // trường hợp gửi parnerId lên
      partner = await this.UserModel.query()
        .select("id", "username", "avatar")
        .findById(data.partner_id);
      let conversation = await this.Model.query()
        .where("user_ids", "@>", auth.id)
        .andWhere("user_ids", "@>", data.partner_id)
        .first();
      if (!conversation) {
        chats = [];
      } else {
        let messages = await this.ChatModel.query()
          .where("group_id", conversation.id)
          .orderBy("createdAt", "desc");
        chats = messages.map((item) => {
          return {
            message: item.content,
            message_id: item.id,
            unread: !(item.readed_user_ids || []).includes(auth.id),
            created: item.createdAt,
            sender: loginUser.id === item.send_id ? loginUser : partner,
          };
        });
      }
    }
    if (partner) {
      is_blocked = await this.FriendshipModel.isBlockedTogether(
        auth.id,
        partner.id
      );
    }

    return {
      conversations: chats,
      is_blocked,
    };
  }

  async sendMessage() {
    const inputs = this.request.all();
    const allowFields = {
      partner_id: "number!",
      message: "string!",
    };
    const data = this.validate(inputs, allowFields);
    const auth = this.request.auth;
    let partner = await this.UserModel.query().findById(data.partner_id);
    if (!partner) {
      throw new ApiException(1004, "Không tồn tại partner!");
    }
    const is_blocked = await this.FriendshipModel.isBlockedTogether(
      auth.id,
      partner.id
    );
    if (is_blocked) {
      throw new ApiException(1009, "2 người đã chặn nhau!");
    }
    let existConversation = await this.Model.query()
      .where("user_ids", "@>", auth.id)
      .andWhere("user_ids", "@>", data.partner_id)
      .first();
    if (!existConversation) {
      existConversation = await this.Model.query().insert({
        user_ids: JSON.stringify(_.sortBy([auth.id, partner.id])),
      });
    }
    return await this.ChatModel.query().insert({
      send_id: auth.id,
      group_id: existConversation.id,
      receive_id: partner.id,
      content: data.message,
      readed_user_ids: JSON.stringify([auth.id]),
    });
  }

  async deleteMessage() {
    const inputs = this.request.all();
    const allowFields = {
      message_id: "number!",
      // partner_id: "number",
      // conversation_id: "number",
    };
    const data = this.validate(inputs, allowFields);
    const auth = this.request.auth;
    let exist = await this.ChatModel.query().findById(data.message_id);
    if (!exist) {
      throw new ApiException(9995, "Message is not validated");
    }
    if (exist.send_id !== auth.id) {
      throw new ApiException(1009, "Can not access!");
    }

    let [err, rs] = await to(
      this.ChatModel.query().deleteById(data.message_id)
    );
    if (err) throw new ApiException(1001, "Connect DB lỗi!");

    return { message: `Delete successfully: ${rs} record` };
  }

  async deleteConversation() {
    const inputs = this.request.all();
    const allowFields = {
      partner_id: "number",
      conversation_id: "number",
    };
    const data = this.validate(inputs, allowFields);
    const auth = this.request.auth;
    if (!data.partner_id && !data.conversation_id) {
      throw new ApiException(
        1004,
        "Vui lòng truyền partner_id hoặc conversation_id!"
      );
    }
    let conversation;
    if (data.conversation_id) {
      conversation = await this.Model.query().findById(data.conversation_id);
    } else {
      conversation = await this.Model.query()
        .where("user_ids", "@>", auth.id)
        .andWhere("user_ids", "@>", data.partner_id)
        .first();
    }
    if (!conversation) {
      throw new ApiException(9995, "Không tồn tại conversation!");
    }

    if (!conversation.user_ids.includes(auth.id)) {
      throw new ApiException(1009, "Can not access!");
    }

    let [err, rs] = await to(this.Model.query().deleteById(conversation.id));
    if (err) throw new ApiException(1001, "Connect DB lỗi!");

    return { message: `Delete successfully: ${rs} record` };
  }

  async setReadMessage() {
    const inputs = this.request.all();
    const allowFields = {
      partner_id: "number",
      conversation_id: "number",
    };
    const data = this.validate(inputs, allowFields);
    const auth = this.request.auth;
    if (!data.partner_id && !data.conversation_id) {
      throw new ApiException(
        1004,
        "Vui lòng truyền partner_id hoặc conversation_id!"
      );
    }
    let conversation = null;
    if (data.partner_id) {
      conversation = await this.Model.query()
        .where("user_ids", "@>", auth.id)
        .andWhere("user_ids", "@>", data.partner_id)
        .first();
    } else {
      conversation = await this.Model.query().findById(data.conversation_id);
    }

    if (!conversation) {
      return [];
    }
    let unreadMessages = await this.ChatModel.query()
      .where("group_id", conversation.id)
      .whereNot("user_ids", "@>", auth.id);
    let readed_users = unreadMessages.map((message) => {
      let readed_user_ids = message.readed_user_ids || [];
      readed_user_ids.push(auth.id);
      return _.sortBy(readed_user_ids);
    });
    let [error, result] = await to(
      Promise.all(
        unreadMessages.map((item, index) =>
          this.ChatModel.query().patchAndFetchById(item.id, {
            readed_user_ids: JSON.stringify(readed_users[index] || []),
          })
        )
      )
    );
    if (error) {
      throw new ApiException(1001, "Can not connect to DB!");
    }
    return result;
  }
}
