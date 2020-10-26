"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseModel_1 = __importDefault(require("./BaseModel"));
const bcrypt = require("bcrypt");
const authConfig = require("@config/auth");
class UserModel extends BaseModel_1.default {
    static checkLogin({ username, password }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.query().findOne({ username: username });
            if (!user)
                return false;
            //await this.changePassword(user.id, "123456@")
            let checkPassword = yield this.compare(password, user.password);
            delete user.password;
            if (checkPassword)
                return user;
            return false;
        });
    }
    static hash(plainPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcrypt.hash(plainPassword + authConfig.SECRET_KEY, 10);
        });
    }
    static compare(plainPassword, encryptedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcrypt.compare(plainPassword + authConfig.SECRET_KEY, encryptedPassword);
        });
    }
    changePassword(newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            newPassword = yield UserModel.hash(newPassword);
            return yield this.$query().patchAndFetchById(this.id, {
                password: newPassword
            });
        });
    }
}
UserModel.tableName = "admins";
exports.default = UserModel;
