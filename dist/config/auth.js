"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    SECRET_KEY: process.env.SECRET_KEY || "2wsjLSopTjD6WQEztTYIZgCFou8wpLJn",
    SECRET_KEY_ADMIN: process.env.SECRET_KEY || "4wsjLSopTjD6WQEztTYIZgCFou8wpLJn",
    JWT_SMS_KEY: process.env.SECRET_KEY || "3wsjLSopTjD6WQEztQYIZgCFou8wpLJl",
    PASSWORD_DEFAULT: '123456',
    JWT_EXPIRE_USER: 86400,
    JWT_REFRESH_TIME: 86400,
    JWT_EXPIRE_ADMIN: 86400,
};
