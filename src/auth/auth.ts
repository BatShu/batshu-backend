import express, {Express, Request, Response } from "express";
import { administrator } from "./firebase";
const bodyParser = require('body-parser');
const admin = require('firebase-admin');


declare global {
    namespace Express {
      interface Request {
        currentUser: string;
        userEmail: string | undefined; 
    }
    }
  }


  export const authToken = (req : Request, res : Response) => {
    if (req.headers.authorization) {
        
        const token = req.headers.authorization.split('Bearer ')[1];
        
        if (!token) {
            res.status(401).send({
                ok : false,
                msg : "로그인 수행이 필요합니다."
            })
        } 
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

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

export const userPost = async (req:Request,res:Response)=>{
    try {
        const token = req.headers.authorization?.split('Bearer ')[1];
        if (!token) { // issue
          return res.status(401).json({ error: 'Authorization header missing' });
        }
    
        // Firebase에서 토큰 검증
        const decodedToken = await admin.auth().verifyIdToken(token);
        const uid = decodedToken.uid;
    
        // UID를 사용하여 사용자 정보 가져오기
        const userInfo = await admin.auth().getUser(uid);

        if (!userInfo) {
            return res.status(400).json({
              ok: false,
              message: '등록되지 않은 유저입니다.'
            });
          }

        const resData = {
            "ok": true,
            "msg": "Successfully registered",
            "data" : {
                "uid": userInfo.uid,
                "email": userInfo.email,
                "nickname": userInfo.displayName,
                "photoUrl": userInfo.photoURL
            }
        }
        res.status(200).json(resData);
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            "ok": false,
            "message": "INTERNAL SERVER ERROR"
        });
      }
}


export default { authToken, confirmAndFetchUserInfo}