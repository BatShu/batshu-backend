"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getObserve = exports.registerObserve = exports.videoProcessing = exports.getObserveOnTheMap = exports.uploadVideo = void 0;
var path = __importStar(require("path"));
var child_process_1 = require("child_process");
var client_s3_1 = require("@aws-sdk/client-s3");
var aws_s3_1 = require("../utils/aws-s3");
var ObserveService_1 = require("../service/ObserveService");
var AWS = require('aws-sdk');
var fs = require('fs');
var ffmpeg = require('fluent-ffmpeg');
AWS.config.update({
    accessKeyId: aws_s3_1.accessKey,
    secretAccessKey: aws_s3_1.secretAccessKey,
    region: aws_s3_1.bucketRegion,
});
var s3 = new AWS.S3();
var observeService = require("../service/ObserveService");
var uploadVideo = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var uploadedVideo, uploadedVideoOriginalName, updateUploadedVideoStatus, videoId, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                uploadedVideo = req.file;
                uploadedVideoOriginalName = uploadedVideo.originalname;
                return [4 /*yield*/, (0, ObserveService_1.insertVideoStatus)(uploadedVideoOriginalName)];
            case 1:
                updateUploadedVideoStatus = _a.sent();
                return [4 /*yield*/, (0, ObserveService_1.findVideoId)(uploadedVideoOriginalName)];
            case 2:
                videoId = _a.sent();
                if (!videoId) {
                    return [2 /*return*/, res.status(500).json({
                            ok: false,
                            msg: "해당 비디오가 존재하지 않습니다."
                        })];
                }
                else {
                    next();
                    return [2 /*return*/, res.status(200).json({
                            ok: true,
                            msg: "This is uploaded videoId",
                            videoId: videoId,
                        })];
                }
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.log(error_1);
                return [2 /*return*/, res.status(500).json({
                        ok: false,
                        msg: "INTERNAL SERVER ERROR"
                    })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.uploadVideo = uploadVideo;
var getObserveOnTheMap = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
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
                return [4 /*yield*/, observeService.readObserveOnTheMap(Obj)];
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
exports.getObserveOnTheMap = getObserveOnTheMap;
var videoProcessing = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var uploadedVideo, uploadedVideoOriginalName_1, fileExtension, videoOutputFileName_1, mosaicCommand, blurringDoneVideo_1, error_2, resData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                uploadedVideo = req.file;
                uploadedVideoOriginalName_1 = uploadedVideo.originalname;
                fileExtension = path.extname(uploadedVideoOriginalName_1);
                videoOutputFileName_1 = "".concat(uploadedVideoOriginalName_1, "_").concat(Date.now()).concat(fileExtension);
                console.log(process.cwd());
                mosaicCommand = "python cli.py -i ".concat(uploadedVideoOriginalName_1, " -o ").concat(videoOutputFileName_1, " -w 360p_nano_v8.pt");
                return [4 /*yield*/, (0, ObserveService_1.updateVideoStautsToBlurringStart)(uploadedVideoOriginalName_1)];
            case 1:
                _a.sent();
                blurringDoneVideo_1 = (0, child_process_1.exec)(mosaicCommand, function (error, stdout, stderr) { return __awaiter(void 0, void 0, void 0, function () {
                    var uploadParams, currentWorkingDirectory_1, thumbnailFileName_1, thumbnailInfo, thumbnailFilePath, thumbnailUploadParams, uploadThumbnailcommand, command, videoLocationUrl, thumbnailLocationUrl, mosaicedFinalVideoUrl, thumbnail, error_3;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (error) {
                                    console.log("error: ".concat(error.message));
                                }
                                else if (stderr) {
                                    console.log("stderr: ".concat(stderr));
                                }
                                else {
                                    console.log('stdout:', stdout);
                                }
                                if (!blurringDoneVideo_1) return [3 /*break*/, 11];
                                return [4 /*yield*/, (0, ObserveService_1.updateVideoStautsToBlurringDone)(uploadedVideoOriginalName_1)];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, (0, ObserveService_1.updateVideoUrlToOutputFileName)(uploadedVideoOriginalName_1, videoOutputFileName_1)];
                            case 2:
                                _a.sent();
                                uploadParams = {
                                    Bucket: 'batshu-observe-input',
                                    Key: videoOutputFileName_1,
                                    Body: fs.createReadStream(videoOutputFileName_1),
                                };
                                _a.label = 3;
                            case 3:
                                _a.trys.push([3, 9, , 10]);
                                currentWorkingDirectory_1 = process.cwd();
                                thumbnailFileName_1 = "thumbnail_".concat(Date.now(), "To").concat(uploadedVideoOriginalName_1, ".png");
                                return [4 /*yield*/, new Promise(function (resolve, reject) {
                                        ffmpeg(videoOutputFileName_1)
                                            .screenshots({
                                            timestamps: ['50%'],
                                            filename: thumbnailFileName_1,
                                            folder: currentWorkingDirectory_1,
                                            size: '320x240'
                                        })
                                            .on('end', function (stdout, stderr) {
                                            console.log('썸네일 추출 완료');
                                            resolve(stdout);
                                        })
                                            .on('error', function (err) {
                                            console.error('썸네일 추출 오류:', err);
                                            reject(err);
                                        });
                                    })];
                            case 4:
                                thumbnailInfo = _a.sent();
                                thumbnailFilePath = "".concat(currentWorkingDirectory_1, "/").concat(thumbnailFileName_1);
                                thumbnailUploadParams = {
                                    Bucket: 'batshu-observe-input',
                                    Key: thumbnailFileName_1,
                                    Body: fs.createReadStream(thumbnailFilePath),
                                };
                                uploadThumbnailcommand = new client_s3_1.PutObjectCommand(thumbnailUploadParams);
                                return [4 /*yield*/, aws_s3_1.S3.send(uploadThumbnailcommand)];
                            case 5:
                                _a.sent();
                                command = new client_s3_1.PutObjectCommand(uploadParams);
                                return [4 /*yield*/, aws_s3_1.S3.send(command)];
                            case 6:
                                _a.sent();
                                videoLocationUrl = "https://batshu-observe-input.s3.amazonaws.com/".concat(videoOutputFileName_1);
                                thumbnailLocationUrl = "https://batshu-observe-input.s3.amazonaws.com/".concat(thumbnailFileName_1);
                                return [4 /*yield*/, (0, ObserveService_1.insertMosaicedFinalVideoUrl)(videoOutputFileName_1, videoLocationUrl)];
                            case 7:
                                mosaicedFinalVideoUrl = _a.sent();
                                return [4 /*yield*/, (0, ObserveService_1.insertThumbnailUrl)(videoLocationUrl, thumbnailLocationUrl)];
                            case 8:
                                thumbnail = _a.sent();
                                return [3 /*break*/, 10];
                            case 9:
                                error_3 = _a.sent();
                                console.log(error_3);
                                return [3 /*break*/, 10];
                            case 10: return [3 /*break*/, 12];
                            case 11:
                                console.log("blurringDoneVideo is not defined");
                                _a.label = 12;
                            case 12: return [2 /*return*/];
                        }
                    });
                }); });
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
exports.videoProcessing = videoProcessing;
var registerObserve = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var uid, registerObserveData, registerObserveResult, videoInfo, registerObserveInfo, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                if (!(typeof req.uid === 'string')) return [3 /*break*/, 4];
                uid = req.uid;
                registerObserveData = {
                    contentTitle: req.body.contentTitle,
                    contentDescription: req.body.contentDescription,
                    videoId: req.body.videoId,
                    carModelName: req.body.carModelName,
                    licensePlate: req.body.licensePlate,
                    placeName: req.body.placeName,
                    observeTime: req.body.observeTime,
                    accidentLocation: req.body.observeLocation,
                    uid: uid,
                };
                return [4 /*yield*/, (0, ObserveService_1.createObserve)(registerObserveData)];
            case 1:
                registerObserveResult = _a.sent();
                return [4 /*yield*/, (0, ObserveService_1.findvideoInfo)(registerObserveData.videoId)];
            case 2:
                videoInfo = _a.sent();
                return [4 /*yield*/, (0, ObserveService_1.findregisterObserveInfo)(registerObserveData.videoId)];
            case 3:
                registerObserveInfo = _a.sent();
                return [2 /*return*/, res.status(200).json({
                        ok: true,
                        msg: "Successfully registered",
                        data: {
                            observeId: registerObserveInfo[0].id,
                            uid: registerObserveInfo[0].uid,
                            videoUrl: videoInfo[0].video_url,
                            thumbnailUrl: videoInfo[0].thumbnail_url,
                            contentTitle: registerObserveInfo[0].content_title,
                            contentDescription: registerObserveInfo[0].content_description,
                            observeStartTime: registerObserveInfo[0].observe_start_time,
                            observeEndTime: registerObserveInfo[0].observe_end_time,
                            observeLocation: registerObserveInfo[0].observe_location,
                            createdAt: registerObserveInfo[0].created_at,
                        }
                    })];
            case 4: return [3 /*break*/, 6];
            case 5:
                err_2 = _a.sent();
                console.log(err_2);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.registerObserve = registerObserve;
//TODO: make function to get videoUrl by videoId
var getObserve = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var resData;
    return __generator(this, function (_a) {
        try {
            console.log(req.params.observeId);
        }
        catch (error) {
            console.error('Error:', error);
            resData = {
                ok: false,
                msg: "INTERNAL SERVER ERROR"
            };
            res.status(500).json(resData);
        }
        return [2 /*return*/];
    });
}); };
exports.getObserve = getObserve;
