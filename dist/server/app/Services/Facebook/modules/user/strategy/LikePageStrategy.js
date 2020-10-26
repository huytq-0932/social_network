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
const cheerio = require("cherio");
class LikePageStrategy extends BaseStrategy_1.default {
    constructor({ pageId }) {
        super();
        this.pageId = pageId;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            this.request.setReferrer(`${this.request.BASEURL}/`);
            this.pageId = encodeURI(this.pageId);
            let response = yield this.request.get(`${this.request.BASEURL}/${this.pageId}`);
            let responseText = yield response.text();
            let $ = cheerio.load(responseText);
            let aTag = $('a[href*="/a/profile.php?fan"]').first();
            if (aTag) {
                let href = aTag.attr("href");
                this.request.setReferrer(`${this.request.BASEURL}/pages/more/${this.pageId}/`);
                let response = yield this.request.get(`${this.request.BASEURL}/${href}`);
                return response.ok ? 1 : 0;
            }
            return 0;
        });
    }
}
exports.default = LikePageStrategy;
