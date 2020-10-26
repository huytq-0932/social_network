import BaseModel from './BaseModel'
const bcrypt = require("bcrypt")
const authConfig = require("@config/auth")

class UserModel extends BaseModel {
    static tableName = "users"

    //fields
    id: number;
    username: string;
    password: string;
    phone: string;
    avatar: string;

    static async checkLogin({ username, password }) {
        const user = await this.query().findOne({ username: username });
        if (!user) return false;

        //await this.changePassword(user.id, "123456@")
        let checkPassword = await this.compare(password, user.password);
        delete user.password;
        if (checkPassword) return user;
        return false;
    }

    static async hash(plainPassword) {
        return await bcrypt.hash(plainPassword + authConfig.SECRET_KEY, 10)
    }

    static async compare(plainPassword, encryptedPassword) {
        return await bcrypt.compare(plainPassword + authConfig.SECRET_KEY, encryptedPassword)
    }
    async changePassword(newPassword) {
        newPassword = await UserModel.hash(newPassword)
        return await this.$query().patchAndFetchById(this.id, {
            password: newPassword
        })
    }
}

export default UserModel