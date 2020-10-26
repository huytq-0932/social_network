"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Routes_1 = __importDefault(require("@core/Routes"));
//const AuthMiddleware = require("@app/Middleware/AuthMiddleware");
//const ExtendMiddleware = require("@app/Middleware/ExtendMiddleware");
/**
 * Route:
 * Function:
 *    Method: get, post, put, delete, resource
 *    Route.<method>(path, Action).middleware([middleware1, middleware2])
 *    Ex: Route.get("/user", "UserController.index").middleware([auth])
 *    Route.resource("/user", "UserController")
 *
 *    Route.group(() =>{...}).prefix(path).middleware([middleware1, middleware2])
 *    Ex: Route.group(() =>{
 *        Route.get("/user", "UserController.index")
 *        Route.group("/user", "UserController.index")
 *        require("./setting") //load all router in ./setting.js
 *    }).prefix("/api/v1").middleware([auth])
 */
Routes_1.default.group(() => {
    require("@root/server/routes");
}).prefix("/api/v1");
require("./admin");
Routes_1.default.router.use("/", require("express").static('@root/../public'));
