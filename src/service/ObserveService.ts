import pool from "../config/database"
import { registerObserveRequest } from "../interface/observe";
import { updateVideoStatus, findUploadedVideoId, updateVideoStatusWithBlurring, updateVideoStatusWithBlurringDone, createObserveData, selectObserveOnTheMapRow, insertMosaicedVideoUrlResult, updateVideoUrlToOutputFileNameResult, insertThumbnailUrlResult, selectVideoInfo, selectfindregisterObserveInfo } from "../Repository/ObserveRepository"


export const insertVideoStatus = async (uploadedVideoOriginalName: string) => {
    const conneciton = await pool.getConnection();
    const updatedVideoStatus = await updateVideoStatus(conneciton, uploadedVideoOriginalName);
    conneciton.release();

    return updatedVideoStatus;
}


export const findVideoId = async(uploadedVideoOriginalName : string) => {
    const conneciton = await pool.getConnection();
    const uploadedVideoId = await findUploadedVideoId(conneciton, uploadedVideoOriginalName);
    conneciton.release();

    return uploadedVideoId;
}

export const updateVideoStautsToBlurringStart = async (uploadedVideoOriginalName: string) => {
    const conneciton = await pool.getConnection();
    const updateUploadedVideoStatus = await updateVideoStatusWithBlurring(conneciton, uploadedVideoOriginalName);
    conneciton.release();

    return updateUploadedVideoStatus;

}


export const updateVideoStautsToBlurringDone = async (uploadedVideoOriginalName: string) => {
    const conneciton = await pool.getConnection();
    const updateUploadedVideoStatus = await updateVideoStatusWithBlurringDone(conneciton, uploadedVideoOriginalName);
    conneciton.release();

    return updateUploadedVideoStatus;
}

export const createObserve = async (registerObserveData : registerObserveRequest) => {
    const conneciton = await pool.getConnection();
    const observeData = await createObserveData(conneciton, registerObserveData);
    conneciton.release();


    return observeData;
}

export const insertMosaicedFinalVideoUrl = async (videoOutputFileName : string, mosaicedVideoUrl : string) => {
    const conneciton = await pool.getConnection();
    const mosaicedVideo = await insertMosaicedVideoUrlResult(conneciton, videoOutputFileName, mosaicedVideoUrl);
    conneciton.release();
}

export const updateVideoUrlToOutputFileName = async (uploadedVideoOriginalName : string, outputFileName : string) => {
    
    const conneciton = await pool.getConnection();
    const updateVideoUrl = await updateVideoUrlToOutputFileNameResult(conneciton, uploadedVideoOriginalName, outputFileName);
    conneciton.release();

    return updateVideoUrl;

}

export const insertThumbnailUrl = async (locationUrl : string, thumbnailLocationUrl : string) => {
    const conneciton = await pool.getConnection();
    const thumbnail = await insertThumbnailUrlResult(conneciton, locationUrl, thumbnailLocationUrl);
    conneciton.release();
}

export const findvideoInfo = async (videoId : number) => {
    const conneciton = await pool.getConnection();
    const videoInfo = await selectVideoInfo(conneciton, videoId);
    conneciton.release();

    return videoInfo;
}

export const findregisterObserveInfo = async (videoId : number) => {
    const conneciton = await pool.getConnection();
    const createdAt = await selectfindregisterObserveInfo(conneciton, videoId);
    conneciton.release();

    return createdAt;
}


exports.readObserveOnTheMap = async (locationObject:LocationObject) => {
    try{
    const observeRows = await selectObserveOnTheMapRow(locationObject) as ResultSetHeader[];
    
    const data:ObserveLocationObject[] = []
    
    for (let observeRow of observeRows){
        const location:LocationObject = {
            x : observeRow.x,
            y : observeRow.y
        }
        const observeLocationObject:ObserveLocationObject = {
            observeId: observeRow.id,
            observeLocation: location
        };
        data.push(observeLocationObject);
    }

    const resData = {
        ok: true,
        msg: "Successfully Get",
        data: data
    } 
    return resData;

    }  catch (error) {
        const resData: ApiResponse = {
            ok: false,
            msg: "INTERNAL SERVER ERROR"
        }
        return resData;
    }
}