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
exports.confirmAndFetchUserInfo = exports.authToken = void 0;
var firebase_1 = require("./firebase");
var authToken = function (req, res) {
    if (req.headers.authorization) {
        var token = req.headers.authorization.split('Bearer ')[1];
        if (!token) {
            res.status(401).send({
                ok: false,
                msg: "로그인 수행이 필요합니다."
            });
        }
    }
    ;
};
exports.authToken = authToken;
// Ex.
//  {
//    "Authorizaiton": "Bearer access-token",
//    "uid": "2342knp4ad3k3233jk22"
//  }
var confirmAndFetchUserInfo = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var uid, userInfo, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.headers.uid) return [3 /*break*/, 6];
                if (!(typeof req.headers.uid === 'string')) return [3 /*break*/, 5];
                uid = req.headers.uid;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, firebase_1.administrator.auth().getUser(uid)];
            case 2:
                userInfo = _a.sent();
                console.log(userInfo);
                req.currentUser = userInfo.uid;
                req.userEmail = userInfo.email;
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                console.error("Firebase에서 사용자 정보 가져오기 오류:", err_1);
                return [3 /*break*/, 4];
            case 4: return [3 /*break*/, 6];
            case 5:
                res.status(401).send({
                    ok: false,
                    msg: "UID값이 존재하지 않습니다."
                });
                _a.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.confirmAndFetchUserInfo = confirmAndFetchUserInfo;
exports.default = { authToken: exports.authToken, confirmAndFetchUserInfo: exports.confirmAndFetchUserInfo };
