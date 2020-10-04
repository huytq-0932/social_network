import Base from "./baseService";
import auth from "@src/helpers/auth";

/* function getAll() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`${publicRuntimeConfig.API_HOST}/api/v1/admins`, requestOptions).then(handleResponse);
} */

class Service extends Base {
  index = async (filter: any) => {
    return this.request({
      url: "/api/v1/admins",
      method: "GET",
      data: filter,
    });
  };
  delete = async ({ ids }: { ids: number[] }) => {
    return this.request({
      url: "/api/v1/admins",
      method: "DELETE",
      data: { ids },
    });
  };

  login = async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    return this.request({
      url: "/api/v1/login",
      method: "POST",
      data: { username, password },
    });
  };

  updateMyPassword = async ({ password }: { password: string }) => {
    return this.request({
      url: "/api/v1/admins/updateMyPassword",
      method: "POST",
      data: {
        password,
      },
    });
  };
}

export default () => new Service();
