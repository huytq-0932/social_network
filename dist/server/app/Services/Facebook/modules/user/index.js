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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Action_1 = __importDefault(require("./Action"));
const strategy_1 = require("@app/Services/Facebook/modules/user/strategy");
class User {
    constructor({ cookie, proxy, userAgent }) {
        this.action = new Action_1.default({ cookie, proxy, userAgent });
    }
    checkLogin() {
        return __awaiter(this, void 0, void 0, function* () {
            this.action.setActionStrategy(new strategy_1.CheckLoginStrategy());
            return yield this.action.run();
        });
    }
    comment({ postId, content, groupId }) {
        return __awaiter(this, void 0, void 0, function* () {
            this.action.setActionStrategy(new strategy_1.CommentStrategy({ postId, content, groupId }));
            return yield this.action.run();
        });
    }
    reaction({ postId, groupId }) {
        return __awaiter(this, void 0, void 0, function* () {
            this.action.setActionStrategy(new strategy_1.ReactionStrategy({ postId }));
            return yield this.action.run();
        });
    }
}
exports.default = User;
