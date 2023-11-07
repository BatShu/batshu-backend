import type http from 'http';
import socketIO from 'socket.io';
import { type SendFileRequest, type SendAccountRequest, type SocketEmitObject, type SendChatRequest, type SendMessageRequest } from '../interface/chat';
import { insertMessage, insertFile, insertAccountMessage } from '../service/MessageService';
import { corsOption } from '../config/network';

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
  socket.on('sendChat', async (messageObject: SendChatRequest) => {
    try {
      const passedObject: SendMessageRequest = { ...messageObject, messageType: 'message' };

      const result: SocketEmitObject = await insertMessage(passedObject);
      io.to(`${messageObject.roomId}`).emit('message', result);
    } catch (err) {
      io.to(`${messageObject.roomId}`).emit('err message', err);
    }
  });
};

const sendFile = (socket: socketIO.Socket, io: socketIO.Server): void => {
  socket.on('sendFile', async (fileObject: SendFileRequest) => {
    try {
      const result: SocketEmitObject = await insertFile(fileObject);
      io.to(`${fileObject.roomId}`).emit('message', result);
    } catch (err) {
      io.to(`${fileObject.roomId}`).emit('err message', err);
    }
  });
};

const sendAccount = (socket: socketIO.Socket, io: socketIO.Server): void => {
  socket.on('sendAccount', async (accountObject: SendAccountRequest) => {
    try {
      const result: SocketEmitObject = await insertAccountMessage(accountObject);
      io.to(`${accountObject.roomId}`).emit('message', result);
    } catch (err) {
      io.to(`${accountObject.roomId}`).emit('err message', err);
    }
  });
};
