import { selectNecessaryRow, type InsertRoomRowParams, type selectRoomListRow } from '../interface/chat'
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

export const selectRoomRows = async (connection: PoolConnection, uid: string): Promise<selectNecessaryRow[]> => {
    try{
        const selectQuery = `SELECT * FROM room where uid = ? AND report_uid = ?`;
        const [roomRows]: [selectRoomListRow[], FieldPacket[]] = await connection.execute<selectRoomListRow[]>(selectQuery,[
            uid, uid
        ]);
        const returnData: selectNecessaryRow[] = [];
        for (const roomRow of roomRows){
            const roomData: selectNecessaryRow = {
                roomId: roomRow.id,
                uid: '',
                accidentId: roomRow.accident_id,
                observeId: roomRow.observe_id
            }
            if (uid == roomRow.uid){
                roomData.uid = roomRow.report_uid
            }
            else {
                roomData.uid = roomRow.uid
            }
            returnData.push(roomData)
        }
        return returnData;
    } catch(err){
        throw err;
    }
}