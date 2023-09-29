import { Request, Response } from "express";

const accidentService = require("../service/AccidentService");
const crypto = require('crypto');
const sharp = require('sharp')

const AWS = require('aws-sdk');

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

import dotenv from "dotenv";

declare global {
  interface LocationObject {
    x : number;
    y : number;
    radius? : number;
  }

  interface Accident {
      contentTitle : string;
      contentDescription : string;
      pictureUrl : string[];
      accidentTime : Date[];
      createdAt? : Date;
      accidentLocation : LocationObject;
      carModelName : string;
      licensePlate : string;
      uid? : string;
      bounty : number;
  }

  interface AccidentPicture {
      pictureUrl : string;
      accidentId : number;
  }

  interface AccidentLocationObject {
    accidentId : number;
    x : number;
    y : number;
  }

  interface imageData {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
  }

  interface ResultSetHeader {
    y: number;
    x: number;
    radius: number;
    bounty: number;
    license_plate: string;
    car_model_name: string;
    accident_end_time: Date;
    accident_start_time: Date;
    created_at: Date;
    content_description: string;
    content_title: string;
    picture_url: string;
    fieldCount: number;
    affectedRows: number;
    insertId: number;
    info: string;
    serverStatus: number;
    warningStatus: number;
  }

}

dotenv.config();

const bucketName:string = process.env.BUCKET_NAME!;
const accessKey:string = process.env.ACCESS_KEY!;
const bucketRegion:string = process.env.BUCKET_REGION!;
const secretAccessKey:string = process.env.SECRET_ACCESS_KEY!;


AWS.config.update({
  accessKeyId: accessKey,          // AWS Access Key ID를 여기에 입력
  secretAccessKey: secretAccessKey,  // AWS Secret Access Key를 여기에 입력
  region: bucketRegion,                      // 사용하는 AWS 지역을 여기에 입력
});

const s3params = {
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey
  },
  region: bucketRegion
}

const s3 = new S3Client(s3params);

// Ex.
// Header - 
// key  : Authorization
// value : Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjE5MGFkMTE4YTk0MGFkYzlmMmY1Mzc2YjM1MjkyZmVkZThjMmQwZWUiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoi7KCV7ZWY656MIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FBY0hUdGNXLUJOZ21qOWV0N0J5UUlzYjNfLVJKUnFQX3dQaFZKTmRTZGNpWXNnVj1zOTYtYyIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9zeW5lcmd5LXRlc3QtYTFmMjQiLCJhdWQiOiJzeW5lcmd5LXRlc3QtYTFmMjQiLCJhdXRoX3RpbWUiOjE2OTQ4ODQyMzQsInVzZXJfaWQiOiJGWG55SlozcWw2UzJoaVpGRG5NaGNRckZSNWcyIiwic3ViIjoiRlhueUpaM3FsNlMyaGlaRkRuTWhjUXJGUjVnMiIsImlhdCI6MTY5NDg4NDIzNCwiZXhwIjoxNjk0ODg3ODM0LCJlbWFpbCI6IjA0aGFyYW1zNzdAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMTU5MDQzMjk4NzY5MzQ1MTQ1NzYiXSwiZW1haWwiOlsiMDRoYXJhbXM3N0BnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJnb29nbGUuY29tIn19.cmcO6RKWQMJaD4pUruiQ8ofYo-DT11n86om0R0W80crdnAragSR-hARBJ7FoQuuieCHokRnuNkVAHRrSxDjm1DuCpnKgHXcOleA82QSUcjY2BSvAQBkGsqACR6Vp6XDXRpbDnsBG3tpgu0TS76EJUzcWTIVkTLZJnH4Gyn4-onD2L8yiyqVWj6U2IIYxzrAhcIWA7Dejw7cJltouwwMVRYpvIVnBKHLd8hs64RihLgOxtaZAD5T8fsn5eyDyBjcRWRZ6lBPSOfqbENVUPJGNUY0buFqbad1auPbCSieGuSp3XXxMDyiWKoutWY3jWyJ0Qgy9llxPjIG7cXwTAAm6wg
// body - multi form-data
// {
//   "contentTitle" : "아..큰일남",
//   "contentDescription"  : "뺑소니당했어",
//   "accidentTime" : [
//     "2023-11-02T00:05:04.123",
//     "2023-11-02T00:06:04.123"
//   ],
//   "pictureUrl" : -> 이미지 파일들 select
//   "accidentLocation" : {
//        "x" : "32.234234234",
//        "y" : "152.234234234"
//   },
//   "carModelName" : "avante",
//   "licensePlate" : "13어 1342",
//   "bounty" : 400000
// }

export const getAccidentOnTheMap = async (req:CustomRequest, res: Response) => {
  try {
    const { x, y, radius } = req.query;

    const xCoord:number = parseFloat(x as string);
    const yCoord:number = parseFloat(y as string);
    const radiusValue:number = parseFloat(radius as string);


    if (isNaN(xCoord) || isNaN(yCoord) || isNaN(radiusValue)) {
      return res.status(400).json({ ok: false, msg: 'Invalid values for x, y, or radius' });
    }

    const Obj:LocationObject = { x: xCoord, y: yCoord, radius: radiusValue };
    
    const resData:ApiResponse = await accidentService.readAccidentOnTheMap(Obj);

    res.status(200).json(resData);

  } catch (err) {
    console.error('Error:', err);
    const resData: ApiResponse = {
        ok: false,
        msg: "INTERNAL SERVER ERROR"
    }
    res.status(500).json(resData);
  }
  
}

export const postAccident = async (req: CustomRequest, res: Response) => {
    try {
      if (typeof req.uid === 'string') {
        // console.log("req.body",req.body);
        const images:imageData[] = req.files as Express.Multer.File[];
        
        const uid:string = req.uid;
        
        const pictureUrl:string[] = [];
        
        for (let img of images){
          const fileName:string = crypto.randomBytes(16).toString('hex');
          const buffer = await sharp(img.buffer).resize({height: 1920, width: 1080, fit: "contain"}).toBuffer()
          const params = {
            Bucket: bucketName,
            Key: `${fileName}.${img.originalname.split('.').pop()}`,
            Body: buffer,
            ContentType: img.mimetype
          }

          pictureUrl.push(`https://${params.Bucket}.s3.amazonaws.com/${params.Key}`);

          const command = new PutObjectCommand(params);
          await s3.send(command);
        }
        

        const passedData:Accident = {
          contentTitle : req.body.contentTitle,
          contentDescription : req.body.contentDescription,
          pictureUrl : pictureUrl,
          accidentTime : req.body.accidentTime,
          accidentLocation : req.body.accidentLocation,
          carModelName : req.body.carModelName,
          licensePlate : req.body.licensePlate,
          uid : uid,
          bounty : req.body.bounty
        }

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

export const getAccident = async (req:Request, res: Response) => {
  try{
    const resData:ApiResponse = await accidentService.readAccident(req.params.accidentId);

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

export default { getAccidentOnTheMap, postAccident, getAccident };