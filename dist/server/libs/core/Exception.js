"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Handler_1 = __importDefault(require("@app/Exceptions/Handler"));
class Exception {
    constructor(code, message, data, httpCode) {
        this.code = code;
        this.message = message;
        this.data = data;
        this.httpCode = httpCode;
    }
    static handle(error, request, response) {
        this.request = request;
        this.response = response;
        if (typeof error == "string") {
            error = {
                code: 500,
                message: error
            };
        }
        error.code = error.code || 500;
        error.message = error.message || "";
        error.httpCode = error.httpCode || 500;
        error.data = error.data || error.stack || {};
        let ExceptionHandler = new Handler_1.default();
        ExceptionHandler.handle(error, { request, response });
        //response.error(status, message, data)
    }
}
exports.default = Exception;
