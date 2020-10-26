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
const node_fetch_1 = __importDefault(require("node-fetch"));
const tough = require("tough-cookie");
const Cookie = tough.Cookie;
class Request {
    constructor() {
        this.headers = {
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36",
            accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "same-origin",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
        };
        this.cookie = new tough.CookieJar();
        this.BASEURL = "https://mbasic.facebook.com";
    }
    setUserAgent(userAgent) {
        if (!userAgent)
            return;
        this.headers["User-Agent"] = userAgent;
    }
    setCookie(cookieString, url) {
        if (!cookieString)
            return;
        let cookies = cookieString.split(";");
        for (let c of cookies) {
            if (!c.trim()) {
                continue;
            }
            this.cookie.setCookieSync(c.trim(), this.BASEURL);
        }
    }
    setReferrer(referrer) {
        this.headers["referrer"] = referrer;
    }
    getHeaders() {
        let header = Object.assign(Object.assign(Object.assign({}, this.headers), { cookie: this.cookie.getCookieStringSync(this.BASEURL) }), this.tmpHeader);
        this.tmpHeader = {};
        return header;
    }
    setTempHeader(headers) {
        this.tmpHeader = headers;
    }
    request({ url, method = "GET", body, }) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield node_fetch_1.default(url, {
                method: method,
                headers: this.getHeaders(),
                body: body,
                referrerPolicy: "origin-when-cross-origin",
                mode: "cors",
                credentials: "include"
            });
            let cookies = result.headers.raw()["set-cookie"];
            // console.log("cookies", cookies)
            // if (cookies) cookies.map((c) => { this.cookie.addCookie(c) })
            return result;
        });
    }
    get(url) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request({
                url,
            });
        });
    }
    post(url, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request({
                url,
                body: data,
                method: "POST",
            });
        });
    }
}
exports.default = Request;
