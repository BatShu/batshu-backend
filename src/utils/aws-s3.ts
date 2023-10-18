import type { Request } from 'express';
import multer, { type FileFilterCallback } from 'multer';
import AWS from 'aws-sdk';
import multerS3 from 'multer-s3';
import path from 'path';
import { S3, type S3ClientConfig } from '@aws-sdk/client-s3';

export type { FileFilterCallback };

export const accessKeyId: string = process.env.ACCESS_KEY_JC ?? '';
export const secretAccessKey: string = process.env.SECRET_ACCESS_KEY_JC ?? '';
export const bucketRegion: string = process.env.BUCKET_REGION ?? '';

const s3params: S3ClientConfig = {
  credentials: {
    accessKeyId,
    secretAccessKey
  },
  region: bucketRegion
};

export const s3: S3 = new S3(s3params);

AWS.config.update({
  accessKeyId,
  secretAccessKey,
  region: bucketRegion
});

export const s3Upload = multer({
  storage: multerS3({
    s3,
    bucket: 'batshu-observe-input',
    acl: 'private',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key (req: Request, { originalname }: { originalname: any }, cb: (arg0: null, arg1: string) => void) {
      cb(null, `${Date.now()}_${path.basename(originalname)}`);
    }
  })
});

export const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  const allowedExtensions = ['mp4', 'wmv', 'mov', 'avi', 'dat'];
  const fileExtension = String(file.originalname.split('.').pop());

  if (allowedExtensions.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const localStorage = multer.diskStorage({
  destination (req: Request, file: any, cb: (arg0: null, arg1: string) => void) {
    cb(null, 'DashcamCleaner');
  },
  filename (req: Request, { originalname }: { originalname: any }, cb: (arg0: null, arg1: any) => void) {
    cb(null, originalname);
  }
});
