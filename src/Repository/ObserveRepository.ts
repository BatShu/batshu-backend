import { FieldPacket,RowDataPacket, PoolConnection } from "mysql2/promise";
import { registerObserveRequest } from "../interface/observe"


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