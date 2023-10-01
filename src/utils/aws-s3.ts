import express, {Express, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

const multer = require('multer');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');
const path = require('path');


const accessKey:string = process.env.ACCESS_KEY!;
const secretAccessKey:string = process.env.SECRET_ACCESS_KEY!;
const bucketRegion:string = process.env.BUCKET_REGION!;


AWS.config.update({
  accessKeyId: accessKey,       
  secretAccessKey: secretAccessKey,  
  region: bucketRegion,             
});


//* AWS S3 multer 설정
export const s3Upload = multer({
  storage: multerS3({
    s3: new AWS.S3(),
     bucket: 'batshu-observe-input',
     acl: 'private',
     contentType: multerS3.AUTO_CONTENT_TYPE,
     key(req:Request, file: { originalname: any; }, cb: (arg0: null, arg1: string) => void) {
        cb(null, `${Date.now()}_${path.basename(file.originalname)}`)
     },
  }),
});



export const localStorage = multer.diskStorage({
  destination: function (req:Request, file: any, cb: (arg0: null, arg1: string) => void) {
    // 파일이 저장될 디렉토리 경로를 지정합니다.
    cb(null, 'src/DashcamCleaner/');
  },
  filename: function (req:Request, file: { originalname: any; }, cb: (arg0: null, arg1: any) => void) {
    // 파일의 이름을 지정합니다.
    cb(null, file.originalname);
  }
});

