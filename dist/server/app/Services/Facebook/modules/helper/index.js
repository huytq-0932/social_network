"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Helper {
    static getLinks(cherioDom, keyword) {
        let aElements = cherioDom(`a`);
        let urls = [];
        for (let i = 0; i < aElements.length; i++) {
            let href = cherioDom(aElements[i]).attr("href");
            if (href && href.indexOf(keyword) !== -1) {
                urls.push(href);
            }
        }
        return urls;
    }
    static randomRange(min, max) {
        return Math.round(Math.random() * (Number(max) - Number(min)) + Number(min));
    }
}
exports.default = Helper;
