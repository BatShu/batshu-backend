import { FieldPacket,RowDataPacket, PoolConnection } from "mysql2/promise";
import { registerObserveRequest } from "../interface/observe"
import pool from "../config/database";

export const selectObserveOnTheMapRow = async (locationObject:LocationObject) => {
    try{
      const connection = await pool.getConnection();
  
      const observeSelectQuery: string = `
        SELECT id, ST_X(observe_location) AS x, ST_Y(observe_location) AS y
        FROM observe
        WHERE ST_Distance_Sphere(
          observe_location,
          ST_GeomFromText('POINT(${locationObject.x} ${locationObject.y})')
        ) <= ?;`;
      
      const observeRows = await connection.execute(observeSelectQuery, [
        locationObject.radius
      ])
  
      connection.release();
      return observeRows[0];
    } catch (err) {
      return err;
    }
  }

// 비디오 업로드.
export const updateVideoStatus = async(connection: PoolConnection, uploadedVideoOriginalName:string) => {

    const updateVideoStatusQuery = `INSERT INTO video (status, video_url) VALUES (?, ?);`;
    const [updateVideoStatusRows] = await connection.query(updateVideoStatusQuery, ['uploaded', uploadedVideoOriginalName]);

    return updateVideoStatusRows;
}

export const findUploadedVideoId = async(connection: PoolConnection, uploadedVideoOriginalName:string) => {
    const findUploadedVideoIdQuery = `SELECT id FROM video WHERE video_url = ?;`;
    const [findUploadedVideoIdRows] = await connection.query(findUploadedVideoIdQuery, [uploadedVideoOriginalName]);

    return findUploadedVideoIdRows;
}

export const updateVideoStatusWithBlurring = async(connection: PoolConnection, uploadedVideoOriginalName:string) => {
    const updateVideoStatusWithBlurringStartQuery = `UPDATE video SET status = ? WHERE video_url = ?;`;
    const [updateVideoStatusWithBlurringStartRows] = await connection.query(updateVideoStatusWithBlurringStartQuery, ['blurring', uploadedVideoOriginalName]);

    return updateVideoStatusWithBlurringStartRows;
}

export const updateVideoStatusWithBlurringDone = async(connection: PoolConnection, uploadedVideoOriginalName:string) => {
    const updateVideoStatusWithBlurringDoneQuery = `UPDATE video SET status = ? WHERE video_url = ?;`;
    const [updateVideoStatusWithBlurringDoneRows] = await connection.query(updateVideoStatusWithBlurringDoneQuery, ['blurringDone', uploadedVideoOriginalName]);

    return updateVideoStatusWithBlurringDoneRows;
}


export const insertMosaicedVideoUrlResult = async(connection: PoolConnection, videoOutputFileName : string, mosaicedVideoUrl : string) => {

    const insertMosaicedVideoUrlQuery = `UPDATE video SET video_url = ? WHERE video_url = ?;`;
    const [insertMosaicedVideoUrlRows] = await connection.query(insertMosaicedVideoUrlQuery, [mosaicedVideoUrl, videoOutputFileName]);

    return insertMosaicedVideoUrlRows;
}

export const updateVideoUrlToOutputFileNameResult = async(connection: PoolConnection, uploadedVideoOriginalName : string, outputFileName : string) => {
  
      const updateVideoUrlToOutputFileNameQuery = `UPDATE video SET video_url = ? WHERE video_url = ?;`;
      const [updateVideoUrlToOutputFileNameRows] = await connection.query(updateVideoUrlToOutputFileNameQuery, [outputFileName, uploadedVideoOriginalName]);
  
      return updateVideoUrlToOutputFileNameRows;
}


export const insertThumbnailUrlResult = async(connection: PoolConnection, locationUrl : string, thumbnailLocationUrl : string) => {
  try {
    const updateThumbnailUrlQuery = `UPDATE video SET thumbnail_url = ? WHERE video_url = ?;`;
    const [insertThumbnailUrlRows] = await connection.query(updateThumbnailUrlQuery, [thumbnailLocationUrl, locationUrl]);
    return insertThumbnailUrlRows;
} catch (error) {
    console.error('썸네일 URL 삽입 오류:', error);
    throw error; // 더 높은 수준에서 처리하기 위해 오류를 다시 던집니다.
}
}


export const selectVideoInfo = async(connection: PoolConnection, videoId : number) => {
    const selectVideoInfoQuery = `SELECT id, video_url, thumbnail_url FROM video WHERE id = ?;`;
    const [selectVideoInfoRows] = await connection.query(selectVideoInfoQuery, [videoId]);

    return selectVideoInfoRows;
}

export const createObserveData = async(connection: PoolConnection, registerObserveData : registerObserveRequest) => {
    const createObserveQuery = `INSERT INTO observe (content_title, content_description, video_id, observe_start_time, observe_end_time, observe_location, created_at, uid) VALUES (?, ?, ?, ?, ?, POINT(?, ?), NOW(), ?);`;
    
    const results = await connection.query(createObserveQuery, [
          registerObserveData.contentTitle,
          registerObserveData.contentDescription,
          registerObserveData.videoId,
          registerObserveData.observeTime[0],
          registerObserveData.observeTime[1],
          registerObserveData.accidentLocation.x,
          registerObserveData.accidentLocation.y,
          registerObserveData.uid,
        ]);

        console.log(results);
 

};

export const selectfindregisterObserveInfo = async(connection: PoolConnection, videoId : number) => {
    const selectCreatedAtQuery = `SELECT * FROM observe WHERE video_id = ?;`;
    const [selectCreatedAtRows] = await connection.query(selectCreatedAtQuery, [videoId]);

    return selectCreatedAtRows;
}

