"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseModel_1 = __importDefault(require("./BaseModel"));
const bcrypt = require("bcrypt");
const authConfig = require("@config/auth");
class UserModel extends BaseModel_1.default {
}
UserModel.tableName = "admin_groups";
exports.default = UserModel;
