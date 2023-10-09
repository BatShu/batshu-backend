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
var AccidentRepository_1 = __importDefault(require("../Repository/AccidentRepository"));
exports.createAccident = function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var accidentRows, insertId, _i, _a, photo, resData, error_1, resData;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                return [4 /*yield*/, AccidentRepository_1.default.insertAccidentRow(data)];
            case 1:
                accidentRows = _b.sent();
                console.log(accidentRows);
                insertId = accidentRows[0].insertId;
                _i = 0, _a = data.photoUrls;
                _b.label = 2;
            case 2:
                if (!(_i < _a.length)) return [3 /*break*/, 5];
                photo = _a[_i];
                return [4 /*yield*/, AccidentRepository_1.default.insertAccidentPhotoRow({
                        photoUrl: photo,
                        accidentId: insertId
                    })];
            case 3:
                _b.sent();
                _b.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5:
                resData = {
                    ok: true,
                    msg: "Successfully Post"
                };
                return [2 /*return*/, resData];
            case 6:
                error_1 = _b.sent();
                resData = {
                    ok: false,
                    msg: "INTERNAL SERVER ERROR"
                };
                return [2 /*return*/, resData];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.readAccident = function (accidentId) { return __awaiter(void 0, void 0, void 0, function () {
    var accidentRow, accidentPhotoRows, accidentLocation, data, _i, accidentPhotoRows_1, accidentPhotoRow, resData, error_2, resData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, AccidentRepository_1.default.selectAccidentRow(accidentId)];
            case 1:
                accidentRow = _a.sent();
                return [4 /*yield*/, AccidentRepository_1.default.selectAccidentPhotoRow(accidentId)];
            case 2:
                accidentPhotoRows = _a.sent();
                accidentLocation = {
                    x: accidentRow.x,
                    y: accidentRow.y
                };
                data = {
                    contentTitle: accidentRow.content_title,
                    contentDescription: accidentRow.content_description,
                    photoUrls: [],
                    accidentTime: [
                        accidentRow.accident_start_time,
                        accidentRow.accident_end_time
                    ],
                    createdAt: accidentRow.created_at,
                    accidentLocation: accidentLocation,
                    placeName: accidentRow.placeName,
                    carModelName: accidentRow.car_model_name,
                    licensePlate: accidentRow.license_plate,
                    bounty: accidentRow.bounty
                };
                for (_i = 0, accidentPhotoRows_1 = accidentPhotoRows; _i < accidentPhotoRows_1.length; _i++) {
                    accidentPhotoRow = accidentPhotoRows_1[_i];
                    data.photoUrls.push(accidentPhotoRow.photo_url);
                }
                resData = {
                    ok: true,
                    msg: "Successfully Get",
                    data: data
                };
                return [2 /*return*/, resData];
            case 3:
                error_2 = _a.sent();
                resData = {
                    ok: false,
                    msg: "INTERNAL SERVER ERROR"
                };
                return [2 /*return*/, resData];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.readAccidentOnTheMap = function (locationObject) { return __awaiter(void 0, void 0, void 0, function () {
    var accidentRows, data, _i, accidentRows_1, accidentRow, location_1, accidentLocationObject, resData, error_3, resData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, AccidentRepository_1.default.selectAccidentOnTheMapRow(locationObject)];
            case 1:
                accidentRows = _a.sent();
                data = [];
                for (_i = 0, accidentRows_1 = accidentRows; _i < accidentRows_1.length; _i++) {
                    accidentRow = accidentRows_1[_i];
                    location_1 = {
                        x: accidentRow.x,
                        y: accidentRow.y
                    };
                    accidentLocationObject = {
                        accidentId: accidentRow.id,
                        accidentLocation: location_1
                    };
                    data.push(accidentLocationObject);
                }
                resData = {
                    ok: true,
                    msg: "Successfully Get",
                    data: data
                };
                return [2 /*return*/, resData];
            case 2:
                error_3 = _a.sent();
                resData = {
                    ok: false,
                    msg: "INTERNAL SERVER ERROR"
                };
                return [2 /*return*/, resData];
            case 3: return [2 /*return*/];
        }
    });
}); };
