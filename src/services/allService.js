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

}

export default () => new Service();
