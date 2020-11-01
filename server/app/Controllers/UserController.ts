import BaseController from "./BaseController";
import Model from "@root/server/app/Models/UserModel";
import ApiException from "@app/Exceptions/ApiException";
import Auth from "@libs/Auth";
import authConfig from "@config/auth";
const random = require('random')

export default class Controller extends BaseController {
  Model = Model;
  async signup() {
    const inputs = this.request.all();
    const allowFields = {
      name: "string",
      phonenumber: "string!",
      password: "string!",
      uuid: "string!",
    };
    const data = this.validate(inputs, allowFields);
    let exist = await this.Model.query().findOne({ phone: data.phonenumber });
    if (exist) {
      throw new ApiException(9996, "User Exist");
    }
    data.password = this.Model.hash(data.password);

    let result = await this.Model.query().insert({
      phone: data.phone,
      password: data.password,
      name: data.name || "new member",
    });
    delete result.password;
    return result;
  }
  async login() {
    const inputs = this.request.all();
    const allowFields = {
      phonenumber: "string!",
      password: "string!",
    };

    const data = this.validate(inputs, allowFields);
    let user = await this.Model.checkLogin({
      phonenumber: data.phonenumber,
      password: data.password,
    });
    if (!user) {
      throw new ApiException(7000, "Can not login");
    }
    let token = Auth.generateJWT(
      {
        id: user.id,
        phonenumber: user.phone,
      },
      {
        key: authConfig["SECRET_KEY"],
        expiresIn: authConfig["JWT_EXPIRE"],
      }
    );

    this.response.success({
      id: user.id,
      username: user.name,
      token,
      avatar: user.avatar,
      active: !user.avatar && !user.name ? -1 : 1,
    });
  }

  async checkVerifyCode() {
    let inputs = this.request.all();

    const allowFields = {
      phonenumber: "string!",
      code_verify: "string!"
    };
    let data = this.validate(inputs, allowFields, {
      removeNotAllow: true,
    });
    let exist = await this.Model.query().findOne({
      phone: data.phonenumber,
      code_verify: data.code_verify
    });
    if (!exist) {
      throw new ApiException(9995, "User is not validated");
    }

    let token = Auth.generateJWT(
      {
        id: exist.id,
        phonenumber: exist.phone,
      },
      {
        key: authConfig["SECRET_KEY"],
        expiresIn: authConfig["JWT_EXPIRE"],
      }
    );
    return {
      token,
      id: exist.id
    }
  }

  async getVerifyCode() {
    let inputs = this.request.all();

    const allowFields = {
      phonenumber: "string!",
    };
    let data = this.validate(inputs, allowFields, {
      removeNotAllow: true,
    });
    let exist = await this.Model.query().findOne({ phone: data.phonenumber });
    if (!exist) {
      throw new ApiException(9995, "User is not validated");
    }

    let randomCode = random.int(100000, 999999);
    while (true) {
      let existCode = await this.Model.query().findOne({
        code_verify: randomCode,
      });
      if (!existCode) {
        await this.Model.query().patchAndFetchById(exist.id, {
          code_verify: randomCode
        });
        break;
      }
    }
    return randomCode;
  }

  async updatePassword() {
    let inputs = this.request.all();

    const allowFields = {
      password: "string!",
      token: "string!",
    };
    let data = this.validate(inputs, allowFields, {
      removeNotAllow: true,
    });
    let auth = this.request.auth;
    let user = await this.Model.query().findById(auth.id);

    if (!user) {
      throw new ApiException(9995, "User is not validated");
    }

    let result = await user.changePassword(data["password"]);
    delete result["password"];
    return result;
  }

  async getInfo() {
    const inputs = this.request.all();
    const allowFields = {
      token: "string!",
      user_id: "string",
    };
    const data = this.validate(inputs, allowFields);
    try {
      const decodedToken = await Auth.decodeJWT(data.token, {
        key: authConfig["SECRET_KEY"],
        expiresIn: authConfig["JWT_EXPIRE"],
      });
      const id = !data.user_id ? decodedToken.id : data.user_id;
      const user = await this.Model.getInfo(id);
      if (!user) {
        throw new ApiException(9995, "User is not validated");
      }
      this.response.success(user);
    } catch (e) {
      throw new ApiException(9998, "Token is invalid");
    }
  }
}
