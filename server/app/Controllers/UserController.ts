import BaseController from './BaseController'
import Model from '@app/Models/AdminModel'
import ApiException from '@app/Exceptions/ApiException'
import Auth from '@libs/Auth'
import authConfig from '@config/auth'

export default class Controller extends BaseController {
    Model = Model

    async login() {
        const inputs = this.request.all();
        const allowFields = {
            username: "string!",
            password: "string!"
        }

        const data = this.validate(inputs, allowFields);
        let user = await this.Model.checkLogin({
            username: data.username,
            password: data.password
        })
        if (!user) {
            throw new ApiException(7000, "Can not login")
        }
        let token = Auth.generateJWT({
            id: user.id,
            username: user.username,
            roles: user.role
        }, {
            key: authConfig['SECRET_KEY_ADMIN'],
            expiresIn: authConfig['JWT_EXPIRE_ADMIN']
        });

        this.response.success({
            token,
            user: {
                ...user
            }
        })
    }

    async updateMyPassword() {
        let inputs = this.request.all()
    
        const allowFields = {
          password: "string!"
        }
        let data = this.validate(inputs, allowFields, {
          removeNotAllow: true
        });
        const auth = this.request.auth || {};
        const id = auth.id;
        let user = await this.Model.query().findById(id);
    
        if (!user) {
          throw new ApiException(7002, "Tài khoản không tồn tại!")
        }
        
        
        let result = await user.changePassword(data['password'])
        delete result['password']
        return result
      }
}