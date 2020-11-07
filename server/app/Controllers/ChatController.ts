import BaseController from "./BaseController";
import Model from "@root/server/app/Models/ChatModel";
const random = require('random')

export default class Controller extends BaseController {
  Model = Model;
}
