const NextI18Next = require('next-i18next').default

const localeSubpathVariations = {
    none: {},
    foreign: {
        de: 'de',
    },
    all: {
        en: 'en',
        de: 'de',
    },
}

export default new NextI18Next({
    defaultNS: 'common',
    defaultLanguage: 'vi',
    otherLanguages: ['en'],
    serverLanguageDetection: false,
    browserLanguageDetection: false,
    shallowRender: true
})