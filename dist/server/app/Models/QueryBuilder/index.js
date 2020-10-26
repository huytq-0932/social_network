"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const objection_1 = require("objection");
const GetForGridTable_1 = __importDefault(require("./GetForGridTable"));
class ExtendQueryBuilder extends objection_1.QueryBuilder {
    getForGridTable({ sorting = [], filters = [], pageSize = 50, page = 0 } = {}) {
        return GetForGridTable_1.default(this).exec({ sorting, filters, pageSize, page });
    }
}
exports.default = ExtendQueryBuilder;
