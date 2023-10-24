import { type InsertRoomRowParams } from '../interface/chat'
import type { FieldPacket, PoolConnection } from 'mysql2/promise';

export const insertRoomRow = async (connection: PoolConnection, roomObject: InsertRoomRowParams): Promise<boolean> => {
    try{
        const insertQuery = `INSERT INTO room (uid, report_uid, accident_id, observe_id) VALUES (?, ?, ?, ?)`;
        connection.query(insertQuery,[roomObject.uid, roomObject.reportUid, roomObject.accidentId, roomObject.observeId])
        return true;
    } catch(err){
        return false;
    }
} 

export const selectRoomRows = async (connection: PoolConnection, uid: string): Promise<boolean> => {
    return true;
}