import { type RowDataPacket, type FieldPacket } from 'mysql2';
import pool from '../config/database';
import { type LocationRow } from '../interface/both';
import { type videoInfo, type registerObserveRequest, type RegisterObserveResponse, type videoId } from '../interface/observe';
import { updateVideoStatus, findUploadedVideoId, updateVideoStatusWithBlurring, updateVideoStatusWithBlurringDone, createObserveData, selectObserveOnTheMapRow, insertMosaicedVideoUrlResult, updateVideoUrlToOutputFileNameResult, insertThumbnailUrlResult, selectVideoInfo, selectfindregisterObserveInfo, insertVideoName, selectObserveInfoByObserveId } from '../Repository/ObserveRepository';
import { type ApiResponse } from 'src/domain/response';

type TPacket = ResultSetHeader | RowDataPacket | FieldPacket[] ;

export const insertVideoStatus = async (uploadedVideoOriginalName: string): Promise<ResultSetHeader> => {
  const conneciton = await pool.getConnection();
  const updatedVideoStatus = await updateVideoStatus(conneciton, uploadedVideoOriginalName);
  conneciton.release();

  return updatedVideoStatus;
};

export const findVideoId = async (uploadedVideoOriginalName: string): Promise<videoId[]> => {
  const conneciton = await pool.getConnection();
  const uploadedVideoId = await findUploadedVideoId(conneciton, uploadedVideoOriginalName);
  conneciton.release();

  return uploadedVideoId;
};

export const insertUploadedVideoOriginalName = async (uploadedVideoOriginalName: string): Promise<TPacket> => {
  const conneciton = await pool.getConnection();
  const videoName = await insertVideoName(conneciton, uploadedVideoOriginalName);
  conneciton.release();

  return videoName;
};

export const updateVideoStautsToBlurringStart = async (uploadedVideoOriginalName: string): Promise<TPacket> => {
  const conneciton = await pool.getConnection();
  const updateUploadedVideoStatus = await updateVideoStatusWithBlurring(conneciton, uploadedVideoOriginalName);
  conneciton.release();

  return updateUploadedVideoStatus;
};

export const updateVideoStautsToBlurringDone = async (uploadedVideoOriginalName: string): Promise<TPacket> => {
  const conneciton = await pool.getConnection();
  const updateUploadedVideoStatus = await updateVideoStatusWithBlurringDone(conneciton, uploadedVideoOriginalName);
  conneciton.release();

  return updateUploadedVideoStatus;
};

export const createObserve = async (registerObserveData: registerObserveRequest): Promise<TPacket> => {
  const conneciton = await pool.getConnection();
  const observeData = await createObserveData(conneciton, registerObserveData);
  conneciton.release();

  return observeData;
};

export const insertMosaicedFinalVideoUrl = async (videoOutputFileName: string, mosaicedVideoUrl: string): Promise<TPacket> => {
  const conneciton = await pool.getConnection();
  const mosaicedVideo = await insertMosaicedVideoUrlResult(conneciton, videoOutputFileName, mosaicedVideoUrl);
  conneciton.release();

  return mosaicedVideo;
};

export const updateVideoUrlToOutputFileName = async (uploadedVideoOriginalName: string, outputFileName: string): Promise<TPacket> => {
  const conneciton = await pool.getConnection();
  const updateVideoUrl = await updateVideoUrlToOutputFileNameResult(conneciton, uploadedVideoOriginalName, outputFileName);
  conneciton.release();

  return updateVideoUrl;
};

export const insertThumbnailUrl = async (uploadedVideoOriginalName: string, videoLocationUrl: string, thumbnailLocationUrl: string): Promise<TPacket> => {
  const conneciton = await pool.getConnection();
  const thumbnail = await insertThumbnailUrlResult(conneciton, uploadedVideoOriginalName, videoLocationUrl, thumbnailLocationUrl);
  conneciton.release();

  return thumbnail;
};

export const findvideoInfo = async (videoId: number): Promise<videoInfo[]> => {
  const conneciton = await pool.getConnection();
  const videoInfo = await selectVideoInfo(conneciton, videoId);
  conneciton.release();

  return videoInfo;
};

export const findregisterObserveInfo = async (videoId: number): Promise<RegisterObserveResponse[]> => {
  const conneciton = await pool.getConnection();
  const createdAt = await selectfindregisterObserveInfo(conneciton, videoId);
  conneciton.release();

  return createdAt;
};

export const findObserveDetailInfo = async (observeId: number): Promise<TPacket> => {
  const conneciton = await pool.getConnection();
  const observeDetailInfo = await selectObserveInfoByObserveId(conneciton, observeId);
  conneciton.release();

  return observeDetailInfo;
};

export const readObserveOnTheMap = async (locationObject: LocationObject): Promise<ApiResponse> => {
  try {
    const observeRows = await selectObserveOnTheMapRow(locationObject) as LocationRow[];

    const data: ObserveLocationObject[] = [];

    for (const observeRow of observeRows) {
      const location: LocationObject = {
        x: observeRow.x,
        y: observeRow.y
      };
      const observeLocationObject: ObserveLocationObject = {
        observeId: observeRow.id,
        observeLocation: location
      };
      data.push(observeLocationObject);
    }

    const resData = {
      ok: true,
      msg: 'Successfully Get',
      data
    };
    return resData;
  } catch (error) {
    const resData: ApiResponse = {
      ok: false,
      msg: 'INTERNAL SERVER ERROR'
    };
    return resData;
  }
};
