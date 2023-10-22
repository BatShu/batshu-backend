import http from 'http';
import * as socketIO from 'socket.io';

export const chatSocket = (webserver: http.Server): void => {
    const io = require('socket.io')(webserver);

    io.sockets.on('connection', (socket:socketIO.Socket) => {
        socket.emit('message', {msg: 'Welcome' + socket.id});
        disconnect(socket); // 소켓 서버 연결해제
        joinRoom(socket); // 채팅방 입장
        message(socket, io); // 메시지 보내기
        readChat(socket, io); // 유저가 채팅읽은 경우 -> 알림.
    })
}

const disconnect = (socket: socketIO.Socket): void => {
    socket.on('disconnect', () => {});
}

const joinRoom = (socket: socketIO.Socket): void => {
    socket.on('join', () => {});
}

const message = (socket: socketIO.Socket, io: socketIO.Server): void => {
    socket.on('message', () => {});
}

const readChat = (socket: socketIO.Socket, io: socketIO.Server): void => {
    socket.on('readChat', () => {});
}