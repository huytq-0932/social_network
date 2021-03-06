import BaseModel from "./BaseModel";

const bcrypt = require("bcrypt");
const authConfig = require("@config/auth");

class UserModel extends BaseModel {
  static tableName = "users";

  //fields
  id: number;
  name: string;
  createdAt: string;
  description: string;
  address: string;
  username: string;
  password: string;
  avatar: string;
  cover_image: string;
  link: string;
  city: string;
  country: string;
  phone: string;
  code_verify: string;
  is_verify: number;
  last_verify_at: Date;
  activeStatus: number;

  static async checkLogin({phonenumber, password}) {
    const user = await this.query().findOne({phone: phonenumber});
    if (!user) return false;

    //await this.changePassword(user.id, "123456@")
    let checkPassword = await this.compare(password, user.password);
    delete user.password;
    if (checkPassword) return user;
    return false;
  }

  static async hash(plainPassword) {
    return await bcrypt.hash(plainPassword + authConfig.SECRET_KEY, 10);
  }

  static async compare(plainPassword, encryptedPassword) {
    return await bcrypt.compare(plainPassword + authConfig.SECRET_KEY, encryptedPassword);
  }

  async changePassword(newPassword) {
    newPassword = await UserModel.hash(newPassword);
    return this.$query().patchAndFetchById(this.id, {
      password: newPassword
    });
  }

  async updateInfo(info) {
    return this.$query().patchAndFetchById(this.id, info);
  }

  async isBlocked() {
    return (await this.$query().findOne({id: this.id})).activeStatus == 0
  }

  static async getInfo(id) {
    const user = await this.query().findOne({id: id});
    if (!user) return false;
    delete user.password;
    return user;
  }
}

export default UserModel;
