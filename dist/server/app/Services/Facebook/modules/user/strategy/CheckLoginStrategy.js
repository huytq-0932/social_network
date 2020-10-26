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
const BaseStrategy_1 = __importDefault(require("./BaseStrategy"));
const cheerio = require('cherio');
class CheckLoginStrategy extends BaseStrategy_1.default {
    constructor() {
        super();
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            this.request.setReferrer(this.request.BASEURL);
            let response = yield this.request.get(this.request.BASEURL);
            //if (!response.ok) throw new Error(response.statusText)
            const responseText = yield response.text();
            const $ = cheerio.load(responseText);
            return $("textarea").length;
        });
    }
}
exports.default = CheckLoginStrategy;
