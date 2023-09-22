"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var AccidentController_1 = require("../controller/AccidentController");
var auth_1 = require("../auth/auth");
var AccidentRouter = express_1.default.Router();
AccidentRouter.route('/').post(auth_1.tokenToUid, AccidentController_1.postAccident);
exports.default = AccidentRouter;
