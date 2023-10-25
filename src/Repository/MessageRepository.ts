import { SelectRoomRow, type SelectMessageRow, type SendMessageRequest } from '../interface/chat'
import type { FieldPacket, PoolConnection } from 'mysql2/promise';

export const insertMessageRow = async (connection: PoolConnection, messageObject: SendMessageRequest): Promise<boolean> => {
    try{
        const insertQuery = `INSERT INTO message (uid, room_id, message_text, created_at) VALUES (?, ?, ?, NOW())`;
        await connection.execute(insertQuery,[messageObject.sendUserUid, messageObject.roomId, messageObject.message])
        return true;
    } catch(err){
        return false;
    }
}

export const selectMessageRow = async (connection: PoolConnection, roomId: number): Promise<SelectMessageRow[]> => {
    try{
        const selectQuery = `SELECT uid, message_text, created_at FROM message where room_id = ? ORDER BY id DESC`;
        const [messageRows]: [SelectMessageRow[], FieldPacket[]] = await connection.execute<SelectMessageRow[]>(selectQuery,[
            roomId
        ]);
        
        return messageRows;
    } catch(err){
        throw err;
    }
}

export const selectRoomRow = async (connection: PoolConnection, roomId: number): Promise<SelectRoomRow> => {
    try{
        const selectQuery = `SELECT uid, report_uid, accident_id, observe_id FROM room where id = ?`;
        const [roomRows]: [SelectRoomRow[], FieldPacket[]] = await connection.execute<SelectRoomRow[]>(selectQuery,[
            roomId
        ]);
        
        return roomRows[0];
    } catch(err){
        throw err;
    }
}