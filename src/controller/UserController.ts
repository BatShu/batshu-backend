import { Request, Response } from "express";
import { authToken }  from '../auth/auth';

const userService = require("../service/UserService");

const admin = require('firebase-admin');

export const postUser = async (req:Request,res:Response):Promise<void>=> {
    try {
        const token = authToken(req,res);

        // Firebase에서 토큰 검증
        const decodedToken = await admin.auth().verifyIdToken(token);
        const uid = decodedToken.uid;
    
        // UID를 사용하여 사용자 정보 가져오기
        const userInfo = await admin.auth().getUser(uid);

        if (!userInfo) {
            const resData: ApiResponse = {
                ok: false,
                msg: '등록되지 않은 유저입니다.'
            }
            res.status(400).json(resData);
          }
        
        const resData: ApiResponse = await userService.createUser(userInfo.uid);

        res.status(200).json(resData);

      } catch (error) {
        console.error('Error:', error);
        const resData: ApiResponse = {
            ok: false,
            msg: "INTERNAL SERVER ERROR"
        }
        res.status(500).json(resData);
      }
}



