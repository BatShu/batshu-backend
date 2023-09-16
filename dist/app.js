"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var AccidentRouter_js_1 = __importDefault(require("./routers/AccidentRouter.js"));
var AccidentRouter_js_2 = __importDefault(require("./routers/AccidentRouter.js"));
var UserRouter_js_1 = __importDefault(require("./routers/UserRouter.js"));
var app = (0, express_1.default)();
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use("/api/user", UserRouter_js_1.default);
app.use("/api/accident", AccidentRouter_js_1.default);
app.use("/api/observe", AccidentRouter_js_2.default);
var PORT = process.env.PORT || 3000;
var handleListening = function () {
    return console.log("\u2705Server listenting on http://localhost:".concat(PORT, " \uD83D\uDE80 "));
};
app.listen(PORT, handleListening);
exports.default = app;
