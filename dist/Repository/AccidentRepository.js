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
exports.selectAccidentOnTheMapRow = exports.insertAccidentPictureRow = exports.insertAccidentRow = exports.selectAccidentPictureRow = exports.selectAccidentRow = void 0;
var database_1 = __importDefault(require("../config/database"));
var selectAccidentRow = function (accidentId) { return __awaiter(void 0, void 0, void 0, function () {
    var connection, accidentSelectQuery, accidentRows;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database_1.default.getConnection()];
            case 1:
                connection = _a.sent();
                accidentSelectQuery = "select \n    content_title, \n    content_description, \n    accident_start_time, \n    accident_end_time, \n    created_at, \n    ST_X(accident_location) AS x, \n    ST_Y(accident_location) AS y, \n    car_model_name, \n    license_plate, \n    bounty, \n    uid \n    from accident\n    WHERE id = ?";
                return [4 /*yield*/, connection.execute(accidentSelectQuery, [
                        accidentId
                    ])];
            case 2:
                accidentRows = (_a.sent())[0];
                connection.release();
                return [2 /*return*/, accidentRows[0]];
        }
    });
}); };
exports.selectAccidentRow = selectAccidentRow;
var selectAccidentPictureRow = function (accidentId) { return __awaiter(void 0, void 0, void 0, function () {
    var connection, accidentPictureSelectQuery, accidentPictureRows;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database_1.default.getConnection()];
            case 1:
                connection = _a.sent();
                accidentPictureSelectQuery = "SELECT * FROM accident_picture WHERE accident_id = ?";
                return [4 /*yield*/, connection.execute(accidentPictureSelectQuery, [
                        accidentId
                    ])];
            case 2:
                accidentPictureRows = _a.sent();
                connection.release();
                return [2 /*return*/, accidentPictureRows[0]];
        }
    });
}); };
exports.selectAccidentPictureRow = selectAccidentPictureRow;
var insertAccidentRow = function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var connection, accidentInsertQuery, accidentRows;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database_1.default.getConnection()];
            case 1:
                connection = _a.sent();
                accidentInsertQuery = "\n      INSERT INTO accident (\n        content_title,\n        content_description,\n        accident_start_time,\n        accident_end_time,\n        created_at,\n        accident_location,\n        car_model_name,\n        license_plate,\n        uid,\n        bounty\n      ) VALUES (?, ?, ?, ?, NOW(), POINT(?, ?), ?, ?, ?, ?)\n    ";
                return [4 /*yield*/, connection.execute(accidentInsertQuery, [
                        data.contentTitle,
                        data.contentDescription,
                        data.accidentTime[0],
                        data.accidentTime[1],
                        data.accidentLocation.x,
                        data.accidentLocation.y,
                        data.carModelName,
                        data.licensePlate,
                        data.uid,
                        data.bounty
                    ])];
            case 2:
                accidentRows = _a.sent();
                connection.release();
                return [2 /*return*/, accidentRows];
        }
    });
}); };
exports.insertAccidentRow = insertAccidentRow;
var insertAccidentPictureRow = function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var connection, accidentPictureInsertQuery;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database_1.default.getConnection()];
            case 1:
                connection = _a.sent();
                accidentPictureInsertQuery = "\n        INSERT INTO accident_picture (\n          picture_url,\n          accident_id\n        ) VALUES (?, ?)\n      ";
                return [4 /*yield*/, connection.execute(accidentPictureInsertQuery, [
                        data.pictureUrl,
                        data.accidentId
                    ])];
            case 2:
                _a.sent();
                connection.release();
                return [2 /*return*/];
        }
    });
}); };
exports.insertAccidentPictureRow = insertAccidentPictureRow;
var selectAccidentOnTheMapRow = function (locationObject) { return __awaiter(void 0, void 0, void 0, function () {
    var connection, accidentSelectQuery, accidentRows, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, database_1.default.getConnection()];
            case 1:
                connection = _a.sent();
                accidentSelectQuery = "\n      SELECT id, ST_X(accident_location) AS x, ST_Y(accident_location) AS y\n      FROM accident\n      WHERE ST_Distance_Sphere(\n        accident_location,\n        ST_GeomFromText('POINT(".concat(locationObject.x, " ").concat(locationObject.y, ")')\n      ) <= ?;");
                return [4 /*yield*/, connection.execute(accidentSelectQuery, [
                        locationObject.radius
                    ])];
            case 2:
                accidentRows = _a.sent();
                connection.release();
                return [2 /*return*/, accidentRows[0]];
            case 3:
                err_1 = _a.sent();
                return [2 /*return*/, err_1];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.selectAccidentOnTheMapRow = selectAccidentOnTheMapRow;
exports.default = { insertAccidentRow: exports.insertAccidentRow, insertAccidentPictureRow: exports.insertAccidentPictureRow, selectAccidentRow: exports.selectAccidentRow, selectAccidentPictureRow: exports.selectAccidentPictureRow, selectAccidentOnTheMapRow: exports.selectAccidentOnTheMapRow };
