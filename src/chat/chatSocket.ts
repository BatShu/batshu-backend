import http from 'http';
import * as socketIO from 'socket.io';

export const chatSocket = (webserver: http.Server):void => {
    const io = require('socket.io')(webserver);

    io.sockets.on('connection', (socket:socketIO.Socket) => {
        socket.emit('message', {msg: 'Welcome' + socket.id});
    })
}