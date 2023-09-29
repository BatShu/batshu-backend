"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccident = exports.postAccident = exports.getAccidentOnTheMap = void 0;
var accidentService = require("../service/AccidentService");
var crypto = require('crypto');
var sharp = require('sharp');
var AWS = require('aws-sdk');
var client_s3_1 = require("@aws-sdk/client-s3");
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var bucketName = process.env.BUCKET_NAME;
var accessKey = process.env.ACCESS_KEY;
var bucketRegion = process.env.BUCKET_REGION;
var secretAccessKey = process.env.SECRET_ACCESS_KEY;
AWS.config.update({
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
    region: bucketRegion, // 사용하는 AWS 지역을 여기에 입력
});
var s3params = {
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey
    },
    region: bucketRegion
};
var s3 = new client_s3_1.S3Client(s3params);
// Ex.
// Header - 
// key  : Authorization
// value : Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjE5MGFkMTE4YTk0MGFkYzlmMmY1Mzc2YjM1MjkyZmVkZThjMmQwZWUiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoi7KCV7ZWY656MIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FBY0hUdGNXLUJOZ21qOWV0N0J5UUlzYjNfLVJKUnFQX3dQaFZKTmRTZGNpWXNnVj1zOTYtYyIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9zeW5lcmd5LXRlc3QtYTFmMjQiLCJhdWQiOiJzeW5lcmd5LXRlc3QtYTFmMjQiLCJhdXRoX3RpbWUiOjE2OTQ4ODQyMzQsInVzZXJfaWQiOiJGWG55SlozcWw2UzJoaVpGRG5NaGNRckZSNWcyIiwic3ViIjoiRlhueUpaM3FsNlMyaGlaRkRuTWhjUXJGUjVnMiIsImlhdCI6MTY5NDg4NDIzNCwiZXhwIjoxNjk0ODg3ODM0LCJlbWFpbCI6IjA0aGFyYW1zNzdAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMTU5MDQzMjk4NzY5MzQ1MTQ1NzYiXSwiZW1haWwiOlsiMDRoYXJhbXM3N0BnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJnb29nbGUuY29tIn19.cmcO6RKWQMJaD4pUruiQ8ofYo-DT11n86om0R0W80crdnAragSR-hARBJ7FoQuuieCHokRnuNkVAHRrSxDjm1DuCpnKgHXcOleA82QSUcjY2BSvAQBkGsqACR6Vp6XDXRpbDnsBG3tpgu0TS76EJUzcWTIVkTLZJnH4Gyn4-onD2L8yiyqVWj6U2IIYxzrAhcIWA7Dejw7cJltouwwMVRYpvIVnBKHLd8hs64RihLgOxtaZAD5T8fsn5eyDyBjcRWRZ6lBPSOfqbENVUPJGNUY0buFqbad1auPbCSieGuSp3XXxMDyiWKoutWY3jWyJ0Qgy9llxPjIG7cXwTAAm6wg
// body - multi form-data
// {
//   "contentTitle" : "아..큰일남",
//   "contentDescription"  : "뺑소니당했어",
//   "accidentTime" : [
//     "2023-11-02T00:05:04.123",
//     "2023-11-02T00:06:04.123"
//   ],
//   "pictureUrl" : -> 이미지 파일들 select
//   "accidentLocation" : {
//        "x" : "32.234234234",
//        "y" : "152.234234234"
//   },
//   "carModelName" : "avante",
//   "licensePlate" : "13어 1342",
//   "bounty" : 400000
// }
var getAccidentOnTheMap = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, x, y, radius, xCoord, yCoord, radiusValue, Obj, resData, err_1, resData;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.query, x = _a.x, y = _a.y, radius = _a.radius;
                xCoord = parseFloat(x);
                yCoord = parseFloat(y);
                radiusValue = parseFloat(radius);
                if (isNaN(xCoord) || isNaN(yCoord) || isNaN(radiusValue)) {
                    return [2 /*return*/, res.status(400).json({ ok: false, msg: 'Invalid values for x, y, or radius' })];
                }
                Obj = { x: xCoord, y: yCoord, radius: radiusValue };
                return [4 /*yield*/, accidentService.readAccidentOnTheMap(Obj)];
            case 1:
                resData = _b.sent();
                res.status(200).json(resData);
                return [3 /*break*/, 3];
            case 2:
                err_1 = _b.sent();
                console.error('Error:', err_1);
                resData = {
                    ok: false,
                    msg: "INTERNAL SERVER ERROR"
                };
                res.status(500).json(resData);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAccidentOnTheMap = getAccidentOnTheMap;
var postAccident = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var images, uid, pictureUrl, _i, images_1, img, fileName, buffer, params, command, passedData, resData, error_1, resData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 8, , 9]);
                if (!(typeof req.uid === 'string')) return [3 /*break*/, 7];
                images = req.files;
                uid = req.uid;
                pictureUrl = [];
                _i = 0, images_1 = images;
                _a.label = 1;
            case 1:
                if (!(_i < images_1.length)) return [3 /*break*/, 5];
                img = images_1[_i];
                fileName = crypto.randomBytes(16).toString('hex');
                return [4 /*yield*/, sharp(img.buffer).resize({ height: 1920, width: 1080, fit: "contain" }).toBuffer()];
            case 2:
                buffer = _a.sent();
                params = {
                    Bucket: bucketName,
                    Key: "".concat(fileName, ".").concat(img.originalname.split('.').pop()),
                    Body: buffer,
                    ContentType: img.mimetype
                };
                pictureUrl.push("https://".concat(params.Bucket, ".s3.amazonaws.com/").concat(params.Key));
                command = new client_s3_1.PutObjectCommand(params);
                return [4 /*yield*/, s3.send(command)];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 1];
            case 5:
                passedData = {
                    contentTitle: req.body.contentTitle,
                    contentDescription: req.body.contentDescription,
                    pictureUrl: pictureUrl,
                    accidentTime: req.body.accidentTime,
                    accidentLocation: req.body.accidentLocation,
                    carModelName: req.body.carModelName,
                    licensePlate: req.body.licensePlate,
                    uid: uid,
                    bounty: req.body.bounty
                };
                return [4 /*yield*/, accidentService.createAccident(passedData)];
            case 6:
                resData = _a.sent();
                res.status(200).json(resData);
                _a.label = 7;
            case 7: return [3 /*break*/, 9];
            case 8:
                error_1 = _a.sent();
                console.error('Error:', error_1);
                resData = {
                    ok: false,
                    msg: "INTERNAL SERVER ERROR"
                };
                res.status(500).json(resData);
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.postAccident = postAccident;
var getAccident = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var resData, error_2, resData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, accidentService.readAccident(req.params.accidentId)];
            case 1:
                resData = _a.sent();
                res.status(200).json(resData);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error('Error:', error_2);
                resData = {
                    ok: false,
                    msg: "INTERNAL SERVER ERROR"
                };
                res.status(500).json(resData);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAccident = getAccident;
exports.default = { getAccidentOnTheMap: exports.getAccidentOnTheMap, postAccident: exports.postAccident, getAccident: exports.getAccident };
