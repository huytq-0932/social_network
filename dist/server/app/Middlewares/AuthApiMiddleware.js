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
const await_to_js_1 = __importDefault(require("await-to-js"));
const BaseMiddleware_1 = __importDefault(require("./BaseMiddleware"));
const Auth_1 = __importDefault(require("@libs/Auth"));
const auth_1 = __importDefault(require("@config/auth"));
const Cookies = require('universal-cookie');
class AuthApiMiddleware extends BaseMiddleware_1.default {
    constructor(request, response, next) {
        super(request, response, next);
        let token = this.getBearerTokenFromHeader(request);
        this.cookies = new Cookies(token);
        this.checkToken().then(res => {
            if (res.error)
                return response.status(401).json({ error: res.error });
            next();
        }).catch(err => {
            console.log(err);
            return response.status(401).json({ error: err });
        });
    }
    getBearerTokenFromHeader(req) {
        if (!req.headers.authorization) {
            return { error: 'Missing access token' };
        }
        const BEARER = 'Bearer';
        let token = req.headers.authorization.trim();
        if (!token || token.length == 0) {
            return { error: 'Missing access token' };
        }
        let index = token.indexOf(BEARER);
        if (index == 0) {
            token = token.substring(BEARER.length, token.length);
        }
        else {
            return { error: 'Missing token type ' + BEARER };
        }
        return { token: token.trim() };
    }
    checkToken() {
        return __awaiter(this, void 0, void 0, function* () {
            let token = this.cookies.get('token');
            let [error, result] = yield await_to_js_1.default(Auth_1.default.verify(token, {
                key: auth_1.default['SECRET_KEY_ADMIN']
            }));
            if (error)
                return { error: error.message };
            /* if(result.type !== "admin"){
              return this.response.error(403, "not access")
            } */
            if (result.exp - Date.now() / 1000 < auth_1.default['JWT_REFRESH_TIME']) {
                let newToken = Auth_1.default.generateJWT({
                    _id: result.id,
                    username: result.username,
                    roles: result.roles,
                    permissions: result.permissions,
                    type: result.type
                }, {
                    key: auth_1.default['SECRET_KEY_ADMIN'],
                    expiresIn: auth_1.default['JWT_EXPIRE_ADMIN']
                });
                this.response.set('Access-Control-Expose-Headers', 'access-token');
                this.response.set('access-token', newToken);
            }
            this.request.auth = this.makeAuthObject(result);
            return { token };
        });
    }
    makeAuthObject(tokenData) {
        return Object.assign({}, tokenData);
    }
}
module.exports = AuthApiMiddleware.export();
