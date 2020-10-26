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
require('dotenv').config();
const next_1 = __importDefault(require("next"));
const express_1 = __importDefault(require("express"));
const Routes_1 = __importDefault(require("./Routes"));
const Databases_1 = __importDefault(require("@core/Databases"));
let bodyParser = require('body-parser');
const cors = require('cors');
const nextI18NextMiddleware = require('next-i18next/middleware').default;
const nextI18next = require('@libs/I18n').default;
const dev = process.env.NODE_ENV !== "production";
const nextApp = next_1.default({ dev });
let handle = nextApp.getRequestHandler();
class Server {
    constructor({ host, port, options = {} } = {}) {
        this.express = express_1.default();
        const defaultPORT = process.env.MODE == "dev-client" ? process.env.DEV_FRONTEND_PORT : process.env.PORT;
        this.host = host || process.env.HOST || '0.0.0.0';
        this.port = Number(port) || Number(defaultPORT) || 3333;
        this.options = options;
    }
    connectDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            if (process.env.MODE != "dev-client") {
                return yield Databases_1.default.connect();
            }
        });
    }
    nextStart() {
        return __awaiter(this, void 0, void 0, function* () {
            if (process.env.MODE !== "dev-server") {
                yield nextApp.prepare();
                Server.nextApp = nextApp;
            }
            else {
                handle = (request, response) => {
                    response.status(404).send("MODE is dev server only, Route not exist.");
                };
                Server.nextApp = { render: handle };
            }
        });
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.nextStart();
            yield this.connectDatabase();
            yield nextI18next.initPromise;
            this.express.use(nextI18NextMiddleware(nextI18next));
            this.express.use(bodyParser.urlencoded({ extended: true }));
            this.express.use(bodyParser.json({
                limit: '50mb'
            }));
            this.express.use(cors({
                origin: dev ? "*" : process.env.CORS_ORIGIN
            }));
            this.express.use(Routes_1.default.build());
            this.express.all('*', (req, res) => {
                res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
                return handle(req, res);
            });
            yield new Promise(r => this.express.listen(this.port, this.host, () => {
                console.log(`server stated: ${this.host}:${this.port}`);
                r();
            }));
            return {
                express: this.express,
                next: Server.nextApp
            };
        });
    }
}
exports.default = Server;
