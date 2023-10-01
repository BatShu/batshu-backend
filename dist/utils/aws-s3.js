"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.localStorage = exports.s3Upload = void 0;
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var multer = require('multer');
var AWS = require('aws-sdk');
var multerS3 = require('multer-s3');
var path = require('path');
var accessKey = process.env.ACCESS_KEY;
var secretAccessKey = process.env.SECRET_ACCESS_KEY;
var bucketRegion = process.env.BUCKET_REGION;
AWS.config.update({
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
    region: bucketRegion,
});
//* AWS S3 multer 설정
exports.s3Upload = multer({
    storage: multerS3({
        s3: new AWS.S3(),
        bucket: 'batshu-observe-input',
        acl: 'private',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
            cb(null, "".concat(Date.now(), "_").concat(path.basename(file.originalname))); // original 폴더안에다 파일을 저장
        },
    }),
});
exports.localStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        // 파일이 저장될 디렉토리 경로를 지정합니다.
        cb(null, 'src/DashcamCleaner/');
    },
    filename: function (req, file, cb) {
        // 파일의 이름을 지정합니다.
        cb(null, file.originalname);
    }
});
