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
    let token = this.getBearerTokenFromHeader(request)
    this.cookies = new Cookies(token);
    this.checkToken().then(res => {
      if (res.error) return response.status(401).json({code: 9998, error: res.error})
      next();
    }).catch(err => {
      console.log(err)
      return response.status(401).json({code: 9998, error: err})
    })
  }

  getBearerTokenFromHeader(req) {
    if (!req.headers.authorization) {
      return {error: 'Missing access token'};
    }
    const BEARER = 'Bearer';
    let token = req.headers.authorization.trim();
    if (!token || token.length == 0) {
      return {error: 'Missing access token'};
    }
    let index = token.indexOf(BEARER);
    if (index == 0) {
      token = token.substring(BEARER.length, token.length);
    } else {
      return {error: 'Missing token type ' + BEARER};
    }
    return {token: token.trim()};
  }

  async checkToken() {
    let inputs = this.request.all() || {};
    let token = inputs.token;
    let auth = await Auth.verify(token, {
      key: authConfig['SECRET_KEY']
    });
    if (!auth) return {error: "Token is invalid", code: 9998};
    let userId = auth.id;
    let user = await this.UserModel.query().findById(userId);
    if (!user) {
      return {error: "Token is invalid", code: 9998};
    }
    if (user.activeStatus == 2) {
      return {error: "tài khoản đã bị khóa", code: 9998};
    }

    console.log("auth ", auth);
    this.request.auth = auth;
    return {token};
  }

  makeAuthObject(tokenData) {
    return {
      ...tokenData
    }
  }
}

module.exports = AuthApiMiddleware.export();
