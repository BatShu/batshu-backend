import type { FieldPacket, PoolConnection } from 'mysql2/promise';
import { type registerObserveRequest, type videoId, type RegisterObserveResponse, type videoInfo, type observeInformationByVideoIdReponse, type ObservePlaceNameRow } from '../interface/observe';
import { type LocationRow } from '../interface/both';
import pool from '../config/database';

export const selectObserveOnTheMapRow = async (locationObject: LocationObject): Promise<LocationRow[]> => {
  try {
    const connection = await pool.getConnection();
    const observeSelectQuery: string = `
    SELECT id, ST_X(observe_location) AS x, ST_Y(observe_location) AS y
    FROM observe
    WHERE ST_Distance_Sphere(
      observe_location,
      POINT(${locationObject.x}, ${locationObject.y})
    ) <= ?;`;
    const [observeRows]: [LocationRow[], FieldPacket[]] = await connection.execute<LocationRow[]>(observeSelectQuery, [
      locationObject.radius
    ]);
    connection.release();
    return observeRows;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 비디오 업로드.
export const updateVideoStatus = async (connection: PoolConnection, uploadedVideoOriginalName: string): Promise<ResultSetHeader> => {
  const updateVideoStatusQuery = 'INSERT INTO video (status, video_url) VALUES (?, ?);';
  const [updateVideoStatusRows]: any = await connection.query(updateVideoStatusQuery, ['uploaded', uploadedVideoOriginalName]);
  return updateVideoStatusRows;
};

export const insertVideoName = async (connection: PoolConnection, uploadedVideoOriginalName: string): Promise<ResultSetHeader> => {
  const insertVideoNameQuery = 'INSERT INTO video (video_url) VALUES (?);';
  const [insertVideoNameRows]: any = await connection.query(insertVideoNameQuery, [uploadedVideoOriginalName]);
  return insertVideoNameRows;
};

export const findUploadedVideoId = async (connection: PoolConnection, uploadedVideoOriginalName: string): Promise<videoId[]> => {
  const findUploadedVideoIdQuery = 'SELECT id FROM video WHERE video_url = ?;';
  const [findUploadedVideoIdRows]: [videoId[], FieldPacket[]] = await connection.query<videoId[]>(findUploadedVideoIdQuery, [uploadedVideoOriginalName]);
  return findUploadedVideoIdRows;
};

export const updateVideoStatusWithBlurring = async (connection: PoolConnection, uploadedVideoOriginalName: string): Promise<ResultSetHeader> => {
  const updateVideoStatusWithBlurringStartQuery = 'UPDATE video SET status = ? WHERE video_url = ?;';
  const [updateVideoStatusWithBlurringStartRows]: any = await connection.query(updateVideoStatusWithBlurringStartQuery, ['blurring', uploadedVideoOriginalName]);
  return updateVideoStatusWithBlurringStartRows;
};

export const updateVideoStatusWithBlurringDone = async (connection: PoolConnection, uploadedVideoOriginalName: string): Promise<ResultSetHeader> => {
  const updateVideoStatusWithBlurringDoneQuery = 'UPDATE video SET status = ? WHERE video_url = ?;';
  const [updateVideoStatusWithBlurringDoneRows]: any = await connection.query(updateVideoStatusWithBlurringDoneQuery, ['blurringDone', uploadedVideoOriginalName]);
  return updateVideoStatusWithBlurringDoneRows;
};

export const insertMosaicedVideoUrlResult = async (connection: PoolConnection, videoOutputFileName: string, mosaicedVideoUrl: string): Promise<ResultSetHeader> => {
  const insertMosaicedVideoUrlQuery = 'UPDATE video SET video_url = ? WHERE video_url = ?;';
  const [insertMosaicedVideoUrlRows]: any = await connection.query(insertMosaicedVideoUrlQuery, [mosaicedVideoUrl, videoOutputFileName]);
  return insertMosaicedVideoUrlRows;
};

export const updateVideoUrlToOutputFileNameResult = async (connection: PoolConnection, uploadedVideoOriginalName: string, outputFileName: string): Promise<ResultSetHeader> => {
  const updateVideoUrlToOutputFileNameQuery = 'UPDATE video SET video_url = ? WHERE video_url = ?;';
  const [updateVideoUrlToOutputFileNameRows]: any = await connection.query(updateVideoUrlToOutputFileNameQuery, [outputFileName, uploadedVideoOriginalName]);
  return updateVideoUrlToOutputFileNameRows;
};

export const insertThumbnailUrlResult = async (connection: PoolConnection, uploadedVideoOriginalName: string, videoLocationUrl: string, thumbnailLocationUrl: string): Promise<ResultSetHeader> => {
  const updateThumbnailUrlQuery = 'UPDATE video SET video_url = ?, thumbnail_url = ? WHERE video_url = ?;';
  const [insertThumbnailUrlRows]: any = await connection.query(updateThumbnailUrlQuery, [videoLocationUrl, thumbnailLocationUrl, uploadedVideoOriginalName]);
  return insertThumbnailUrlRows;
};

export const selectVideoInfo = async (connection: PoolConnection, videoId: number): Promise<videoInfo[]> => {
  const selectVideoInfoQuery = 'SELECT id, video_url, thumbnail_url FROM video WHERE id = ?;';
  const [selectVideoInfoRows]: [videoInfo[], FieldPacket[]] = await connection.query<videoInfo[]>(selectVideoInfoQuery, [videoId]);
  return selectVideoInfoRows;
};

export const createObserveData = async (connection: PoolConnection, registerObserveData: registerObserveRequest): Promise<ResultSetHeader> => {
  const createObserveQuery = 'INSERT INTO observe (content_title, content_description, video_id, car_model_name, license_plate, place_name, observe_start_time, observe_end_time, observe_location, created_at, uid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, POINT(?, ?), NOW(), ?);';
  const [results]: any = await connection.query(createObserveQuery, [
    registerObserveData.contentTitle,
    registerObserveData.contentDescription,
    registerObserveData.videoId,
    registerObserveData.carModelName,
    registerObserveData.licensePlate,
    registerObserveData.placeName,
    registerObserveData.observeTime[0],
    registerObserveData.observeTime[1],
    registerObserveData.observeLocation.x,
    registerObserveData.observeLocation.y,
    registerObserveData.uid
  ]);
  return results;
};

export const selectfindregisterObserveInfo = async (connection: PoolConnection, videoId: number): Promise<RegisterObserveResponse[]> => {
  const selectCreatedAtQuery = 'SELECT * FROM observe WHERE video_id = ?;';
  const [selectCreatedAtRows]: [RegisterObserveResponse[], FieldPacket[]] = await connection.query<RegisterObserveResponse[]>(selectCreatedAtQuery, [videoId]);
  return selectCreatedAtRows;
};

export const selectObserveInfoByVideoId = async (connection: PoolConnection, videoId: number): Promise<observeInformationByVideoIdReponse[]> => {
  const selectObserveInfoByObserveIdQuery = 'SELECT * FROM observe WHERE video_id = ?;';
  const [selectObserveInfoByObserveIdRows]: [observeInformationByVideoIdReponse[], FieldPacket[]] = await connection.query<observeInformationByVideoIdReponse[]>(selectObserveInfoByObserveIdQuery, [videoId]);
  return selectObserveInfoByObserveIdRows;
};

export const selectVideoInfoByVideoId = async (conneciton: PoolConnection, videoId: number): Promise<videoInfo[]> => {
  const connection = await pool.getConnection();
  const selectVideoInfoByVideoIdQuery = 'SELECT * FROM video WHERE id = ?;';
  const [selectVideoInfoByVideoIdRows]: [videoInfo[], FieldPacket[]] = await conneciton.query<videoInfo[]>(selectVideoInfoByVideoIdQuery, [videoId]);
  connection.release();
  return selectVideoInfoByVideoIdRows;
};

export const selectObserveRowForPlaceName = async (observeId: number): Promise<ObservePlaceNameRow> => {
  const connection = await pool.getConnection();
  const selectQuery = 'SELECT place_name FROM observe WHERE id = ?;';
  const [observePlaceNameRow]: [ObservePlaceNameRow[], FieldPacket[]] = await connection.execute<ObservePlaceNameRow[]>(selectQuery, [
    observeId
  ]);
  connection.release();
  return observePlaceNameRow[0];
};
