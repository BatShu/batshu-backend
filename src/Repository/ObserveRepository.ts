import { PoolConnection } from "mysql2/promise";

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