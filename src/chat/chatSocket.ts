import type http from 'http';
import socketIO from 'socket.io';
import { type SendMessageRequest, type SendFileRequest, type SendAccountRequest } from '../interface/chat';
import { insertMessage, insertFile, insertAccountMessage } from '../service/MessageService';
import { corsOption } from '../config/network';
import { ApiResponse } from '../domain/response'

export const chatSocket = (webserver: http.Server): void => {
  const io = new socketIO.Server(webserver, { cors: corsOption });

  io.sockets.on('connection', (socket: socketIO.Socket) => {
    socket.emit('message', { msg: 'Welcome' + socket.id });
    console.log('connect success');
    console.log('msg: Welcome + socketId:', socket.id);
    disconnect(socket); // 소켓 서버 연결해제.
    joinRoom(socket); // 채팅방 입장.
    sendChat(socket, io); // 유저가 평문 채팅 보냄.
    sendFile(socket, io); // 유저가 파일을 보냄.
    sendAccount(socket, io); // 유저가 계좌 정보를 보냄.
  });
};

const disconnect = (socket: socketIO.Socket): void => {
  socket.on('disconnect', () => {
    console.log('소켓 연결 해제');
    socket.removeAllListeners();
  });
};

const joinRoom = (socket: socketIO.Socket): void => {
  socket.on('join', async (roomId: number) => {
    console.log(`${roomId}에 들어감`);
    await socket.join(`${roomId}`);
  });
};

const sendChat = (socket: socketIO.Socket, io: socketIO.Server): void => {
  socket.on('sendChat', async (messageObject: SendMessageRequest) => {
    try {
      console.log(messageObject);

      const result: ApiResponse = await insertMessage(messageObject);
      io.to(`${messageObject.roomId}`).emit('message', result.msg);
    } catch (err) {
      io.to(`${messageObject.roomId}`).emit('err message', err);
    }
  });
};

const sendFile = (socket: socketIO.Socket, io: socketIO.Server): void => {
  socket.on('sendFile', async (fileObject: SendFileRequest) => {
    try {
      console.log(fileObject);

      const result: ApiResponse = await insertFile(fileObject);
      io.to(`${fileObject.roomId}`).emit('message', result.msg);
    } catch (err) {
      io.to(`${fileObject.roomId}`).emit('err message', err);
    }
  });
};

const sendAccount = (socket: socketIO.Socket, io: socketIO.Server): void => {
  socket.on('sendAccount', async (accountObject: SendAccountRequest) => {
    try {
      console.log(accountObject);

      const result: ApiResponse = await insertAccountMessage(accountObject)
      // account 업데이트 했는지 확인 / 아니면 입력하라고 해주기
      // 했으면 그냥 message 에 추가.

    } catch (err) {
      io.to(`${accountObject.roomId}`).emit('err message', err);
    }
  });
};
// const readChat = (socket: socketIO.Socket, io: socketIO.Server): void => {
//     socket.on('readChat', () => {});
// }
