const express = require('express');
const testapp = express();
const server = require('http').createServer(testapp);
const WebSocketServer = require('ws');
var cors = require('cors');
testapp.use(cors());

const wss = require('socket.io')(server, { cors: { origin: "*" } });


console.log('WebSocket-сервер работает на порту 8080');
console.log('Ожидание подключений клиентов...');


wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
        message = JSON.parse(message)
        console.log(`Received: ${message}`);

        switch (message.event) {
            case 'message':
                broadCastMessage(message)
                break
            case 'connection':
                broadCastMessage(message)
                break
        }
    });

    // Отправка сообщения клиенту
    ws.send('Привет, клиент!');
});

function broadCastMessage(message) {
    wss.clients.forEach(user => {
        user.send(JSON.stringify(message))
    })
}


testapp.get('/', (req, res) => res.send('Hello world'));

server.listen(8080);
