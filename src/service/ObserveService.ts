import pool from "../config/database"
import { registerObserveRequest } from "../interface/observe";
import { updateVideoStatus, findUploadedVideoId, updateVideoStatusWithBlurring, updateVideoStatusWithBlurringDone, createObserveData } from "../Repository/ObserveRepository"


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