import express, {Express, Request, Response } from "express";
import { administrator } from "./firebase";


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


export default { authToken, confirmAndFetchUserInfo}