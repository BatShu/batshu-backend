import { NextFunction, Request, Response } from "express";
import { exec } from 'child_process'
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { S3, accessKey, secretAccessKey, bucketRegion } from "../utils/aws-s3";
import { registerObserveRequest, reigsterObserveResponse, video } from "../interface/observe";
import CustomRequest from "../auth/auth";
import { insertVideoStatus, findVideoId, updateVideoStautsToBlurringStart, updateVideoStautsToBlurringDone, createObserve } from "../service/ObserveService";

const AWS = require('aws-sdk');
const path = require('path');

AWS.config.update({
  accessKeyId: accessKey,       
  secretAccessKey: secretAccessKey,  
  region: bucketRegion,             
});

const s3 = new AWS.S3();

const observeService = require("../service/ObserveService");


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

export const getObserveOnTheMap =async (req:CustomRequest,res:Response) => {
  try {
    const { x, y, radius } = req.query;

    const xCoord:number = parseFloat(x as string);
    const yCoord:number = parseFloat(y as string);
    const radiusValue:number = parseFloat(radius as string);


    if (isNaN(xCoord) || isNaN(yCoord) || isNaN(radiusValue)) {
      return res.status(400).json({ ok: false, msg: 'Invalid values for x, y, or radius' });
    }

    const Obj:LocationObject = { x: xCoord, y: yCoord, radius: radiusValue };
    
    const resData:ApiResponse = await observeService.readAccidentOnTheMap(Obj);

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

export const mosaicProcessing = async (req:Request, res: Response) => {

  try {
    
    const uploadedVideo: video = req.file as Express.Multer.File;
  
    const uploadedVideoOriginalName: string = uploadedVideo.originalname;

    const fileExtension = path.extname(uploadedVideoOriginalName);

    const outputFileName = `blurred_video_${Date.now()}${fileExtension}`;

   const scriptDirectory = './src/DashcamCleaner';

    process.chdir(scriptDirectory);

    const mosaicCommand = `python cli.py -i ${uploadedVideoOriginalName} -o ${outputFileName} -w 360p_nano_v8.pt`
    
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
        
        console.log('stdout:', stdout); 
      }

      if (blurringDoneVideo) {
        await updateVideoStautsToBlurringDone(uploadedVideoOriginalName);
        
        const uploadParams = {
          Bucket: 'batshu-observe-input', 
          Key: outputFileName, 
          Body: outputFileName,
        };

        try {
          const command = new PutObjectCommand(uploadParams);
          await S3.send(command);


          // get S3 video url
          const params = { Bucket: 'batshu-observe-input', Key: outputFileName };


          const url = await s3.getSignedUrlPromise('getObject', params);
          
          //TODO: url insert to database

        } catch (error) {
          console.log(error);
        }
        
      } else {
        console.log("blurringDoneVideo is not defined");
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



export const registerObserve = async (req: CustomRequest, res: Response) => {

  try {

  if (typeof req.uid === 'string') {

  const uid : string = req.uid;

  const registerObserveData: registerObserveRequest = {

    contentTitle: req.body.contentTitle,
    contentDescription: req.body.contentDescription,
    videoId: req.body.videoId,
    observeTime: req.body.observeTime,
    accidentLocation: req.body.observeLocation,
    uid: uid,
  
  }

  const registerObserveResult = await createObserve(registerObserveData);

// const finalVideo = await findFinalVideoByVideoId(registerObserveData.videoId);

    //TODO: add video url to response

    // const resData: reigsterObserveResponse = {
    //   ok: true,
    //   msg: "Successfully reegister observe data",
    //   videoUrl: findVideo,
    //   thumbnailUrl: "",
    //   createdAt: registerObserveResult.createdAt,
    // }

}
  } catch(err) {
    console.log(err);
  }

}



//TODO: make function to get videoUrl by videoId


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
