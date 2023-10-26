import { type Request, type Response } from 'express';

import { PutObjectCommand, S3Client, type S3ClientConfig } from '@aws-sdk/client-s3';

import dotenv from 'dotenv';

import { createAccident, readAccident, readAccidentOnTheMap } from '../service/AccidentService';
import crypto from 'crypto';
import AWS from 'aws-sdk';
import { type ApiResponse } from 'src/domain/response';

declare global {
  interface LocationObject {
    x: number
    y: number
    radius?: number
  }

  interface Accident {
    contentTitle: string
    contentDescription: string
    photoUrls: string[]
    accidentTime: Date[]
    createdAt?: Date
    accidentLocation: LocationObject
    placeName: string
    carModelName?: string
    licensePlate?: string
    uid?: string
    bounty: number
  }

  interface AccidentPhoto {
    photoUrl: string
    accidentId: number
  }

  interface AccidentLocationObject {
    accidentId: number
    accidentLocation: LocationObject
  }

  interface ObserveLocationObject {
    observeId: number
    observeLocation: LocationObject
  }

  interface imageData {
    fieldname: string
    originalname: string
    encoding: string
    mimetype: string
    buffer: Buffer
    size: number
  }

  interface ResultSetHeader {
    fieldCount: number
    affectedRows: number
    insertId: number
    info: string
    serverStatus: number
    warningStatus: number
  }
}

dotenv.config();

const bucketName: string = process.env.BUCKET_NAME_HARAM ?? '';
const accessKey: string = process.env.ACCESS_KEY_HARAM ?? '';
const secretAccessKey: string = process.env.SECRET_ACCESS_KEY_HARAM ?? '';

AWS.config.update({
  accessKeyId: accessKey, // AWS Access Key ID를 여기에 입력
  secretAccessKey, // AWS Secret Access Key를 여기에 입력
  region: 'ap-northeast-2' // 사용하는 AWS 지역을 여기에 입력
});

const s3params: S3ClientConfig = {
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey
  },
  region: 'ap-northeast-2'
};

const s3 = new S3Client(s3params);

export const getAccidentOnTheMap = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const { x, y, radius } = req.query;

    const xCoord: number = parseFloat(x as string);
    const yCoord: number = parseFloat(y as string);
    const radiusValue: number = parseFloat(radius as string);

    if (isNaN(xCoord) || isNaN(yCoord) || isNaN(radiusValue)) {
      res.status(400).json({ ok: false, msg: 'Invalid values for x, y, or radius' });
      return;
    }

    if (radiusValue >= 500){
      const resData: ApiResponse = {
        ok: false,
        msg: 'max radius = 500m'
      };
      res.status(401).json(resData);
    }

    const Obj: LocationObject = { x: xCoord, y: yCoord, radius: radiusValue };

    const resData: ApiResponse = await readAccidentOnTheMap(Obj);

    res.status(200).json(resData);
  } catch (err) {
    console.error('Error:', err);
    const resData: ApiResponse = {
      ok: false,
      msg: 'INTERNAL SERVER ERROR'
    };
    res.status(500).json(resData);
  }
};

export const postAccident = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    if (typeof req.uid === 'string') {
      const images: imageData[] = req.files as Express.Multer.File[];

      const uid: string = req.uid;
      const photoUrls: string[] = [];

      for (const img of images) {
        const fileName: string = crypto.randomBytes(16).toString('hex');
        const params = {
          Bucket: bucketName,
          Key: `${fileName}.${img.originalname.split('.').pop()}`,
          Body: img.buffer,
          ContentType: img.mimetype
        };

        photoUrls.push(`https://${params.Bucket}.s3.amazonaws.com/${params.Key}`);

        const command = new PutObjectCommand(params);
        await s3.send(command);
      }

      const passedData: Accident = {
        contentTitle: req.body.contentTitle,
        contentDescription: req.body.contentDescription,
        photoUrls,
        accidentTime: req.body.accidentTime,
        accidentLocation: req.body.accidentLocation,
        placeName: req.body.placeName,
        carModelName: req.body.carModelName,
        licensePlate: req.body.licensePlate,
        uid,
        bounty: req.body.bounty
      };

      const resData: ApiResponse = await createAccident(passedData);
      res.status(200).json(resData);
    }
  } catch (error) {
    console.error('Error:', error);
    const resData: ApiResponse = {
      ok: false,
      msg: 'INTERNAL SERVER ERROR'
    };
    res.status(500).json(resData);
  }
};

export const getAccident = async (req: Request, res: Response): Promise<void> => {
  try {
    const accidentId: number = parseInt(req.params.accidentId, 10);
    const resData: ApiResponse = await readAccident(accidentId);

    res.status(200).json(resData);
  } catch (error) {
    console.error('Error:', error);
    const resData: ApiResponse = {
      ok: false,
      msg: 'INTERNAL SERVER ERROR'
    };
    res.status(500).json(resData);
    throw error;
  }
};

export default { getAccidentOnTheMap, postAccident, getAccident };
