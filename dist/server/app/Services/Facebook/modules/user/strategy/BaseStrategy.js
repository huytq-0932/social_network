"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = __importDefault(require("../../request"));
class BaseStrategy {
    constructor() {
        this.request = new request_1.default();
    }
    setProxy(proxy) {
        this.proxy = proxy;
    }
    setCookie(cookie) {
        this.request.setCookie(cookie);
    }
    setUserAgent(userAgent) {
        this.request.setUserAgent(userAgent);
    }
}
exports.default = BaseStrategy;
