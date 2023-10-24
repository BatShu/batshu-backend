import { type ApiResponse } from 'src/domain/response'
import { insertRoomRow, selectRoomRows } from '../Repository/RoomRepository'
import { selectAccidentRow } from '../Repository/AccidentRepository';
import pool from '../config/database';
import { type InsertRoomRowParams, type PostRoomRequest, selectNecessaryRow, ReadRoomData, SelectMessageRow} from '../interface/chat'
import type { PoolConnection } from 'mysql2/promise';
import { admin } from '../auth/firebase';
import { AccidentRow } from '../interface/accident';
import { selectMessageRow } from '../Repository/MessageRepository';

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

export const selectRoom = async (uid: string): Promise<ApiResponse> => {
    try {
        const connection: PoolConnection =  await pool.getConnection();

        const roomRows: selectNecessaryRow[] = await selectRoomRows(connection, uid);
        // roomId: number => message 테이블에서 lastChat, lastChatCreatedAt
        // uid: string => 대화상대 uid => userinfo => displayName, googleProfilePhotoUrl
        // accidentId?: number => 사고 테이블에서 placeName
        // observeId?: number => 목격 테이블에서 placeName
        // const roomUserInfo: RoomUserInfo = await selectRoomRows(connection, uid);
        // const userInfo = await admin.auth().getUser(uid);
        
        const answer: ApiResponse = {
            ok: true,
            msg: "successfully get room",
            data: []
        }

        for (const roomRow of roomRows){
            const userInfo = await admin.auth().getUser(roomRow.uid);
            const chat: SelectMessageRow[] = await selectMessageRow(connection,roomRow.roomId);
            const inputData: ReadRoomData = {
                roomId: roomRow.roomId,
                displayName: userInfo.displayName,
                googleProfilePhotoUrl: userInfo.photoURL,
                placeName: '',
                lastChat: chat[-1].message,
                lastChatCreatedAt: chat[-1].createdAt
            }
            if (roomRow.accidentId){
                const accident: AccidentRow[] = await selectAccidentRow(roomRow.accidentId);
                inputData.placeName = accident[0].placeName
            }
            else {
                //observe table 에서 placeName을 가져오기
            }
            answer.data.push(inputData);
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