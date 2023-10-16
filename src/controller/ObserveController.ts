import { type NextFunction, type Request, type Response } from 'express';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3, accessKey, secretAccessKey, bucketRegion } from '../utils/aws-s3';
import { type registerObserveRequest, type video } from '../interface/observe';
import { readObserveOnTheMap, insertVideoStatus, findVideoId, createObserve, insertThumbnailUrl, findvideoInfo, findregisterObserveInfo, findObserveDetailInfo } from '../service/ObserveService';

import AWS from 'aws-sdk';
import fs from 'fs';
import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';
import { path as ffprobePath } from '@ffprobe-installer/ffprobe';
import ffmpeg from 'fluent-ffmpeg';
ffmpeg.setFfprobePath(ffprobePath);
ffmpeg.setFfmpegPath(ffmpegPath);

AWS.config.update({
  accessKeyId: accessKey,
  secretAccessKey,
  region: bucketRegion
});

export const uploadVideo = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  try {
    const uploadedVideo: video = req.file as Express.Multer.File;

    const uploadedVideoOriginalName: string = uploadedVideo.originalname;

    await insertVideoStatus(uploadedVideoOriginalName);

    const videoId = await findVideoId(uploadedVideoOriginalName);

    if (videoId === undefined) {
      return res.status(500).json({
        ok: false,
        msg: '해당 비디오가 존재하지 않습니다.'
      });
    } else {
      next();

      return res.status(200).json({
        ok: true,
        msg: 'This is uploaded videoId',
        videoId
      });
    }
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      ok: false,
      msg: 'INTERNAL SERVER ERROR'
    });
  }
};

export const getObserveOnTheMap = async (req: CustomRequest, res: Response) => {
  try {
    const { x, y, radius } = req.query;

    const xCoord: number = parseFloat(x as string);
    const yCoord: number = parseFloat(y as string);
    const radiusValue: number = parseFloat(radius as string);

    if (isNaN(xCoord) || isNaN(yCoord) || isNaN(radiusValue)) {
      return res.status(400).json({ ok: false, msg: 'Invalid values for x, y, or radius' });
    }

    const Obj: LocationObject = { x: xCoord, y: yCoord, radius: radiusValue };

    const resData: ApiResponse = await readObserveOnTheMap(Obj);

    res.status(200).json(resData);
  } catch (err) {
    console.error('Error:', err);
    const resData: ApiResponse = {
      ok: false,
      msg: 'INTERNAL SERVER ERROR'
    };
    return res.status(500).json(resData);
  }
};

