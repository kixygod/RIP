const express = require('express');
const testapp = express();
const server = require('http').createServer(testapp);
const WebSocket = require('ws');
var cors = require('cors');
testapp.use(cors());

const wss = require('socket.io')(server, { cors: { origin: "*" } });

console.log('WebSocket-сервер работает на порту 8080');
console.log('Ожидание подключений клиентов...');


wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
        console.log(`Received: ${message}`);
        ws.send(`You sent: ${message}`);
    });

    // Отправка сообщения клиенту
    ws.send('Привет, клиент!');
});


testapp.get('/', (req, res) => res.send('Hello world'));

server.listen(8080);
