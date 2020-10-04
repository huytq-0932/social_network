import BaseController from './BaseController'
import Model from '@app/Models/AdminGroupModel'
import ApiException from '@app/Exceptions/ApiException'
import Auth from '@libs/Auth'
import authConfig from '@config/auth'

export default class Controller extends BaseController {
    Model = Model

}