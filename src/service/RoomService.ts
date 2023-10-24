import { type ApiResponse } from 'src/domain/response'
import { type SendMessageRequest, type SendMessageResponse } from '../interface/chat'
import { insertMessageRow } from '../Repository/MessageRepository'
import pool from '../config/database';

export const insertRoom = async (): Promise<ApiResponse> => {
    try {
        const answer: ApiResponse = {
            ok: true,
            msg: "successfully regist chat"
        }
        return answer
    } catch (err){
        console.log(err);
        const answer: ApiResponse = {
            ok: false,
            msg: "regist fail"
        }
        return answer
    }
}