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
const BaseController_1 = __importDefault(require("./BaseController"));
const UserModel_1 = __importDefault(require("@root/server/app/Models/UserModel"));
const ApiException_1 = __importDefault(require("@app/Exceptions/ApiException"));
const Auth_1 = __importDefault(require("@libs/Auth"));
const auth_1 = __importDefault(require("@config/auth"));
class Controller extends BaseController_1.default {
    constructor() {
        super(...arguments);
        this.Model = UserModel_1.default;
    }
    login() {
        return __awaiter(this, void 0, void 0, function* () {
            const inputs = this.request.all();
            const allowFields = {
                username: "string!",
                password: "string!"
            };
            const data = this.validate(inputs, allowFields);
            let user = yield this.Model.checkLogin({
                username: data.username,
                password: data.password
            });
            if (!user) {
                throw new ApiException_1.default(7000, "Can not login");
            }
            let token = Auth_1.default.generateJWT({
                id: user.id,
                username: user.username,
                roles: user.role
            }, {
                key: auth_1.default['SECRET_KEY_ADMIN'],
                expiresIn: auth_1.default['JWT_EXPIRE_ADMIN']
            });
            this.response.success({
                token,
                user: Object.assign({}, user)
            });
        });
    }
    updateMyPassword() {
        return __awaiter(this, void 0, void 0, function* () {
            let inputs = this.request.all();
            const allowFields = {
                password: "string!"
            };
            let data = this.validate(inputs, allowFields, {
                removeNotAllow: true
            });
            const auth = this.request.auth || {};
            const id = auth.id;
            let user = yield this.Model.query().findById(id);
            if (!user) {
                throw new ApiException_1.default(7002, "Tài khoản không tồn tại!");
            }
            let result = yield user.changePassword(data['password']);
            delete result['password'];
            return result;
        });
    }
}
exports.default = Controller;
