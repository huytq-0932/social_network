"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const objection_1 = require("objection");
const Databases_1 = __importDefault(require("@core/Databases"));
objection_1.Model.knex(Databases_1.default.connection);
exports.default = objection_1.Model;
