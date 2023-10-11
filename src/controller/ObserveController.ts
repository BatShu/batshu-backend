import { NextFunction, Request, Response } from "express";
import * as path from 'path';
import { exec } from 'child_process'
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { S3, accessKey, secretAccessKey, bucketRegion } from "../utils/aws-s3";
import { registerObserveRequest, reigsterObserveResponse, video } from "../interface/observe";
import CustomRequest from "../auth/auth";
import { insertVideoStatus, findVideoId, updateVideoStautsToBlurringStart, updateVideoStautsToBlurringDone, createObserve, insertMosaicedFinalVideoUrl, updateVideoUrlToOutputFileName, insertThumbnailUrl, findvideoInfo, findregisterObserveInfo } from "../service/ObserveService";

const AWS = require('aws-sdk');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');


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
    
    const resData:ApiResponse = await observeService.readObserveOnTheMap(Obj);

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

export const videoProcessing = async (req:Request, res: Response) => {

  try {
    
    const uploadedVideo: video = req.file as Express.Multer.File;
  
    const uploadedVideoOriginalName: string = uploadedVideo.originalname;

    const fileExtension = path.extname(uploadedVideoOriginalName);

    const videoOutputFileName = `${uploadedVideoOriginalName}_${Date.now()}${fileExtension}`;

    console.log(process.cwd());
   
    //const scriptDirectory = './src/DashcamCleaner';
   
    //process.chdir(scriptDirectory);
    
    const mosaicCommand = `python cli.py -i ${uploadedVideoOriginalName} -o ${videoOutputFileName} -w 360p_nano_v8.pt`
    
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
        await updateVideoUrlToOutputFileName(uploadedVideoOriginalName, videoOutputFileName);
        
        const uploadParams = {
          Bucket: 'batshu-observe-input', 
          Key: videoOutputFileName, 
          Body: fs.createReadStream(videoOutputFileName), 
        };
        
        
        //generate Thumbnail
        try {

          const currentWorkingDirectory = process.cwd();
          const thumbnailFileName = `thumbnail_${Date.now()}To${uploadedVideoOriginalName}.png`;

          const thumbnailInfo: any = await new Promise((resolve, reject) => { 
            ffmpeg(videoOutputFileName)
              .screenshots({
                timestamps: ['50%'],
                filename: thumbnailFileName,
                folder: currentWorkingDirectory,
                size: '320x240'
            })
            .on('end', (stdout: unknown, stderr: any) => {
              console.log('썸네일 추출 완료');
              resolve(stdout);

            })
            .on('error', (err: any) => {
              console.error('썸네일 추출 오류:', err);
              reject(err);

            });
        });

          const thumbnailFilePath = `${currentWorkingDirectory}/${thumbnailFileName}`;
            
          const thumbnailUploadParams = {
            Bucket: 'batshu-observe-input',
            Key: thumbnailFileName,
            Body: fs.createReadStream(thumbnailFilePath),
          };

          const uploadThumbnailcommand = new PutObjectCommand(thumbnailUploadParams);
          await S3.send(uploadThumbnailcommand);

          const command = new PutObjectCommand(uploadParams);
          await S3.send(command);

          const videoLocationUrl = `https://batshu-observe-input.s3.amazonaws.com/${videoOutputFileName}`;

          const thumbnailLocationUrl = `https://batshu-observe-input.s3.amazonaws.com/${thumbnailFileName}`;
          

          const mosaicedFinalVideoUrl = await insertMosaicedFinalVideoUrl(videoOutputFileName, videoLocationUrl);
          
          const thumbnail = await insertThumbnailUrl(videoLocationUrl, thumbnailLocationUrl);
          
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
    carModelName: req.body.carModelName,
    licensePlate: req.body.licensePlate,
    placeName: req.body.placeName,
    observeTime: req.body.observeTime,
    accidentLocation: req.body.observeLocation,
    uid: uid,
  
  }


  const registerObserveResult = await createObserve(registerObserveData);

  const videoInfo : any = await findvideoInfo(registerObserveData.videoId);
  const registerObserveInfo : any = await findregisterObserveInfo(registerObserveData.videoId);

  return res.status(200).json({
    ok: true,
    msg: "Successfully registered",
    data: {
      observeId: registerObserveInfo[0].id,
      uid : registerObserveInfo[0].uid,
      videoUrl: videoInfo[0].video_url,
      thumbnailUrl: videoInfo[0].thumbnail_url,
      contentTitle: registerObserveInfo[0].content_title,
      contentDescription: registerObserveInfo[0].content_description,
      observeStartTime: registerObserveInfo[0].observe_start_time,
      observeEndTime: registerObserveInfo[0].observe_end_time,
      observeLocation: registerObserveInfo[0].observe_location,
      createdAt: registerObserveInfo[0].created_at,
    }
    
  });

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
