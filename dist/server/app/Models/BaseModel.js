"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseModel_1 = __importDefault(require("@core/Databases/BaseModel"));
const QueryBuilder_1 = __importDefault(require("./QueryBuilder"));
class BaseModel extends BaseModel_1.default {
}
BaseModel.QueryBuilder = QueryBuilder_1.default;
exports.default = BaseModel;
