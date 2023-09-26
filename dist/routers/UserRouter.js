"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var UserController_1 = require("../controller/UserController");
var auth_1 = require("../auth/auth");
var UserRouter = express_1.default.Router();
UserRouter.route('/check').get(auth_1.tokenToUid, auth_1.confirmAndFetchUserInfo);
UserRouter.route('/').get(auth_1.tokenToUid, auth_1.getUserInfo);
UserRouter.route('/').post(auth_1.tokenToUid, UserController_1.postUser);
exports.default = UserRouter;
