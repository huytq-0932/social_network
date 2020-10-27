import BaseController from './BaseController'
import Model from '@root/server/app/Models/UserModel'
import ApiException from '@app/Exceptions/ApiException'
import Auth from '@libs/Auth'
import authConfig from '@config/auth'

export default class Controller extends BaseController {
    Model = Model
    async signup(){
        const inputs = this.request.all();
        const allowFields = {
            name: "string",
            phonenumber: "string!",
            password: "string!",
            uuid: "string!",
        }
        const data = this.validate(inputs, allowFields);
        let exist = await this.Model.query().findOne({phone: data.phonenumber});
        if(exist){
            throw new ApiException(9996, "User Exist");
        }
        data.password = this.Model.hash(data.password);
        
        let result = await this.Model.query().insert({
            phone: data.phone,
            password: data.password,
            name: data.name || "new member"
        });
        delete result.password;
        return result;
    }
    async login() {
        const inputs = this.request.all();
        const allowFields = {
            phonenumber: "string!",
            password: "string!"
        }

        const data = this.validate(inputs, allowFields);
        let user = await this.Model.checkLogin({
            phonenumber: data.phonenumber,
            password: data.password
        })
        if (!user) {
            throw new ApiException(7000, "Can not login")
        }
        let token = Auth.generateJWT({
            id: user.id,
            phonenumber: user.phone
        }, {
            key: authConfig['SECRET_KEY_ADMIN'],
            expiresIn: authConfig['JWT_EXPIRE_ADMIN']
        });

        this.response.success({
            id: user.id,
            username: user.name,
            token,
            avatar: user.avatar,
            active: (!user.avatar && !user.name) ? -1 : 1
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
            throw new ApiException(9995, "User is not validated")
        }

        let result = await user.changePassword(data['password'])
        delete result['password']
        return result
    }

    async getInfo() {
        const inputs = this.request.all();
        const allowFields = {
            token: "string!",
            user_id: "string"
        }
        const data = this.validate(inputs, allowFields);
        try {
            const decodedToken = await Auth.decodeJWT(data.token, {
                key: authConfig['SECRET_KEY_ADMIN'],
                expiresIn: authConfig['JWT_EXPIRE_ADMIN']
            })
            const id = !data.user_id ? decodedToken.id : data.user_id
            const user = await this.Model.getInfo(id)
            if (!user) {
                throw new ApiException(9995, "User is not validated")
            }
            this.response.success(user)
        } catch (e) {
            throw new ApiException(9998, "Token is invalid")
        }
    }
}
