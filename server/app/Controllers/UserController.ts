import BaseController from "./BaseController";
import Model from "@root/server/app/Models/UserModel";
import ApiException from "@app/Exceptions/ApiException";
import Auth from "@libs/Auth";
import authConfig from "@config/auth";
import moment from "moment";
import _ from "lodash";
import FriendshipModel from "@app/Models/FriendshipModel";

var stringSimilarity = require("string-similarity");

const random = require("random");

export default class UserController extends BaseController {
  Model = Model;
  FriendshipModel = FriendshipModel;

  async getByPhone() {
    const inputs = this.request.all();
    const allowFields = {
      phonenumber: "string!",
    };
    const data = this.validate(inputs, allowFields);
    var phonePattern = new RegExp(/^0[0-9]{9}$/);
    if (!phonePattern.test(data.phonenumber)) {
      throw new ApiException(
        1004,
        "Số điện thoại phải 10 chữ số, bắt đầu từ số 0!"
      );
    }
    let exist = await this.Model.query().findOne({ phone: data.phonenumber });
    if (!exist) {
      throw new ApiException(9996, "User not Exist");
    }
    delete exist.password;
    return exist;
  }

  async signup() {
    const inputs = this.request.all();
    const allowFields = {
      name: "string",
      phonenumber: "string!",
      password: "string!",
      uuid: "string!",
    };
    const data = this.validate(inputs, allowFields);
    var phonePattern = new RegExp(/^0[0-9]{9}$/);
    if (!phonePattern.test(data.phonenumber)) {
      throw new ApiException(
        1004,
        "Số điện thoại phải 10 chữ số, bắt đầu từ số 0!"
      );
    }
    if (data.password.length > 10 || data.password.length < 6) {
      throw new ApiException(1004, "Mật khẩu phải có 6 đến 10 kỹ tự!");
    }
    if (data.password === data.phonenumber) {
      throw new ApiException(
        1004,
        "Mật khẩu không được trùng với số diện thoại!"
      );
    }
    let exist = await this.Model.query().findOne({ phone: data.phonenumber });
    if (exist) {
      throw new ApiException(9996, "User Exist");
    }

    const password = await this.Model.hash(data.password);

    let result = await this.Model.query().insert({
      phone: data.phonenumber,
      password: password,
      name: data.name || "new member",
    });
    delete result.password;
    return {};
  }

  async login() {
    const inputs = this.request.all();
    const allowFields = {
      phonenumber: "string!",
      password: "string!",
    };

    const data = this.validate(inputs, allowFields);
    var phonePattern = new RegExp(/^0[0-9]{9}$/);
    if (!phonePattern.test(data.phonenumber)) {
      throw new ApiException(
        1004,
        "Số điện thoại phải 10 chữ số, bắt đầu từ số 0!"
      );
    }
    if (data.password.length > 10 || data.password.length < 6) {
      throw new ApiException(1004, "Mật khẩu phải có 6 đến 10 kỹ tự!");
    }
    if (data.password === data.phonenumber) {
      throw new ApiException(
        1004,
        "Mật khẩu không được trùng với số diện thoại!"
      );
    }
    let user = await this.Model.checkLogin({
      phonenumber: data.phonenumber,
      password: data.password,
    });
    if (!user) {
      throw new ApiException(1004, "Can not login");
    }
    let token = Auth.generateJWT(
      {
        id: user.id,
        phonenumber: user.phone,
        username: user.username,
        avatar: user.avatar,
      },
      {
        key: authConfig["SECRET_KEY"],
        expiresIn: authConfig["JWT_EXPIRE"],
      }
    );

    this.response.success({
      id: user.id + "",
      username: user.username,
      // phonenumber: user.phone,
      token,
      avatar: user.avatar,
      active: !user.avatar && !user.name ? "-1" : "1",
    });
  }

