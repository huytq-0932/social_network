"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require('lodash');
//const messageConfig = require('@config/message')
class ExceptionHandler {
    /**
     *
     * @param {httpCode, code, message, data} error
     * @param request
     * @param response
     */
    handle(error, { request, response }) {
        return __awaiter(this, void 0, void 0, function* () {
            let code = 500, message = "", data = {}, httpCode = 200;
            if (typeof error !== "object") {
                error = new Error(error);
            }
            code = Number(error.code) || 500;
            message = error.message || "";
            data = error.data || error.stack || {};
            httpCode = error.httpCode || 200;
            console.log("ERROR:", error);
            const exceptionName = error.constructor.name;
            //message = this.makeMessage({code, message, data, extendCode})
            response.status(httpCode).send({
                code,
                message,
                data
            });
        });
    }
}
exports.default = ExceptionHandler;
