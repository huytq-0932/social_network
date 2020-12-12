import to from 'await-to-js'
import BaseMiddleware from './BaseMiddleware'
import UserModel from "@root/server/app/Models/UserModel";
import Auth from '@libs/Auth'
import authConfig from '@config/auth'
const Cookies = require('universal-cookie')

class AuthApiMiddleware extends BaseMiddleware {
    cookies: any
    UserModel = UserModel
    constructor(request, response, next) {
        super(request, response, next);
        this.checkToken().then(res => {
            if (res.error) return response.status(401).json({ error: res.error })
            next();
        }).catch(err => {
            console.log(err)
            return response.status(401).json({ error: err })
        })
    }

    async checkToken() {
        let inputs = this.request.all() || {};
        let token = inputs.token;
        let auth = await Auth.verify(token, {
            key: authConfig['SECRET_KEY']
        });
        if (!auth) return { error: "token is invalid", code: 9998 };
        let userId = auth.id;
        let user = await this.UserModel.query().findById(userId);
        if(!user){
            return { error: "token is invalid", code: 9998 };
        }
        if(user.activeStatus == 2){
            return { error: "tài khoản đã bị khóa", code: 9998 };
        }
        

        this.request.auth = auth;
        return { token };
    }

    makeAuthObject(tokenData) {
        return {
            ...tokenData
        }
    }
}

module.exports = AuthApiMiddleware.export();
