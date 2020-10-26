"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Exception_1 = __importDefault(require("@core/Exception"));
class ApiException extends Exception_1.default {
    constructor(code = "", message = "", data) {
        super(code, message, data, 400);
    }
}
exports.default = ApiException;
