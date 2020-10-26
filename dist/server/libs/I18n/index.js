"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NextI18Next = require('next-i18next').default;
const localeSubpathVariations = {
    none: {},
    foreign: {
        de: 'de',
    },
    all: {
        en: 'en',
        de: 'de',
    },
};
exports.default = new NextI18Next({
    defaultNS: 'common',
    defaultLanguage: 'vi',
    otherLanguages: ['en'],
    serverLanguageDetection: false,
    browserLanguageDetection: false,
    shallowRender: true
});
