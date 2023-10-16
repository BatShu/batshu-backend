import { type Request } from 'express';
import multer from 'multer';
import AWS from 'aws-sdk';
import multerS3 from 'multer-s3';
import path from 'path';
import { S3Client } from '@aws-sdk/client-s3';

export const accessKey: string = process.env.ACCESS_KEY_JC!;
export const secretAccessKey: string = process.env.SECRET_ACCESS_KEY_JC!;
export const bucketRegion: string = process.env.BUCKET_REGION!;

const s3params = {
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey
  },
  region: bucketRegion
};

export const S3 = new S3Client(s3params);

AWS.config.update({
  accessKeyId: accessKey,
  secretAccessKey,
  region: bucketRegion
});

//* AWS S3 multer 설정
export const s3Upload = multer({
  storage: multerS3({
    s3: new AWS.S3(),
    bucket: 'batshu-observe-input',
    acl: 'private',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key (req: Request, file: { originalname: any }, cb: (arg0: null, arg1: string) => void) {
      cb(null, `${Date.now()}_${path.basename(file.originalname)}`);
    }
  })
});

// 확장자 필터 함수 정의
export const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedExtensions = ['mp4', 'wmv', 'mov', 'avi', 'dat'];
  const fileExtension = String(file.originalname.split('.').pop()); // 문자열로 형변환

  if (allowedExtensions.includes(fileExtension)) {
    // 허용된 확장자인 경우
    cb(null, true); // 파일 허용
  } else {
    // 허용되지 않은 확장자인 경우
    cb(null, false); // 파일 거부
  }
};

export const localStorage = multer.diskStorage({
  destination: function (req: Request, file: any, cb: (arg0: null, arg1: string) => void) {
    // 파일이 저장될 디렉토리 경로를 지정합니다.
    cb(null, 'DashcamCleaner');
  },
  filename: function (req: Request, file: { originalname: any }, cb: (arg0: null, arg1: any) => void) {
    // 파일의 이름을 지정합니다.
    cb(null, file.originalname);
  }
});
