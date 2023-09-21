import { Request, Response } from "express";

const admin = require('firebase-admin');
const accidentService = require("../service/AccidentService");
const auth = require("../auth/auth");

export const postAccident = async (req: Request, res: Response) => {
    try {
      if (req.headers.authorization) {

        // 형식적 데이터 처리

        const token:string = req.headers.authorization.split('Bearer ')[1];
        
        const userId = await auth.tokenToUserId(token);
        
        const passedData = {
          contentTitle : req.body.contentTitle,
          contentDescription : req.body.contentDescription,
          pictureUrl : req.body.pictureUrl,
          accidentTime : req.body.accidentTime,
          accidentLocation : req.body.accidentLocation,
          carModelName : req.body.carModelName,
          licensePlate : req.body.licensePlate,
          userId : userId,
          bounty : req.body.bounty
        }

        const resData:ApiResponse = await accidentService.createAccident(passedData); // passed data
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