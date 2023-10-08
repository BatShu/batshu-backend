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
exports.findregisterObserveInfo = exports.findvideoInfo = exports.insertThumbnailUrl = exports.updateVideoUrlToOutputFileName = exports.insertMosaicedFinalVideoUrl = exports.createObserve = exports.updateVideoStautsToBlurringDone = exports.updateVideoStautsToBlurringStart = exports.findVideoId = exports.insertVideoStatus = void 0;
var database_1 = __importDefault(require("../config/database"));
var ObserveRepository_1 = require("../Repository/ObserveRepository");
var insertVideoStatus = function (uploadedVideoOriginalName) { return __awaiter(void 0, void 0, void 0, function () {
    var conneciton, updatedVideoStatus;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database_1.default.getConnection()];
            case 1:
                conneciton = _a.sent();
                return [4 /*yield*/, (0, ObserveRepository_1.updateVideoStatus)(conneciton, uploadedVideoOriginalName)];
            case 2:
                updatedVideoStatus = _a.sent();
                conneciton.release();
                return [2 /*return*/, updatedVideoStatus];
        }
    });
}); };
exports.insertVideoStatus = insertVideoStatus;
var findVideoId = function (uploadedVideoOriginalName) { return __awaiter(void 0, void 0, void 0, function () {
    var conneciton, uploadedVideoId;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database_1.default.getConnection()];
            case 1:
                conneciton = _a.sent();
                return [4 /*yield*/, (0, ObserveRepository_1.findUploadedVideoId)(conneciton, uploadedVideoOriginalName)];
            case 2:
                uploadedVideoId = _a.sent();
                conneciton.release();
                return [2 /*return*/, uploadedVideoId];
        }
    });
}); };
exports.findVideoId = findVideoId;
var updateVideoStautsToBlurringStart = function (uploadedVideoOriginalName) { return __awaiter(void 0, void 0, void 0, function () {
    var conneciton, updateUploadedVideoStatus;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database_1.default.getConnection()];
            case 1:
                conneciton = _a.sent();
                return [4 /*yield*/, (0, ObserveRepository_1.updateVideoStatusWithBlurring)(conneciton, uploadedVideoOriginalName)];
            case 2:
                updateUploadedVideoStatus = _a.sent();
                conneciton.release();
                return [2 /*return*/, updateUploadedVideoStatus];
        }
    });
}); };
exports.updateVideoStautsToBlurringStart = updateVideoStautsToBlurringStart;
var updateVideoStautsToBlurringDone = function (uploadedVideoOriginalName) { return __awaiter(void 0, void 0, void 0, function () {
    var conneciton, updateUploadedVideoStatus;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database_1.default.getConnection()];
            case 1:
                conneciton = _a.sent();
                return [4 /*yield*/, (0, ObserveRepository_1.updateVideoStatusWithBlurringDone)(conneciton, uploadedVideoOriginalName)];
            case 2:
                updateUploadedVideoStatus = _a.sent();
                conneciton.release();
                return [2 /*return*/, updateUploadedVideoStatus];
        }
    });
}); };
exports.updateVideoStautsToBlurringDone = updateVideoStautsToBlurringDone;
var createObserve = function (registerObserveData) { return __awaiter(void 0, void 0, void 0, function () {
    var conneciton, observeData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database_1.default.getConnection()];
            case 1:
                conneciton = _a.sent();
                return [4 /*yield*/, (0, ObserveRepository_1.createObserveData)(conneciton, registerObserveData)];
            case 2:
                observeData = _a.sent();
                conneciton.release();
                return [2 /*return*/, observeData];
        }
    });
}); };
exports.createObserve = createObserve;
var insertMosaicedFinalVideoUrl = function (videoOutputFileName, mosaicedVideoUrl) { return __awaiter(void 0, void 0, void 0, function () {
    var conneciton, mosaicedVideo;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database_1.default.getConnection()];
            case 1:
                conneciton = _a.sent();
                return [4 /*yield*/, (0, ObserveRepository_1.insertMosaicedVideoUrlResult)(conneciton, videoOutputFileName, mosaicedVideoUrl)];
            case 2:
                mosaicedVideo = _a.sent();
                conneciton.release();
                return [2 /*return*/];
        }
    });
}); };
exports.insertMosaicedFinalVideoUrl = insertMosaicedFinalVideoUrl;
var updateVideoUrlToOutputFileName = function (uploadedVideoOriginalName, outputFileName) { return __awaiter(void 0, void 0, void 0, function () {
    var conneciton, updateVideoUrl;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database_1.default.getConnection()];
            case 1:
                conneciton = _a.sent();
                return [4 /*yield*/, (0, ObserveRepository_1.updateVideoUrlToOutputFileNameResult)(conneciton, uploadedVideoOriginalName, outputFileName)];
            case 2:
                updateVideoUrl = _a.sent();
                conneciton.release();
                return [2 /*return*/, updateVideoUrl];
        }
    });
}); };
exports.updateVideoUrlToOutputFileName = updateVideoUrlToOutputFileName;
var insertThumbnailUrl = function (locationUrl, thumbnailLocationUrl) { return __awaiter(void 0, void 0, void 0, function () {
    var conneciton, thumbnail;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database_1.default.getConnection()];
            case 1:
                conneciton = _a.sent();
                return [4 /*yield*/, (0, ObserveRepository_1.insertThumbnailUrlResult)(conneciton, locationUrl, thumbnailLocationUrl)];
            case 2:
                thumbnail = _a.sent();
                conneciton.release();
                return [2 /*return*/];
        }
    });
}); };
exports.insertThumbnailUrl = insertThumbnailUrl;
var findvideoInfo = function (videoId) { return __awaiter(void 0, void 0, void 0, function () {
    var conneciton, videoInfo;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database_1.default.getConnection()];
            case 1:
                conneciton = _a.sent();
                return [4 /*yield*/, (0, ObserveRepository_1.selectVideoInfo)(conneciton, videoId)];
            case 2:
                videoInfo = _a.sent();
                conneciton.release();
                return [2 /*return*/, videoInfo];
        }
    });
}); };
exports.findvideoInfo = findvideoInfo;
var findregisterObserveInfo = function (videoId) { return __awaiter(void 0, void 0, void 0, function () {
    var conneciton, createdAt;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database_1.default.getConnection()];
            case 1:
                conneciton = _a.sent();
                return [4 /*yield*/, (0, ObserveRepository_1.selectfindregisterObserveInfo)(conneciton, videoId)];
            case 2:
                createdAt = _a.sent();
                conneciton.release();
                return [2 /*return*/, createdAt];
        }
    });
}); };
exports.findregisterObserveInfo = findregisterObserveInfo;
exports.readObserveOnTheMap = function (locationObject) { return __awaiter(void 0, void 0, void 0, function () {
    var observeRows, data, _i, observeRows_1, observeRow, location_1, observeLocationObject, resData, error_1, resData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, ObserveRepository_1.selectObserveOnTheMapRow)(locationObject)];
            case 1:
                observeRows = _a.sent();
                data = [];
                for (_i = 0, observeRows_1 = observeRows; _i < observeRows_1.length; _i++) {
                    observeRow = observeRows_1[_i];
                    location_1 = {
                        x: observeRow.x,
                        y: observeRow.y
                    };
                    observeLocationObject = {
                        observeId: observeRow.id,
                        observeLocation: location_1
                    };
                    data.push(observeLocationObject);
                }
                resData = {
                    ok: true,
                    msg: "Successfully Get",
                    data: data
                };
                return [2 /*return*/, resData];
            case 2:
                error_1 = _a.sent();
                resData = {
                    ok: false,
                    msg: "INTERNAL SERVER ERROR"
                };
                return [2 /*return*/, resData];
            case 3: return [2 /*return*/];
        }
    });
}); };
