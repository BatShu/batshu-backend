import { type ApiResponse } from 'src/domain/response'
import { type SendMessageRequest, type SendMessageResponse } from '../interface/chat'
import { insertMessageRow } from '../Repository/MessageRepository'
import pool from '../config/database';

export const insertMessage = async (messageObject: SendMessageRequest): Promise<ApiResponse> => {
    try {
        const connection = await pool.getConnection();
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