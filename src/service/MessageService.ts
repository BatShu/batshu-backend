import { type ApiResponse } from 'src/domain/response';
import { type SelectRoomRow, type SelectMessageRow, type SendMessageRequest, type ReadChatData, type Chat } from '../interface/chat';
import { insertMessageRow, selectMessageRow, selectRoomRow } from '../Repository/MessageRepository';
import { type PoolConnection } from 'mysql2/promise';
import pool from '../config/database';

export const insertMessage = async (messageObject: SendMessageRequest): Promise<ApiResponse> => {
  try {
    const connection: PoolConnection = await pool.getConnection();
    const success: boolean = await insertMessageRow(connection, messageObject);
    if (success) {
      const answer: ApiResponse = {
        ok: true,
        msg: 'successfully regist chat'
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

export const selectMessage = async (roomId: number): Promise<ApiResponse> => {
  try {
    const connection: PoolConnection = await pool.getConnection();
    console.log(roomId);
    const roomRow: SelectRoomRow = await selectRoomRow(connection, roomId);
    console.log(roomRow);
    const MessageRows: SelectMessageRow[] = await selectMessageRow(connection, roomId);
    console.log(MessageRows);
    const data: ReadChatData = {
      accidentOrObserve: roomRow.accidentId !== null,
      id: roomRow.accident_id ?? roomRow.observe_id,
      chatList: []
    };

    for (const messageRow of MessageRows) {
      const chat: Chat = {
        sendUserUid: messageRow.uid,
        message: messageRow.message_text,
        createdAt: messageRow.created_at
      };
      data.chatList.push(chat);
    }

    const answer: ApiResponse = {
      ok: true,
      msg: 'successfully get chat',
      data
    };
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
