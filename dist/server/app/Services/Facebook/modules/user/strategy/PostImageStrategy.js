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
const form_urlencoded_1 = __importDefault(require("form-urlencoded"));
class PostStrategy extends BaseStrategy_1.default {
    constructor({ content }) {
        super();
        this.content = content;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            this.request.setReferrer(`${this.request.BASEURL}`);
            let response = yield this.request.get(this.request.BASEURL);
            let responseText = yield response.text();
            let $ = cheerio.load(responseText);
            const form = $("#mbasic-composer-form").first();
            const action = form.attr("action");
            const inputs = $("input", form);
            let data = {};
            for (let i = 0; i < inputs.length; i++) {
                let inpName = $(inputs[i]).attr("name");
                let inpValue = $(inputs[i]).attr("value");
                if (inpValue == null || inpName == null)
                    continue;
                data[inpName] = inpValue;
            }
            data["xc_message"] = this.content;
            console.log(data, action);
            if (action) {
                this.request.setTempHeader({
                    "content-type": "application/x-www-form-urlencoded",
                });
                response = yield this.request.post(`${this.request.BASEURL}${action}`, form_urlencoded_1.default(data));
                let responseText = yield response.text();
                console.log(responseText);
                return response.ok ? 1 : 0;
            }
            return 0;
        });
    }
}
exports.default = PostStrategy;
