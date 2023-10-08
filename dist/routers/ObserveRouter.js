"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var multer_1 = __importDefault(require("multer"));
var ObserveController_1 = require("../controller/ObserveController");
var auth_1 = require("../auth/auth");
var aws_s3_1 = require("../utils/aws-s3");
var ObserverRouter = express_1.default.Router();

var observeVideoUpload = (0, multer_1.default)({ storage: aws_s3_1.localStorage, fileFilter: aws_s3_1.fileFilter });
ObserverRouter.route('/video').post(auth_1.tokenToUid, observeVideoUpload.single("video"), ObserveController_1.uploadVideo, ObserveController_1.mosaicProcessing);
ObserverRouter.route('/register').post(auth_1.tokenToUid, ObserveController_1.registerObserve);

ObserverRouter.route('/:observeId').get(auth_1.tokenToUid, ObserveController_1.getObserve);
exports.default = ObserverRouter;
