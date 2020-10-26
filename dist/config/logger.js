"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rootDir = process.cwd();
const config = {
    MAXSIZE: '100m',
    MAXFILES: '30d',
    DATE_PATTERN: 'YYYY-MM-DD',
    DIRNAME: `${rootDir}/logs/`
};
exports.default = config;
