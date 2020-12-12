import Base from "./baseService";
class Service extends Base {
  login = async ({phonenumber, password}) => {
    return this.request({
      url: "/it4788/login",
      method: "POST",
      data: {phonenumber, password}
    });
  };

}

export default () => new Service();
