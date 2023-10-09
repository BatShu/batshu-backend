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
exports.selectfindregisterObserveInfo = exports.createObserveData = exports.selectVideoInfo = exports.insertThumbnailUrlResult = exports.updateVideoUrlToOutputFileNameResult = exports.insertMosaicedVideoUrlResult = exports.updateVideoStatusWithBlurringDone = exports.updateVideoStatusWithBlurring = exports.findUploadedVideoId = exports.updateVideoStatus = exports.selectObserveOnTheMapRow = void 0;
var database_1 = __importDefault(require("../config/database"));
var selectObserveOnTheMapRow = function (locationObject) { return __awaiter(void 0, void 0, void 0, function () {
    var connection, observeSelectQuery, observeRows;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database_1.default.getConnection()];
            case 1:
                connection = _a.sent();
                observeSelectQuery = "\n      SELECT id, ST_X(observe_location) AS x, ST_Y(observe_location) AS y\n      FROM observe\n      WHERE ST_Distance_Sphere(\n        observe_location,\n        ST_GeomFromText('POINT(".concat(locationObject.x, " ").concat(locationObject.y, ")')\n      ) <= ?;");
                return [4 /*yield*/, connection.execute(observeSelectQuery, [
                        locationObject.radius
                    ])];
            case 2:
                observeRows = (_a.sent())[0];
                connection.release();
                return [2 /*return*/, observeRows];
        }
    });
}); };
exports.selectObserveOnTheMapRow = selectObserveOnTheMapRow;
// 비디오 업로드.
var updateVideoStatus = function (connection, uploadedVideoOriginalName) { return __awaiter(void 0, void 0, void 0, function () {
    var updateVideoStatusQuery, updateVideoStatusRows;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                updateVideoStatusQuery = "INSERT INTO video (status, video_url) VALUES (?, ?);";
                return [4 /*yield*/, connection.query(updateVideoStatusQuery, ['uploaded', uploadedVideoOriginalName])];
            case 1:
                updateVideoStatusRows = (_a.sent())[0];
                return [2 /*return*/, updateVideoStatusRows];
        }
    });
}); };
exports.updateVideoStatus = updateVideoStatus;
var findUploadedVideoId = function (connection, uploadedVideoOriginalName) { return __awaiter(void 0, void 0, void 0, function () {
    var findUploadedVideoIdQuery, findUploadedVideoIdRows;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                findUploadedVideoIdQuery = "SELECT id FROM video WHERE video_url = ?;";
                return [4 /*yield*/, connection.query(findUploadedVideoIdQuery, [uploadedVideoOriginalName])];
            case 1:
                findUploadedVideoIdRows = (_a.sent())[0];
                return [2 /*return*/, findUploadedVideoIdRows];
        }
    });
}); };
exports.findUploadedVideoId = findUploadedVideoId;
var updateVideoStatusWithBlurring = function (connection, uploadedVideoOriginalName) { return __awaiter(void 0, void 0, void 0, function () {
    var updateVideoStatusWithBlurringStartQuery, updateVideoStatusWithBlurringStartRows;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                updateVideoStatusWithBlurringStartQuery = "UPDATE video SET status = ? WHERE video_url = ?;";
                return [4 /*yield*/, connection.query(updateVideoStatusWithBlurringStartQuery, ['blurring', uploadedVideoOriginalName])];
            case 1:
                updateVideoStatusWithBlurringStartRows = (_a.sent())[0];
                return [2 /*return*/, updateVideoStatusWithBlurringStartRows];
        }
    });
}); };
exports.updateVideoStatusWithBlurring = updateVideoStatusWithBlurring;
var updateVideoStatusWithBlurringDone = function (connection, uploadedVideoOriginalName) { return __awaiter(void 0, void 0, void 0, function () {
    var updateVideoStatusWithBlurringDoneQuery, updateVideoStatusWithBlurringDoneRows;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                updateVideoStatusWithBlurringDoneQuery = "UPDATE video SET status = ? WHERE video_url = ?;";
                return [4 /*yield*/, connection.query(updateVideoStatusWithBlurringDoneQuery, ['blurringDone', uploadedVideoOriginalName])];
            case 1:
                updateVideoStatusWithBlurringDoneRows = (_a.sent())[0];
                return [2 /*return*/, updateVideoStatusWithBlurringDoneRows];
        }
    });
}); };
exports.updateVideoStatusWithBlurringDone = updateVideoStatusWithBlurringDone;
var insertMosaicedVideoUrlResult = function (connection, videoOutputFileName, mosaicedVideoUrl) { return __awaiter(void 0, void 0, void 0, function () {
    var insertMosaicedVideoUrlQuery, insertMosaicedVideoUrlRows;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                insertMosaicedVideoUrlQuery = "UPDATE video SET video_url = ? WHERE video_url = ?;";
                return [4 /*yield*/, connection.query(insertMosaicedVideoUrlQuery, [mosaicedVideoUrl, videoOutputFileName])];
            case 1:
                insertMosaicedVideoUrlRows = (_a.sent())[0];
                return [2 /*return*/, insertMosaicedVideoUrlRows];
        }
    });
}); };
exports.insertMosaicedVideoUrlResult = insertMosaicedVideoUrlResult;
var updateVideoUrlToOutputFileNameResult = function (connection, uploadedVideoOriginalName, outputFileName) { return __awaiter(void 0, void 0, void 0, function () {
    var updateVideoUrlToOutputFileNameQuery, updateVideoUrlToOutputFileNameRows;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                updateVideoUrlToOutputFileNameQuery = "UPDATE video SET video_url = ? WHERE video_url = ?;";
                return [4 /*yield*/, connection.query(updateVideoUrlToOutputFileNameQuery, [outputFileName, uploadedVideoOriginalName])];
            case 1:
                updateVideoUrlToOutputFileNameRows = (_a.sent())[0];
                return [2 /*return*/, updateVideoUrlToOutputFileNameRows];
        }
    });
}); };
exports.updateVideoUrlToOutputFileNameResult = updateVideoUrlToOutputFileNameResult;
var insertThumbnailUrlResult = function (connection, locationUrl, thumbnailLocationUrl) { return __awaiter(void 0, void 0, void 0, function () {
    var updateThumbnailUrlQuery, insertThumbnailUrlRows, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                updateThumbnailUrlQuery = "UPDATE video SET thumbnail_url = ? WHERE video_url = ?;";
                return [4 /*yield*/, connection.query(updateThumbnailUrlQuery, [thumbnailLocationUrl, locationUrl])];
            case 1:
                insertThumbnailUrlRows = (_a.sent())[0];
                return [2 /*return*/, insertThumbnailUrlRows];
            case 2:
                error_1 = _a.sent();
                console.error('썸네일 URL 삽입 오류:', error_1);
                throw error_1; // 더 높은 수준에서 처리하기 위해 오류를 다시 던집니다.
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.insertThumbnailUrlResult = insertThumbnailUrlResult;
var selectVideoInfo = function (connection, videoId) { return __awaiter(void 0, void 0, void 0, function () {
    var selectVideoInfoQuery, selectVideoInfoRows;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                selectVideoInfoQuery = "SELECT id, video_url, thumbnail_url FROM video WHERE id = ?;";
                return [4 /*yield*/, connection.query(selectVideoInfoQuery, [videoId])];
            case 1:
                selectVideoInfoRows = (_a.sent())[0];
                return [2 /*return*/, selectVideoInfoRows];
        }
    });
}); };
exports.selectVideoInfo = selectVideoInfo;
var createObserveData = function (connection, registerObserveData) { return __awaiter(void 0, void 0, void 0, function () {
    var createObserveQuery, results;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                createObserveQuery = "INSERT INTO observe (content_title, content_description, video_id, observe_start_time, observe_end_time, observe_location, created_at, uid) VALUES (?, ?, ?, ?, ?, POINT(?, ?), NOW(), ?);";
                return [4 /*yield*/, connection.query(createObserveQuery, [
                        registerObserveData.contentTitle,
                        registerObserveData.contentDescription,
                        registerObserveData.videoId,
                        registerObserveData.observeTime[0],
                        registerObserveData.observeTime[1],
                        registerObserveData.accidentLocation.x,
                        registerObserveData.accidentLocation.y,
                        registerObserveData.uid,
                    ])];
            case 1:
                results = _a.sent();
                console.log(results);
                return [2 /*return*/];
        }
    });
}); };
exports.createObserveData = createObserveData;
var selectfindregisterObserveInfo = function (connection, videoId) { return __awaiter(void 0, void 0, void 0, function () {
    var selectCreatedAtQuery, selectCreatedAtRows;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                selectCreatedAtQuery = "SELECT * FROM observe WHERE video_id = ?;";
                return [4 /*yield*/, connection.query(selectCreatedAtQuery, [videoId])];
            case 1:
                selectCreatedAtRows = (_a.sent())[0];
                return [2 /*return*/, selectCreatedAtRows];
        }
    });
}); };
exports.selectfindregisterObserveInfo = selectfindregisterObserveInfo;
