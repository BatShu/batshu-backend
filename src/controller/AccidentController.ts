import { Request, Response } from "express";

const accidentService = require("../service/AccidentService");
const auth = require("../auth/auth");
const admin = require('firebase-admin');

declare global {
  interface Location {
    x : string;
    y : string;
  }

  interface Accident {
      contentTitle : string;
      contentDescription : string;
      pictureUrl : string[];
      accidentTime : Date[];
      accidentLocation : Location;
      carModelName : string;
      licensePlate : string;
      uid : string;
      bounty : number;
  }
}

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

export const postAccident = async (req: Request, res: Response) => {
    try {
      if (req.headers.authorization) {

        // 형식적 데이터 처리

        const token = auth.authToken(req,res);

        const decodedToken = await admin.auth().verifyIdToken(token);
        const uid:string = decodedToken.uid;
        
        // const userId:number = await auth.tokenToUserId(token);
        
        const passedData:Accident = {
          contentTitle : req.body.contentTitle,
          contentDescription : req.body.contentDescription,
          pictureUrl : req.body.pictureUrl,
          accidentTime : req.body.accidentTime,
          accidentLocation : req.body.accidentLocation,
          carModelName : req.body.carModelName,
          licensePlate : req.body.licensePlate,
          uid : uid,
          bounty : req.body.bounty
        }
        console.log(passedData);

        const resData:ApiResponse = await accidentService.createAccident(passedData);
        res.status(200).json(resData);
      }
      } catch (error) {
        console.error('Error:', error);
        const resData: ApiResponse = {
            ok: false,
            msg: "INTERNAL SERVER ERROR"
        }
        res.status(500).json(resData);
      }
}