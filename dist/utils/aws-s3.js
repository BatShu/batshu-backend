"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.localStorage = exports.fileFilter = exports.s3Upload = exports.S3 = exports.bucketRegion = exports.secretAccessKey = exports.accessKey = void 0;
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var multer_1 = __importDefault(require("multer"));
var client_s3_1 = require("@aws-sdk/client-s3");
var AWS = require('aws-sdk');
var multerS3 = require('multer-s3');
var path = require('path');
exports.accessKey = process.env.ACCESS_KEY_JC;
exports.secretAccessKey = process.env.SECRET_ACCESS_KEY_JC;
exports.bucketRegion = process.env.BUCKET_REGION;
var s3params = {
    credentials: {
        accessKeyId: exports.accessKey,
        secretAccessKey: exports.secretAccessKey
    },
    region: exports.bucketRegion
};
exports.S3 = new client_s3_1.S3Client(s3params);
AWS.config.update({
    accessKeyId: exports.accessKey,
    secretAccessKey: exports.secretAccessKey,
    region: exports.bucketRegion,
});
//* AWS S3 multer 설정
exports.s3Upload = (0, multer_1.default)({
    storage: multerS3({
        s3: new AWS.S3(),
        bucket: 'batshu-observe-input',
        acl: 'private',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
            cb(null, "".concat(Date.now(), "_").concat(path.basename(file.originalname)));
        },
    }),
});
// 확장자 필터 함수 정의
var fileFilter = function (req, file, cb) {
    var allowedExtensions = ["mp4", "wmv", "mov", "avi", "dat"];
    var fileExtension = String(file.originalname.split('.').pop()); // 문자열로 형변환
    if (allowedExtensions.includes(fileExtension)) {
        // 허용된 확장자인 경우
        cb(null, true); // 파일 허용
    }
    else {
        // 허용되지 않은 확장자인 경우
        cb(null, false); // 파일 거부
    }
};
exports.fileFilter = fileFilter;
exports.localStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        // 파일이 저장될 디렉토리 경로를 지정합니다.
        cb(null, 'DashcamCleaner');
    },
    filename: function (req, file, cb) {
        // 파일의 이름을 지정합니다.
        cb(null, file.originalname);
    }
});
