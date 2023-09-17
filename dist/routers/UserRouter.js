"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var auth_1 = require("../auth/auth");
var auth_2 = require("../auth/auth");
var UserRouter = express_1.default.Router();
UserRouter.route('/check').get(auth_2.confirmAndFetchUserInfo);
UserRouter.route('/').post(auth_1.userPost);
exports.default = UserRouter;
