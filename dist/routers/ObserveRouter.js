"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var ObserveController_1 = require("../controller/ObserveController");
var auth_1 = require("../auth/auth");
var ObserverRouter = express_1.default.Router();
ObserverRouter.route('/:observeId').get(auth_1.tokenToUid, ObserveController_1.getObserve);
exports.default = ObserverRouter;