export const videoProcessing = async (req: Request, res: Response): Promise<void> => {
  try {
    const uploadedVideo: video = req.file as Express.Multer.File;
    const uploadedVideoOriginalName: string = uploadedVideo.originalname;
    // const fileExtension = path.extname(uploadedVideoOriginalName);
    // const videoOutputFileName = `${uploadedVideoOriginalName}_${Date.now()}${fileExtension}`;

    const scriptDirectory = 'DashcamCleaner';
    process.chdir(scriptDirectory);

    // const mosaicCommand = `python3 cli.py -i ${uploadedVideoOriginalName} -o ${videoOutputFileName} -w 360p_nano_v8.pt`

    // await updateVideoStautsToBlurringStart(uploadedVideoOriginalName);

    // // execute child_process to do processig of mosaic
    // const blurringDoneVideo = exec(mosaicCommand, async (error, stdout, stderr) => {

    //   if (error) {
    //     console.log(`error: ${error.message}`);
    //   }
    //   else if (stderr) {
    //     console.log(`stderr: ${stderr}`);
    //   }
    //   else {

    //     console.log('stdout:', stdout);
    //   }

    //   if (blurringDoneVideo) {

    //     await updateVideoStautsToBlurringDone(uploadedVideoOriginalName);
    //     await updateVideoUrlToOutputFileName(uploadedVideoOriginalName, videoOutputFileName);

    const uploadParams = {
      Bucket: 'batshu-observe-input',
      Key: uploadedVideoOriginalName,
      Body: fs.createReadStream(uploadedVideoOriginalName)
    };

    // generate Thumbnail
    try {
      const currentWorkingDirectory = process.cwd();
      console.log(currentWorkingDirectory);
      const thumbnailFileName = `thumbnail_${Date.now()}To${uploadedVideoOriginalName}.png`;

      await new Promise((resolve, reject) => {
        ffmpeg(uploadedVideoOriginalName, {
        })
          .thumbnail({
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
        Body: fs.createReadStream(thumbnailFilePath)
      };

      const uploadThumbnailcommand = new PutObjectCommand(thumbnailUploadParams);
      await s3.send(uploadThumbnailcommand);

      const command = new PutObjectCommand(uploadParams);
      await s3.send(command);

      const videoLocationUrl = `https://batshu-observe-input.s3.amazonaws.com/${uploadedVideoOriginalName}`;

      const thumbnailLocationUrl = `https://batshu-observe-input.s3.amazonaws.com/${thumbnailFileName}`;

      // const mosaicedFinalVideoUrl = await insertMosaicedFinalVideoUrl//(videoOutputFileName, videoLocationUrl);

      await insertThumbnailUrl(uploadedVideoOriginalName, videoLocationUrl, thumbnailLocationUrl);
    } catch (error) {
      console.log(error);
    }

    // } else {
    //   console.log("blurringDoneVideo is not defined");
    //  }

    //  })
  } catch (error) {
    console.error('Error:', error);
    const resData: ApiResponse = {
      ok: false,
      msg: 'INTERNAL SERVER ERROR'
    };
    res.status(500).json(resData);
  }
};

export const registerObserve = async (req: CustomRequest, res: Response): Promise<Response> => {
  try {
    if (typeof req.uid === 'string') {
      const uid: string = req.uid;

      const registerObserveData: registerObserveRequest = {

        contentTitle: req.body.contentTitle,
        contentDescription: req.body.contentDescription,
        videoId: req.body.videoId,
        carModelName: req.body.carModelName,
        licensePlate: req.body.licensePlate,
        placeName: req.body.placeName,
        observeTime: req.body.observeTime,
        accidentLocation: req.body.observeLocation,
        uid

      };

      await createObserve(registerObserveData);

      const videoInfo: any = await findvideoInfo(registerObserveData.videoId);
      const registerObserveInfo: any = await findregisterObserveInfo(registerObserveData.videoId);

      return res.status(200).json({
        ok: true,
        msg: 'Successfully registered',
        data: {
          observeId: registerObserveInfo[0].id,
          uid: registerObserveInfo[0].uid,
          videoUrl: videoInfo[0].video_url,
          thumbnailUrl: videoInfo[0].thumbnail_url,
          contentTitle: registerObserveInfo[0].content_title,
          contentDescription: registerObserveInfo[0].content_description,
          observeStartTime: registerObserveInfo[0].observe_start_time,
          observeEndTime: registerObserveInfo[0].observe_end_time,
          observeLocation: registerObserveInfo[0].observe_location,
          createdAt: registerObserveInfo[0].created_at
        }

      });
    }
  } catch (err) {
    console.log(err);
    // Handle errors or return an appropriate response for errors.
    return res.status(500).json({
      ok: false,
      msg: 'INTERNAL SERVER ERROR'
    });
  }
};

// TODO: make function to get videoUrl by videoId

export const getObserveInfoByObserveId = async (req: Request, res: Response): Promise<Response> => {
  try {
    const observeId: number = parseInt(req.params.observeId);

    const oberseveInfo = await findObserveDetailInfo(observeId);

    return res.status(200).json({
      ok: true,
      msg: 'Successfully Get',
      data: oberseveInfo
    });
  } catch (error) {
    console.error('Error:', error);
    const resData: ApiResponse = {
      ok: false,
      msg: 'INTERNAL SERVER ERROR'
    };
    return res.status(500).json(resData);
  }
};
