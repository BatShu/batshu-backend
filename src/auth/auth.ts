import {Request, Response } from "express";
import { administrator } from "./firebase";
const admin = require('firebase-admin');


declare global {
    namespace Express {
      interface Request {
        currentUser: string;
        userEmail: string | undefined; 
    }
    }

    interface UserInfo {
        uid: string;
        email: string;
        nickname: string;
        photoUrl: string;
    }

    interface AuthApiResponse {
        ok: boolean;
        msg: string;
        data?: UserInfo;
    }
  }


  export const authToken = (req : Request, res : Response) => {
    if (req.headers.authorization) {
        
        const token:string = req.headers.authorization.split('Bearer ')[1];
        
        if (!token) {
            res.status(401).send({
                ok : false,
                msg : "로그인 수행이 필요합니다."
            })
        }
        return token;
  };

}

// Ex.
//  {
//    "Authorizaiton": "Bearer access-token",
//    "uid": "2342knp4ad3k3233jk22"
//  }


export const confirmAndFetchUserInfo = async (req : Request, res : Response) => {
    
    let uid: string;

    if(req.headers.uid) {

        if(typeof req.headers.uid === 'string') {

            uid = req.headers.uid;

            try {
            
                const userInfo = await administrator.auth().getUser(uid);
                
                console.log(userInfo);

                req.currentUser = userInfo.uid;
                req.userEmail = userInfo.email;
            
            } catch(err) {
                
                console.error("Firebase에서 사용자 정보 가져오기 오류:", err);
            } 
    
        } else {
            res.status(401).send({
                ok: false,
                msg: "UID값이 존재하지 않습니다."                   
            });  
        }
    }
}

// Ex.
// Header - 
// key  : Authorization
// value : Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjE5MGFkMTE4YTk0MGFkYzlmMmY1Mzc2YjM1MjkyZmVkZThjMmQwZWUiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoi7KCV7ZWY656MIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FBY0hUdGNXLUJOZ21qOWV0N0J5UUlzYjNfLVJKUnFQX3dQaFZKTmRTZGNpWXNnVj1zOTYtYyIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9zeW5lcmd5LXRlc3QtYTFmMjQiLCJhdWQiOiJzeW5lcmd5LXRlc3QtYTFmMjQiLCJhdXRoX3RpbWUiOjE2OTQ4ODQyMzQsInVzZXJfaWQiOiJGWG55SlozcWw2UzJoaVpGRG5NaGNRckZSNWcyIiwic3ViIjoiRlhueUpaM3FsNlMyaGlaRkRuTWhjUXJGUjVnMiIsImlhdCI6MTY5NDg4NDIzNCwiZXhwIjoxNjk0ODg3ODM0LCJlbWFpbCI6IjA0aGFyYW1zNzdAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMTU5MDQzMjk4NzY5MzQ1MTQ1NzYiXSwiZW1haWwiOlsiMDRoYXJhbXM3N0BnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJnb29nbGUuY29tIn19.cmcO6RKWQMJaD4pUruiQ8ofYo-DT11n86om0R0W80crdnAragSR-hARBJ7FoQuuieCHokRnuNkVAHRrSxDjm1DuCpnKgHXcOleA82QSUcjY2BSvAQBkGsqACR6Vp6XDXRpbDnsBG3tpgu0TS76EJUzcWTIVkTLZJnH4Gyn4-onD2L8yiyqVWj6U2IIYxzrAhcIWA7Dejw7cJltouwwMVRYpvIVnBKHLd8hs64RihLgOxtaZAD5T8fsn5eyDyBjcRWRZ6lBPSOfqbENVUPJGNUY0buFqbad1auPbCSieGuSp3XXxMDyiWKoutWY3jWyJ0Qgy9llxPjIG7cXwTAAm6wg
// <AccessToken maybe renewal required>
// body -
// {
// "uid" : "FXnyJZ3ql6S2hiZFDnMhcQrFR5g2"
// }

export const userPost = async (req:Request,res:Response):Promise<void>=>{
    try {
        const token = authToken(req,res)
    
        // Firebase에서 토큰 검증
        const decodedToken = await admin.auth().verifyIdToken(token);
        const uid = decodedToken.uid;
    
        // UID를 사용하여 사용자 정보 가져오기
        const userInfo = await admin.auth().getUser(uid);

        if (!userInfo) {
            const resData: AuthApiResponse = {
                ok: false,
                msg: '등록되지 않은 유저입니다.'
            }
            res.status(400).json(resData);
          }

        const resData: AuthApiResponse = {
            ok: true,
            msg: "Successfully registered",
            data : {
                uid: userInfo.uid,
                email: userInfo.email,
                nickname: userInfo.displayName,
                photoUrl: userInfo.photoURL
            }
        }
        res.status(200).json(resData);

      } catch (error) {
        console.error('Error:', error);
        const resData: AuthApiResponse = {
            ok: false,
            msg: "INTERNAL SERVER ERROR"
        }
        res.status(500).json(resData);
      }
}


export default { authToken, confirmAndFetchUserInfo, userPost}