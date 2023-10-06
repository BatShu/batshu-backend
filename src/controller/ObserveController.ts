import { NextFunction, Request, Response } from "express";
import { exec } from 'child_process'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { insertVideoStatus, findVideoId, updateVideoStautsToBlurringStart, updateVideoStautsToBlurringDone } from "../service/ObserveService";

declare global {
  interface LocationObject {
    x : number;
    y : number;
    radius? : number;
  }

  interface video {

    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    destination: string;
    path: string;
    filename: string;
    size: number;
  }

}


export const uploadVideo = async (req:Request, res: Response, next: NextFunction) => {
  
  try {

    const uploadedVideo: video = req.file as Express.Multer.File;
  
    const uploadedVideoOriginalName: string = uploadedVideo.originalname;
  
    const updateUploadedVideoStatus = await insertVideoStatus(uploadedVideoOriginalName);
   
    const videoId  = await findVideoId(uploadedVideoOriginalName);
  
    if (!videoId) {
      return res.status(500).json({
        ok: false,
        msg: "해당 비디오가 존재하지 않습니다."
      })
    } else { 

      next();
      
      return res.status(200).json({
        ok: true,
        msg: "This is uploaded videoId",
        videoId: videoId,      
      })        

    }

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      ok: false,
      msg: "INTERNAL SERVER ERROR"
    });

  }

}



export const mosaicProcessing = async (req:Request, res: Response) => {

  try {
    
    const uploadedVideo: video = req.file as Express.Multer.File;
  
    const uploadedVideoOriginalName: string = uploadedVideo.originalname;

    const outputFileName = 'blurred_video.mp4'

   //const scriptDirectory = '/Users/jincheol/Desktop/BatShu-backend/src/DashcamCleaner';
   const scriptDirectory = './src/DashcamCleaner';

    process.chdir(scriptDirectory);

    const mosaicCommand = `python cli.py -i ${uploadedVideoOriginalName} -o ${outputFileName} -w 720p_nano_v8.pt -bw 3 -t 0.6`;
    
    await updateVideoStautsToBlurringStart(uploadedVideoOriginalName);

    // execute child_process to do processig of mosaic
    const blurringDoneVideo = exec(mosaicCommand, async (error, stdout, stderr) => {
    
      if (error) {
        console.log(`error: ${error.message}`);
      }
      else if (stderr) {
        console.log(`stderr: ${stderr}`);
      }
      else {

        console.log('stdout:', stdout); // 외부 명령어의 표준 출력을 콘솔에 출력
      }

      if (blurringDoneVideo) {
        await updateVideoStautsToBlurringDone(uploadedVideoOriginalName);
      }

    })

  } catch (error) {
    console.error('Error:', error);
    const resData: ApiResponse = {
       ok: false,
       msg: "INTERNAL SERVER ERROR"
    }
    res.status(500).json(resData);
  }
}



export const registerObserve = async (req:Request, res: Response) => {

}

export const getObserve = async (req:Request, res: Response) => {
    try{
      console.log(req.params.observeId);
  
    } catch (error) {
      console.error('Error:', error);
      const resData: ApiResponse = {
          ok: false,
          msg: "INTERNAL SERVER ERROR"
      }
      res.status(500).json(resData);
    }
  }
