import { type selectNecessaryRow, type InsertRoomRowParams, type selectRoomListRow } from '../interface/chat';
import type { FieldPacket, PoolConnection } from 'mysql2/promise';

export const insertRoomRow = async (connection: PoolConnection, roomObject: InsertRoomRowParams): Promise<number | null> => {
  try {
    console.log(roomObject);
    const insertQuery = 'INSERT INTO room (uid, report_uid, accident_id, observe_id) VALUES (?, ?, ?, ?)';
    await connection.execute(insertQuery, [roomObject.uid, roomObject.reportUid, roomObject.accidentId, roomObject.observeId]);
    // Get the last inserted id
    const [rows]: any = await connection.execute('SELECT LAST_INSERT_ID() as id');
    const id = Array.isArray(rows) && rows.length > 0 ? rows[0].id : null;
    return id;
  } catch (err) {
    return null;
  }
};

export const selectRoomRows = async (connection: PoolConnection, uid: string): Promise<selectNecessaryRow[]> => {
  try {
    const selectQuery = 'SELECT * FROM room where uid = ? OR report_uid = ?';
    const [roomRows]: [selectRoomListRow[], FieldPacket[]] = await connection.execute<selectRoomListRow[]>(selectQuery, [
      uid, uid
    ]);
    const returnData: selectNecessaryRow[] = [];
    for (const roomRow of roomRows) {
      const roomData: selectNecessaryRow = {
        roomId: roomRow.id,
        uid: '',
        accidentId: roomRow.accident_id,
        observeId: roomRow.observe_id
      };
      if (uid === roomRow.uid) {
        roomData.uid = roomRow.report_uid;
      } else {
        roomData.uid = roomRow.uid;
      }
      returnData.push(roomData);
    }
    return returnData;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
