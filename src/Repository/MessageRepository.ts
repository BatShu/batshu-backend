import { type SendMessageRequest } from '../interface/chat'
import type { FieldPacket, PoolConnection } from 'mysql2/promise';

export const insertMessageRow = async (connection: PoolConnection, messageObject: SendMessageRequest): Promise<boolean> => {
    try{
        const insertQuery = `INSERT INTO message (uid, room_id, message_text, created_at) VALUES (?, ?, ?, NOW())`;
        connection.query(insertQuery,[messageObject.sendUserUid, messageObject.roodId, messageObject.message])
        return true;
    } catch(err){
        return false;
    }
}