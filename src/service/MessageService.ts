import { type ApiResponse } from 'src/domain/response'
import { SelectRoomRow, type SelectMessageRow, type SendMessageRequest, type SendMessageResponse, type ReadChatData, type Chat } from '../interface/chat'
import { insertMessageRow, selectMessageRow, selectRoomRow } from '../Repository/MessageRepository'
import { type PoolConnection } from 'mysql2/promise';
import pool from '../config/database';

export const insertMessage = async (messageObject: SendMessageRequest): Promise<ApiResponse> => {
    try {
        const connection: PoolConnection = await pool.getConnection();
        const success: boolean = await insertMessageRow(connection, messageObject);
        if (success){
            const answer: ApiResponse = {
                ok: true,
                msg: "successfully regist chat"
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

export const selectMessage = async (roomId: number): Promise<ApiResponse> => {
    try {
        const connection: PoolConnection = await pool.getConnection();
        
        const roomRow: SelectRoomRow = await selectRoomRow(connection, roomId);
        
        const MessageRows: SelectMessageRow[] = await selectMessageRow(connection, roomId);
        
        const data: ReadChatData = {
            accidentOrObserve: roomRow.accidentId !== null,
            id: roomRow.accidentId || roomRow.observeId || 0,
            chatList: []
        }

        for (const messageRow of MessageRows){
            const chat: Chat = {
                sendUserUid: messageRow.uid,
                message: messageRow.message,
                createdAt: messageRow.createdAt
            }
            data.chatList.push(chat);
        }

        const answer: ApiResponse = {
            ok: true,
            msg: "successfully get chat",
            data: data
        }
        return answer
        
    } catch (err){
        console.log(err);
        const answer: ApiResponse = {
            ok: false,
            msg: "get fail"
        }
        return answer
    }
}