"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseMiddleware {
    constructor(request, response, next) {
        this.request = request;
        this.response = response;
        this.next = next;
    }
    static export() {
        return (...params) => new (this)(...params);
    }
}
exports.default = BaseMiddleware;
