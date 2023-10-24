import { type ApiResponse } from 'src/domain/response'
import { insertRoomRow, selectRoomRows } from '../Repository/RoomRepository'
import pool from '../config/database';
import { type InsertRoomRowParams, type PostRoomRequest} from '../interface/chat'
import type { PoolConnection } from 'mysql2/promise';

export const insertRoom = async (roomObject: PostRoomRequest): Promise<ApiResponse> => {
    try {
        const connection: PoolConnection = await pool.getConnection();
        
        const passedData: InsertRoomRowParams = {
            uid: roomObject.uid,
            reportUid: roomObject.reportUid,
            accidentId: null,
            observeId: null
        }
        
        if (roomObject.accidentOrObserve){
            passedData.accidentId = roomObject.id
        } else {
            passedData.observeId = roomObject.id
        }

        const success: boolean = await insertRoomRow(connection, passedData);
        
        if (success){
            const answer: ApiResponse = {
                ok: true,
                msg: "successfully regist room"
            }
            return answer
        } else {
            throw new Error("Insertion failed"); // Throw an error if insertMessageRow returns false
        }

    } catch (err){
        console.log(err);
        const answer: ApiResponse = {
            ok: false,
            msg: "regist fail"
        }
        return answer
    }
}

export const readRoom = async (uid: string): Promise<ApiResponse> => {
    try {
        const connection: PoolConnection =  await pool.getConnection();
        const success: boolean = await selectRoomRows(connection, uid);

        if (success){
            const answer: ApiResponse = {
                ok: true,
                msg: "successfully regist room"

            }
            return answer
        } else {
            throw new Error("Insertion failed"); // Throw an error if insertMessageRow returns false
        }
    } catch (err){
        console.log(err);
        const answer: ApiResponse = {
            ok: false,
            msg: "regist fail"
        }
        return answer
    }
}