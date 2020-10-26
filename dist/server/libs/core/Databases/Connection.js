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
const database_1 = __importDefault(require("@config/database"));
const options = {
    client: database_1.default.DB_TYPE,
    connection: {
        host: database_1.default.DB_HOST,
        port: database_1.default.DB_PORT,
        user: database_1.default.DB_USER,
        password: database_1.default.DB_PASS,
        database: database_1.default.DB_NAME,
        multipleStatements: true
    },
    pool: { min: 0, max: database_1.default.DB_POOL_SIZE }
};
class Connection {
    constructor() {
    }
    get connection() {
        if (this._connection && !this._connection.connecting) {
            this.connect();
        }
        return this._connection;
    }
    set connection(connection) {
        this._connection = connection;
        this._connection.connecting = true;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("new Database connection");
            try {
                const knex = require('knex');
                if (typeof knex.QueryBuilder.extend != "function") {
                    throw Error("Knex version đã cũ, xóa node_modules, yarn.lock và cài lại node modules");
                }
                this.connection = knex(options);
                return this.connection || {};
            }
            catch (e) {
                throw e;
            }
        });
    }
}
exports.default = Connection;
