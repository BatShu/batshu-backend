import http from 'http';
import socketIO from 'socket.io';

export const chatSocket = (webserver: http.Server): void => {
    const io = require('socket.io')(webserver);

    io.sockets.on('connection', (socket:socketIO.Socket) => {
        socket.emit('message', {msg: 'Welcome' + socket.id});
        console.log("connect success");
        disconnect(socket); // 소켓 서버 연결해제
        joinRoom(socket); // 채팅방 입장
        sendChat(socket, io); // 유저가 채팅 보냄.
        readChat(socket, io); // 유저가 채팅 읽음. -> 알림.
    })
}

const disconnect = (socket: socketIO.Socket): void => {
    socket.on('disconnect', () => {});
}

const joinRoom = (socket: socketIO.Socket): void => {
    socket.on('join', () => {});
}

const sendChat = (socket: socketIO.Socket, io: socketIO.Server): void => {
    socket.on('sendChat', (message: string) => {
        console.log(message);
        io.emit('message', message);
    });
}

const readChat = (socket: socketIO.Socket, io: socketIO.Server): void => {
    socket.on('readChat', () => {});
}