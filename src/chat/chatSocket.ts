import http from 'http';
import socketIO from 'socket.io';
import { SendMessageRequest, SendMessageResponse } from '../interface/chat'
import { insertMessage } from '../service/MessageService';
import { ApiResponse } from 'src/domain/response';

export const chatSocket = (webserver: http.Server): void => {
    const io = require('socket.io')(webserver);

    io.sockets.on('connection', (socket:socketIO.Socket) => {
        socket.emit('message', {msg: 'Welcome' + socket.id});
        console.log("connect success");
        console.log("msg: Welcome + socketId:",socket.id);
        disconnect(socket); // 소켓 서버 연결해제
        joinRoom(socket); // 채팅방 입장
        sendChat(socket, io); // 유저가 채팅 보냄.
        // readChat(socket, io); // 유저가 채팅 읽음.
    })
}

const disconnect = (socket: socketIO.Socket): void => {
    socket.on('disconnect', () => {
        console.log("소켓 연결 해제");
    });
}

const joinRoom = (socket: socketIO.Socket): void => {
    socket.on('join', (roomId: string) => {
        console.log(`${roomId}에 들어감`);
        socket.join(roomId);
    });
}

const sendChat = (socket: socketIO.Socket, io: socketIO.Server): void => {
    socket.on('sendChat', async (messageObject: SendMessageRequest) => {
        try {
            console.log(messageObject);
            
            // 1. Chat table insert v

            // 2. Room table update -> 채팅방 생성 api 먼저.


            const messageResponse: ApiResponse = await insertMessage(messageObject);

            io.to(messageObject.roodId).emit('message', messageResponse);
        } catch (err){
            io.to(messageObject.roodId).emit('err message', err);
        }
    });
}

// const readChat = (socket: socketIO.Socket, io: socketIO.Server): void => {
//     socket.on('readChat', () => {});
// }