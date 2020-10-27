import to from 'await-to-js'
import BaseMiddleware from './BaseMiddleware'
import Auth from '@libs/Auth'
import authConfig from '@config/auth'
const Cookies = require('universal-cookie')

class AuthApiMiddleware extends BaseMiddleware {
    cookies: any
    constructor(request, response, next) {
        super(request, response, next);
        let token = this.getBearerTokenFromHeader(request)
        this.cookies = new Cookies(token);
        this.checkToken().then(res => {
            if (res.error) return response.status(401).json({ error: res.error })
            next();
        }).catch(err => {
            console.log(err)
            return response.status(401).json({ error: err })
        })
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
        } else {
            return { error: 'Missing token type ' + BEARER };
        }
        return { token: token.trim() };
    }

    async checkToken() {
        let token = this.cookies.get('token')
        let [error, result]: [any, any] = await to(Auth.verify(token, {
            key: authConfig['SECRET_KEY']
        }));
        if (error) return { error: error.message };
        /* if(result.type !== "admin"){
          return this.response.error(403, "not access")
        } */
        if (result.exp - Date.now() / 1000 < authConfig['JWT_REFRESH_TIME']) {
            let newToken = Auth.generateJWT({
                _id: result.id,
                username: result.username,
                roles: result.roles,
                permissions: result.permissions,
                type: result.type
            }, {
                key: authConfig['SECRET_KEY'],
                expiresIn: authConfig['JWT_EXPIRE']
            });
            this.response.set('Access-Control-Expose-Headers', 'access-token')
            this.response.set('access-token', newToken);
        }
        this.request.auth = this.makeAuthObject(result);
        return { token };
    }

    makeAuthObject(tokenData) {
        return {
            ...tokenData
        }
    }
}

module.exports = AuthApiMiddleware.export();
