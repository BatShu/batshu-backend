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
exports.postAccident = void 0;
var accidentService = require("../service/AccidentService");
var auth = require("../auth/auth");
// Ex.
// Header - 
// key  : Authorization
// value : Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjE5MGFkMTE4YTk0MGFkYzlmMmY1Mzc2YjM1MjkyZmVkZThjMmQwZWUiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoi7KCV7ZWY656MIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FBY0hUdGNXLUJOZ21qOWV0N0J5UUlzYjNfLVJKUnFQX3dQaFZKTmRTZGNpWXNnVj1zOTYtYyIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9zeW5lcmd5LXRlc3QtYTFmMjQiLCJhdWQiOiJzeW5lcmd5LXRlc3QtYTFmMjQiLCJhdXRoX3RpbWUiOjE2OTQ4ODQyMzQsInVzZXJfaWQiOiJGWG55SlozcWw2UzJoaVpGRG5NaGNRckZSNWcyIiwic3ViIjoiRlhueUpaM3FsNlMyaGlaRkRuTWhjUXJGUjVnMiIsImlhdCI6MTY5NDg4NDIzNCwiZXhwIjoxNjk0ODg3ODM0LCJlbWFpbCI6IjA0aGFyYW1zNzdAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMTU5MDQzMjk4NzY5MzQ1MTQ1NzYiXSwiZW1haWwiOlsiMDRoYXJhbXM3N0BnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJnb29nbGUuY29tIn19.cmcO6RKWQMJaD4pUruiQ8ofYo-DT11n86om0R0W80crdnAragSR-hARBJ7FoQuuieCHokRnuNkVAHRrSxDjm1DuCpnKgHXcOleA82QSUcjY2BSvAQBkGsqACR6Vp6XDXRpbDnsBG3tpgu0TS76EJUzcWTIVkTLZJnH4Gyn4-onD2L8yiyqVWj6U2IIYxzrAhcIWA7Dejw7cJltouwwMVRYpvIVnBKHLd8hs64RihLgOxtaZAD5T8fsn5eyDyBjcRWRZ6lBPSOfqbENVUPJGNUY0buFqbad1auPbCSieGuSp3XXxMDyiWKoutWY3jWyJ0Qgy9llxPjIG7cXwTAAm6wg
// body -
// {
//   "contentTitle" : "아..큰일남",
//   "contentDescription"  : "뺑소니당했어",
//   "pictureUrl" : [
//       "https://www.socialfocus.co.kr/news/photo/202101/9416_15430_221.jpg",
//       "https://img.freepik.com/free-photo/image-of-a-auto-accident-involving-two-cars_613910-7924.jpg?w=2000",
//       "https://blog.kakaocdn.net/dn/5jKyK/btq6GpHQ8yZ/kQfKk9eRuGtzmLzpKavkTk/img.png"
//   ],
//   "accidentTime" : [
//     "2023-11-02T00:05:04.123",
//     "2023-11-02T00:06:04.123"
//   ],
//   "accidentLocation" : {
//        "x" : "32.234234234",
//        "y" : "152.234234234"
//   },
//   "carModelName" : "avante",
//   "licensePlate" : "13어 1342",
//   "bounty" : 400000
// }
var postAccident = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, userId, passedData, resData, error_1, resData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                if (!req.headers.authorization) return [3 /*break*/, 3];
                token = req.headers.authorization.split('Bearer ')[1];
                return [4 /*yield*/, auth.tokenToUserId(token)];
            case 1:
                userId = _a.sent();
                passedData = {
                    contentTitle: req.body.contentTitle,
                    contentDescription: req.body.contentDescription,
                    pictureUrl: req.body.pictureUrl,
                    accidentTime: req.body.accidentTime,
                    accidentLocation: req.body.accidentLocation,
                    carModelName: req.body.carModelName,
                    licensePlate: req.body.licensePlate,
                    userId: userId,
                    bounty: req.body.bounty
                };
                return [4 /*yield*/, accidentService.createAccident(passedData)];
            case 2:
                resData = _a.sent();
                res.status(200).json(resData);
                _a.label = 3;
            case 3: return [3 /*break*/, 5];
            case 4:
                error_1 = _a.sent();
                console.error('Error:', error_1);
                resData = {
                    ok: false,
                    msg: "INTERNAL SERVER ERROR"
                };
                res.status(500).json(resData);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.postAccident = postAccident;
