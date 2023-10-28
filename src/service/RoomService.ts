import { type ApiResponse } from 'src/domain/response';
import { type AccidentRow } from '../interface/accident';
import { type PoolConnection } from 'mysql2/promise';
import { type InsertRoomRowParams, type PostRoomRequest, type selectNecessaryRow, type ReadRoomData, type SelectMessageRow } from '../interface/chat';
import { insertRoomRow, selectRoomRows } from '../Repository/RoomRepository';
import { selectAccidentRow } from '../Repository/AccidentRepository';
import pool from '../config/database';
import { admin } from '../auth/firebase';
import { selectMessageRow } from '../Repository/MessageRepository';
import { selectObserveRowForPlaceName } from '../Repository/ObserveRepository';
import { type ObservePlaceNameRow } from '../interface/observe';

export const insertRoom = async (roomObject: PostRoomRequest): Promise<ApiResponse> => {
  try {
    const connection: PoolConnection = await pool.getConnection();

    const passedData: InsertRoomRowParams = {
      uid: roomObject.uid,
      reportUid: roomObject.reportUid,
      accidentId: null,
      observeId: null
    };

    if (roomObject.accidentOrObserve) {
      passedData.accidentId = roomObject.id;
    } else {
      passedData.observeId = roomObject.id;
    }
    console.log(passedData);
    const success: boolean = await insertRoomRow(connection, passedData);

    if (success) {
      const answer: ApiResponse = {
        ok: true,
        msg: 'successfully regist room'
      };
      return answer;
    } else {
      throw new Error('Insertion failed'); // Throw an error if insertMessageRow returns false
    }
  } catch (err) {
    console.log(err);
    const answer: ApiResponse = {
      ok: false,
      msg: 'regist fail'
    };
    return answer;
  }
};

export const selectRoom = async (uid: string): Promise<ApiResponse> => {
  try {
    const connection: PoolConnection = await pool.getConnection();
    const roomRows: selectNecessaryRow[] = await selectRoomRows(connection, uid);

    const answer: ApiResponse = {
      ok: true,
      msg: 'successfully get room',
      data: []
    };

    for (const roomRow of roomRows) {
      const userInfo = await admin.auth().getUser(roomRow.uid);
      const chat: SelectMessageRow[] = await selectMessageRow(connection, roomRow.roomId);

      const inputData: ReadRoomData = {
        roomId: roomRow.roomId,
        displayName: userInfo.displayName,
        googleProfilePhotoUrl: userInfo.photoURL,
        placeName: '',
        lastChat: '',
        lastChatCreatedAt: ''
      };

      if (chat.length > 0) {
        inputData.lastChat = chat[0].message_text;
        inputData.lastChatCreatedAt = chat[0].created_at;
      };

      if (roomRow.accidentId !== null && roomRow.accidentId !== undefined) {
        const accident: AccidentRow[] = await selectAccidentRow(roomRow.accidentId);
        inputData.placeName = accident[0].place_name;
      } else if (roomRow.observeId !== null && roomRow.observeId !== undefined) {
        const observe: ObservePlaceNameRow = await selectObserveRowForPlaceName(roomRow.observeId);
        inputData.placeName = observe.place_name;
      }

      answer.data.push(inputData);
    }

    return answer;
  } catch (err) {
    console.log(err);
    const answer: ApiResponse = {
      ok: false,
      msg: 'get fail'
    };
    return answer;
  }
};
