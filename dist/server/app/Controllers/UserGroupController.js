"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseController_1 = __importDefault(require("./BaseController"));
const UserGroupModel_1 = __importDefault(require("@root/server/app/Models/UserGroupModel"));
class Controller extends BaseController_1.default {
    constructor() {
        super(...arguments);
        this.Model = UserGroupModel_1.default;
    }
}
exports.default = Controller;
