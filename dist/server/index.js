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
if (!process.env.IS_TS_NODE) {
    // tslint:disable-next-line:no-var-requires
    require('module-alias/register');
}
const Server_1 = __importDefault(require("@core/Server"));
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let server = new Server_1.default();
        yield server.start();
    }
    catch (e) {
        console.error(e);
        process.exit(1);
    }
}))();
