import Base from "./baseService";
class Service extends Base {
  login = async ({phonenumber, password}) => {
    return this.request({
      url: "/it4788/login",
      method: "POST",
      data: {phonenumber, password}
    });
  };
  getByPhone = async (phonenumber) => {
    return this.request({
      url: "/it4788/users/getByPhone",
      method: "POST",
      data: {phonenumber}
    });
  }
  getConversation = async (data) => {
    return this.request({
      url: "/it4788/get_conversation",
      method: "POST",
      data: data
    });
  }
  sendMessage = async (data) => {
    return this.request({
      url: "/it4788/send_message",
      method: "POST",
      data: data
    });
  }

}

export default () => new Service();
