"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Routes_1 = __importDefault(require("@core/Routes"));
const ExtendMiddleware = require("@app/Middlewares/ExtendMiddleware");
const AuthApiMiddleware = require('@app/Middlewares/AuthApiMiddleware');
const { permission, permissionResource, permissionMethod } = require('@app/Middlewares/PermissionMiddleware');
Routes_1.default.group(() => {
    Routes_1.default.post("/login", "AdminController.login").name('login');
    Routes_1.default.group(() => {
        Routes_1.default.resource("/users", "UserController").name('users');
    }).middleware([AuthApiMiddleware]);
}).middleware([ExtendMiddleware]).name('api');
