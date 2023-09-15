"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var promise_1 = __importDefault(require("mysql2/promise"));
var _a = process.env, DB_HOST = _a.DB_HOST, DB_USER = _a.DB_USER, DB_PASS = _a.DB_PASS, DB_NAME = _a.DB_NAME;
var pool = promise_1.default.createPool({
    connectionLimit: 10,
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME
});
exports.default = pool;
