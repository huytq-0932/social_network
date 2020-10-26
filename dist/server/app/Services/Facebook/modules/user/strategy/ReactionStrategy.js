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
const helper_1 = __importDefault(require("../../helper"));
const randomItem = require('random-item');
class ReactionStrategy extends BaseStrategy_1.default {
    constructor({ groupId, type, postId }) {
        super();
        this.groupId = groupId;
        this.postId = postId;
        this.type = type;
    }
    assignGroupIdIfNull() {
        this.groupId = this.groupId || (helper_1.default.randomRange(1, 9999999999) + "");
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            this.assignGroupIdIfNull();
            this.request.setReferrer(`${this.request.BASEURL}/story.php?story_fbid=${this.postId}&id=${this.groupId}`);
            let response = yield this.request.get(`${this.request.BASEURL}/reactions/picker/?ft_id=${this.postId}`);
            let responseText = yield response.text();
            let $ = cheerio.load(responseText);
            if (!this.type) {
                this.type = randomItem([1, 2, 16]);
            }
            const url = helper_1.default.getLinks($, `reaction_type=${this.type}`);
            if (url.length > 0) {
                response = yield this.request.get(`${this.request.BASEURL}/${url[0]}`);
                return response.ok ? 1 : 0;
            }
            return 0;
        });
    }
}
exports.default = ReactionStrategy;
