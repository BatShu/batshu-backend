import type http from 'http';
import socketIO from 'socket.io';
import { type SendMessageRequest } from '../interface/chat';
import { type ApiResponse } from 'src/domain/response';
import { insertMessage } from '../service/MessageService';

export const chatSocket = (webserver: http.Server): void => {
  const io = new socketIO.Server(webserver);

  io.sockets.on('connection', (socket: socketIO.Socket) => {
    socket.emit('message', { msg: 'Welcome' + socket.id });
    console.log('connect success');
    console.log('msg: Welcome + socketId:', socket.id);
    disconnect(socket); // 소켓 서버 연결해제
    joinRoom(socket); // 채팅방 입장
    sendChat(socket, io); // 유저가 채팅 보냄.
    // readChat(socket, io); // 유저가 채팅 읽음.
  });
};

const disconnect = (socket: socketIO.Socket): void => {
  socket.on('disconnect', () => {
    console.log('소켓 연결 해제');
  });
};

const joinRoom = (socket: socketIO.Socket): void => {
  socket.on('join', async (roomId: string) => {
    console.log(`${roomId}에 들어감`);
    await socket.join(roomId);
  });
};

const sendChat = (socket: socketIO.Socket, io: socketIO.Server): void => {
  socket.on('sendChat', async (messageObject: SendMessageRequest) => {
    try {
      console.log(messageObject);

      // 1. Chat table insert v

      // 2. Room table update -> 채팅방 생성 api 먼저. v

      const messageResponse: ApiResponse = await insertMessage(messageObject);

      io.to(messageObject.socketId).emit('message', messageResponse);
    } catch (err) {
      io.to(messageObject.socketId).emit('err message', err);
    }
  });
};

// const readChat = (socket: socketIO.Socket, io: socketIO.Server): void => {
//     socket.on('readChat', () => {});
// }