  async changeInfoAfterSignup() {
    let inputs = this.request.all();
    let urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm;
    const allowFields = {
      username: "string!",
    };
    let data = this.validate(inputs, allowFields, {
      removeNotAllow: true,
    });
    let auth = this.request.auth;
     // trường hợp block
     if(data.username.length > 50) {
      await this.Model.query().patchAndFetchById(auth.id, {activeStatus: 2});
      return {
        is_blocked: "1",
      }
    }
    if (/[`~,.<>;@%$#*!':"/[\]|{}()=_+-]/.test(data.username)) {
      throw new ApiException(1004, "Không được chứa ký hiệu đặc biệt");
    }
    if (urlRegex.test(data.username)) {
      throw new ApiException(1004, "Không được sử dụng tên miền");
    }
    if (data.username.length < 6 || data.username.length > 16) {
      throw new ApiException(1004, "Quá ngắn hoặc quá dài");
    }
   
    let existUsername = await this.Model.query()
      .whereNot("id", auth.id)
      .findOne({ username: data.username });
    if (existUsername) {
      throw new ApiException(9995, "username is existed");
    }

    const { files } = this.request;
    const user = await this.Model.query().findById(auth.id);

    if (!user) {
      throw new ApiException(9998, "username is existed");
    }
    if (user.phone === data.username) {
      throw new ApiException(1004, "Không được trùng với sdt");
    }
    await this.Model.query().patchAndFetchById(auth.id, data);
    let avatarName = "";
    if (files) {
      avatarName = this.insertImage(files.avatar);
      await this.Model.query().patchAndFetchById(auth.id, {
        avatar: `/static/data/images/${avatarName}`,
      });
    }

    return {
      id: auth.id,
      username: data.username,
      avatar: `/static/data/images/${avatarName}`,
      created: moment().valueOf(),
      phonenumber: user.phone,
      online: "1",
      is_blocked: "0",
    };
  }

  async checkVerifyCode() {
    let inputs = this.request.all();

    const allowFields = {
      phonenumber: "string!",
      code_verify: "string!",
    };

    let data = this.validate(inputs, allowFields, {
      removeNotAllow: true,
    });
    var phonePattern = new RegExp(/^0[0-9]{9}$/);
    if (!phonePattern.test(data.phonenumber)) {
      throw new ApiException(
        1004,
        "Số điện thoại phải 10 chữ số, bắt đầu từ số 0!"
      );
    }
    let exist = await this.Model.query().findOne({
      phone: data.phonenumber,
      code_verify: data.code_verify,
    });
    if (!exist) {
      throw new ApiException(1004, "User is not validated");
    }
    if (exist.is_verify === 1) {
      throw new ApiException(1004, "User was validated!");
    }
    await this.Model.query().patchAndFetchById(exist.id, { is_verify: 1 });
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
      id: exist.id,
      token,
      active: exist.activeStatus,
    };
  }

  async getVerifyCode() {
    let inputs = this.request.all();
    const allowFields = {
      phonenumber: "string!",
    };
    let data = this.validate(inputs, allowFields, {
      removeNotAllow: true,
    });
    var phonePattern = new RegExp(/^0[0-9]{9}$/);

    if (!phonePattern.test(data.phonenumber)) {
      throw new ApiException(
        1004,
        "Số điện thoại phải 10 chữ số, bắt đầu từ số 0!"
      );
    }
    let exist = await this.Model.query().findOne({ phone: data.phonenumber });
    if (!exist) {
      throw new ApiException(1004, "Số điện thoại chưa được đăng ký!");
    }
    if (exist.is_verify === 1) {
      throw new ApiException(1004, "Số điện thoại đã được đăng ký!");
    }
    // call 120s liên tục thì không chấp nhận
    let validTime = moment().subtract(120, "seconds");
    if (exist.last_verify_at) {
      if (validTime < moment(exist.last_verify_at)) {
        throw new ApiException(
          1010,
          "Hành động này đã được thực hiện trước đây!"
        );
      }
    }
    // nấu tồn tại code trước đó thì trả về luôn
    if (exist.code_verify) {
      return exist.code_verify;
    }
    let randomCode = random.int(100000, 999999);
    while (true) {
      let existCode = await this.Model.query().findOne({
        code_verify: randomCode,
      });
      if (!existCode) {
        await this.Model.query().patchAndFetchById(exist.id, {
          code_verify: randomCode,
          last_verify_at: new Date(),
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
      new_password: "string!",
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
    if (user.phone === data.new_password) {
      throw new ApiException(1004, "Mật khẩu k được trùng sdt!");
    }
    let isValidOldPassword = await Model.compare(data.password, user.password);
    if (!isValidOldPassword) {
      throw new ApiException(1004, "Mật khẩu cũ không chính xác!");
    }
    if (data.password === data.new_password) {
      throw new ApiException(1004, "Mật khẩu mới phải khác mật khẩu cũ!");
    }
    if (data.new_password.length > 10 || data.new_password.length < 6) {
      throw new ApiException(1004, "Mật khẩu phải có 6 đến 10 kỹ tự!");
    }
    var similarity = stringSimilarity.compareTwoStrings(
      data.password,
      data.new_password
    );
    if (similarity > 0.8) {
      throw new ApiException(
        1004,
        "Mật khẩu mới của bạn khá tương đồng với mật khẩu cũ, vui lòng chọn mật khẩu khác!"
      );
    }
    let result = await user.changePassword(data["new_password"]);
    delete result["password"];
    return result;
  }

  async setUserInfo() {
    let inputs = this.request.all();

    const allowFields = {
      token: "string!",
      username: "string",
      description: "string",
      address: "string",
      city: "string",
      country: "string",
      link: "string",
    };
    let data = this.validate(inputs, allowFields, {
      removeNotAllow: true,
    });
    let auth = this.request.auth;
    let user = await this.Model.query().findById(auth.id);

    if (!user) {
      throw new ApiException(9995, "User is not validated");
    }
    let existUsername = await this.Model.query()
      .whereNot("id", auth.id)
      .findOne({ username: data.username });
    if (existUsername) {
      throw new ApiException(9995, "Username is existed");
    }

    const { files } = this.request;
    const insertFiles = this.writeUserInfoFile(files);
    let updateInfo = { ...data, ...insertFiles };
    delete updateInfo["token"];
    updateInfo.updatedAt = new Date();
    let result = await user.updateInfo(updateInfo);
    delete result["password"];
    return result;
  }

  writeUserInfoFile(files) {
    let insertFiles = {};
    if (files) {
      if (files.avatar) {
        let avatarName = this.insertImage(files.avatar);
        insertFiles["avatar"] = `/static/data/images/${avatarName}`;
      }
      if (files.cover_image) {
        let coverImageName = this.insertImage(files.cover_image);
        insertFiles["cover_image"] = `/static/data/images/${coverImageName}`;
      }
    }
    return insertFiles;
  }

  async getInfo() {
    const inputs = this.request.all();
    const allowFields = {
      token: "string!",
      user_id: "string",
    };
    const data = this.validate(inputs, allowFields);
    const auth = this.request.auth;
    const id = !data.user_id ? auth.id : data.user_id;
    const user = await this.Model.getInfo(id);
    if (!user) {
      throw new ApiException(9995, "User is not validated");
    }
    const numberFriends = (await this.FriendshipModel.getUserFriends(id))
      .length;
    this.response.success({
      id: user.id,
      username: user.name,
      created: new Date(user.createdAt).getTime(),
      description: user.description,
      avatar: user.avatar,
      cover_image: user.cover_image,
      link: user.link,
      address: user.address,
      city: user.city,
      country: user.country,
      listing: numberFriends, // so luong ban be ,
      is_friend:
        id == auth.id
          ? "1"
          : (await this.FriendshipModel.isFriend(data.user_id, auth.id))
          ? "1"
          : "0",
      online: "1",
    });
  }

  // For development
  async getAllUsers() {
    this.response.success({
      users: await this.Model.query(),
    });
  }
}
