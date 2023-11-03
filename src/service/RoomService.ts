import { type ApiResponse } from 'src/domain/response';
import { type AccidentRow } from '../interface/accident';
import { type PoolConnection } from 'mysql2/promise';
import { type InsertRoomRowParams, type PostRoomRequest, type selectNecessaryRow, type ReadRoomData, type SelectMessageRow, type ReadRoomDataForList } from '../interface/chat';
import { insertRoomRow, selectRoomRows, selectRoomRow } from '../Repository/RoomRepository';
import { selectAccidentRow } from '../Repository/AccidentRepository';
import pool from '../config/database';
import { admin } from '../auth/firebase';
import { selectMessageRow } from '../Repository/MessageRepository';
import { selectObserveRowForPlaceName } from '../Repository/ObserveRepository';
import { type ObserveUidPlaceNameRow } from '../interface/observe';

export const insertRoom = async (roomObject: PostRoomRequest): Promise<ApiResponse> => {
  try {
    const connection: PoolConnection = await pool.getConnection();

    const passedData: InsertRoomRowParams = {
      uid: ' ',
      reportUid: roomObject.reportUid,
      accidentId: null,
      observeId: null
    };

    if (roomObject.isAccident) {
      passedData.accidentId = roomObject.id;
      const accidentRow: AccidentRow[] = await selectAccidentRow(passedData.accidentId);
      passedData.uid = accidentRow[0].uid;
    } else {
      passedData.observeId = roomObject.id;
      const observeRow: ObserveUidPlaceNameRow = await selectObserveRowForPlaceName(passedData.observeId);
      passedData.uid = observeRow.uid;
    }
    const roomId = await insertRoomRow(connection, passedData);

    if (roomId != null) {
      const answer: ApiResponse = {
        ok: true,
        msg: 'successfully regist room',
        data: {
          roomId
        }
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

export const selectRoomsByUid = async (uid: string): Promise<ApiResponse> => {
  try {
    const connection: PoolConnection = await pool.getConnection();
    const roomRows: selectNecessaryRow[] = await selectRoomRows(connection, uid);

    const answer: ApiResponse = {
      ok: true,
      msg: 'successfully get room',
      data: []
    };

    for (const roomRow of roomRows) {
      const chat: SelectMessageRow[] = await selectMessageRow(connection, roomRow.roomId);

      const inputData: ReadRoomDataForList = {
        roomId: roomRow.roomId,
        uid: roomRow.uid,
        isAccident: roomRow.accidentId !== null,
        id: roomRow.accidentId ?? roomRow.observeId,
        lastChat: '',
        lastChatCreatedAt: ''
      };

      if (chat.length > 0) {
        inputData.lastChat = chat[0].message_text;
        inputData.lastChatCreatedAt = chat[0].created_at;
      };

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

export const selectRoom = async (roomId: number): Promise<ReadRoomData> => {
  const connection: PoolConnection = await pool.getConnection();
  const roomRow: selectNecessaryRow = await selectRoomRow(connection, roomId);

  const userInfo = await admin.auth().getUser(roomRow.uid);
  const chat: SelectMessageRow[] = await selectMessageRow(connection, roomRow.roomId);

  const inputData: ReadRoomData = {
    roomId: roomRow.roomId,
    uid: userInfo.uid,
    isAccident: roomRow.accidentId !== null,
    id: roomRow.accidentId ?? roomRow.observeId ?? 0,
    lastChat: '',
    lastChatCreatedAt: ''
  };

  if (chat.length > 0) {
    inputData.lastChat = chat[0].message_text;
    inputData.lastChatCreatedAt = chat[0].created_at;
  };

  return inputData;
};
