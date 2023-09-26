"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var AccidentController_1 = require("../controller/AccidentController");
var auth_1 = require("../auth/auth");
var multer_1 = __importDefault(require("multer"));
var storage = multer_1.default.memoryStorage();
var upload = (0, multer_1.default)({ storage: storage });
var AccidentRouter = express_1.default.Router();
AccidentRouter.route('/').post(auth_1.tokenToUid, upload.array('pictureUrl'), AccidentController_1.postAccident);
exports.default = AccidentRouter;
