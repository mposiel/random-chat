const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    console.log(`a user connected: ${socket.id}`);

    socket.on('send_message', (msg) => {
        console.log('message: ' + msg);
        socket.broadcast.emit('recieve_message', msg);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});


server.listen(3001, () => {
    console.log('listening on port:3001');
})

