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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getObserve = exports.registerObserve = exports.mosaicProcessing = exports.uploadVideo = void 0;
var child_process_1 = require("child_process");
var ObserveService_1 = require("../service/ObserveService");
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
var mosaicProcessing = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var uploadedVideo, uploadedVideoOriginalName_1, outputFileName, scriptDirectory, mosaicCommand, blurringDoneVideo_1, error_2, resData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                uploadedVideo = req.file;
                uploadedVideoOriginalName_1 = uploadedVideo.originalname;
                outputFileName = 'blurred_video.mp4';
                scriptDirectory = './src/DashcamCleaner';
                process.chdir(scriptDirectory);
                mosaicCommand = "python cli.py -i ".concat(uploadedVideoOriginalName_1, " -o ").concat(outputFileName, " -w 720p_nano_v8.pt -bw 3 -t 0.6");
                return [4 /*yield*/, (0, ObserveService_1.updateVideoStautsToBlurringStart)(uploadedVideoOriginalName_1)];
            case 1:
                _a.sent();
                blurringDoneVideo_1 = (0, child_process_1.exec)(mosaicCommand, function (error, stdout, stderr) { return __awaiter(void 0, void 0, void 0, function () {
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
                                    console.log('stdout:', stdout); // 외부 명령어의 표준 출력을 콘솔에 출력
                                }
                                if (!blurringDoneVideo_1) return [3 /*break*/, 2];
                                return [4 /*yield*/, (0, ObserveService_1.updateVideoStautsToBlurringDone)(uploadedVideoOriginalName_1)];
                            case 1:
                                _a.sent();
                                _a.label = 2;
                            case 2: return [2 /*return*/];
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
exports.mosaicProcessing = mosaicProcessing;
var registerObserve = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/];
    });
}); };
exports.registerObserve = registerObserve;
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
