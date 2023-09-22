import {NextFunction, Request, Response } from "express";
import { admin } from "./firebase";


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

    interface ApiResponse {
        ok: boolean;
        msg: string;
        data?: UserInfo;
    }

    interface CustomRequest extends Request {
        uid?: string; // 'uid' 프로퍼티를 추가합니다.
    }
  }

  export const tokenToUid = async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (req.headers.authorization) {
        const token: string = req.headers.authorization.split('Bearer ')[1];

        try {
            const decodedToken = await admin.auth().verifyIdToken(token);
            req['uid'] = decodedToken.uid;
            next();
        } catch (error) {
            // Handle token verification error here
            res.status(401).send('Unauthorized1');
        }
    } else {
        // Handle case where authorization header is missing
        res.status(401).send('Unauthorized2');
    }
}

// export const tokenToUserId = async (accessToken:string) => {
//     try{
//         const decodedToken = await administrator.auth().verifyIdToken(accessToken);
//         const uid:string = decodedToken.uid;

//         const user = await userRepository.readUser(uid);

//         const userId:number = user[0].uid
//         return userId;

//     } catch (error){
//         console.log(error);
//          const resData: ApiResponse = {
//             ok : false,
//             msg : "INTERNAL SERVER ERROR"
//         }
//         return resData;
//     }
// }



//유저 uid 인식.
export const confirmAndFetchUserInfo = async (req : CustomRequest, res : Response) => {
    
    let uid: string;

    if(req.headers.uid) {

        if(typeof req.headers.uid === 'string') {

            uid = req.headers.uid;
            
            req.currentUser = uid
            req.userEmail = uid
            
    
        } else {
            return res.status(401).send({
                ok: false,
                msg: "UID값이 존재하지 않습니다."                   
            });  
        }
    }
}


export const getUserInfo = async (req:CustomRequest,res:Response):Promise<void>=>{
    try {
        if (typeof req.uid === 'string') {

            // UID를 사용하여 사용자 정보 가져오기
            const userInfo = await admin.auth().getUser(req.uid);
            
            if (!userInfo) {
                const resData: ApiResponse = {
                    ok: false,
                    msg: '등록되지 않은 유저입니다.'
                }
                
                res.status(400).json(resData);
          } else {
                
            const resData: ApiResponse = {
                ok: true,
                msg: "Successfully Get UserInfo",
                data : {
                    uid: userInfo.uid,
                    email: userInfo.email || '',
                    nickname: userInfo.displayName || '',
                    photoUrl: userInfo.photoURL || '',
                }
            }
            res.status(200).json(resData);
          }
          

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


// export default { authToken, tokenToUserId, confirmAndFetchUserInfo, getUserInfo }
export default { confirmAndFetchUserInfo, getUserInfo }
