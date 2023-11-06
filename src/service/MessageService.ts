import { type ApiResponse } from 'src/domain/response';
import { type SelectRoomRow, type SelectMessageRow, type SendMessageRequest, type ReadChatData, type Chat, type SendFileRequest, type SendAccountRequest } from '../interface/chat';
import { type PoolConnection } from 'mysql2/promise';
import { insertMessageRow, selectMessageRow, selectRoomRow } from '../Repository/MessageRepository';
import pool from '../config/database';
import crypto from 'crypto';
import AWS from 'aws-sdk';
import { PutObjectCommand, S3Client, type S3ClientConfig } from '@aws-sdk/client-s3';

const bucketName: string = process.env.BUCKET_NAME_HARAM ?? '';
const accessKey: string = process.env.ACCESS_KEY_HARAM ?? '';
const secretAccessKey: string = process.env.SECRET_ACCESS_KEY_HARAM ?? '';

AWS.config.update({
  accessKeyId: accessKey, // AWS Access Key ID를 여기에 입력
  secretAccessKey, // AWS Secret Access Key를 여기에 입력
  region: 'ap-northeast-2' // 사용하는 AWS 지역을 여기에 입력
});

const s3params: S3ClientConfig = {
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey
  },
  region: 'ap-northeast-2'
};

const s3 = new S3Client(s3params);

export const insertMessage = async (messageObject: SendMessageRequest): Promise<ApiResponse> => {
  try {
    const connection: PoolConnection = await pool.getConnection();
    messageObject.messageType = "message"
    const success: boolean = await insertMessageRow(connection, messageObject);
    connection.release();
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

export const insertFile = async (fileObject: SendFileRequest): Promise<ApiResponse> => {
  try {
    const fileName: string = crypto.randomBytes(16).toString('hex');

    const buffer: Buffer = Buffer.from(fileObject.file.fileData);

    const params = {
      Bucket: bucketName,
      Key: `${fileName}.${fileObject.file.filename.split('.').pop()}`,
      Body: buffer
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);

    const fileUrl: string = `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;

    const passedData: SendMessageRequest = {
      roomId: fileObject.roomId,
      sendUserUid: fileObject.sendUserUid,
      message: fileUrl,
      messageType: "file"
    };

    const connection: PoolConnection = await pool.getConnection();
    const success: boolean = await insertMessageRow(connection, passedData);
    connection.release();

    if (success) {
      const answer: ApiResponse = {
        ok: true,
        msg: 'successfully regist file'
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

export const insertAccountMessage = async (accountObject: SendAccountRequest) => {
  try {
    const connection: PoolConnection = await pool.getConnection();
    const messageObject: SendMessageRequest = { ...accountObject, message: " ", messageType: "account" };
    const success: boolean = await insertMessageRow(connection, messageObject);
    connection.release();
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
}

export const selectMessage = async (roomId: number): Promise<ApiResponse> => {
  try {
    const connection: PoolConnection = await pool.getConnection();
    console.log(roomId);
    const roomRow: SelectRoomRow = await selectRoomRow(connection, roomId);
    console.log(roomRow);
    const MessageRows: SelectMessageRow[] = await selectMessageRow(connection, roomId);
    console.log(MessageRows);
    const data: ReadChatData = {
      isAccident: roomRow.accidentId !== null,
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
