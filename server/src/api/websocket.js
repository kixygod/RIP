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
        // Теперь message должен быть объектом, так что его не нужно парсить.
        console.log('Received:', message);

        switch (message.event) {
            case 'message':
                broadCastMessage(message)
                break;
            case 'connection':
                // При подключении клиента отправляем приветственное сообщение
                ws.emit('message', { event: 'message', data: 'Привет, клиент!' });
                break;
        }
    });



    // Отправка приветственного сообщения клиенту в формате JSON
    ws.send(JSON.stringify({ event: 'message', data: 'Привет, клиент!' }));
});

function broadCastMessage(message) {
    // Это отправит сообщение всем клиентам, подключенным к серверу
    wss.emit('message', message); // Убираем JSON.stringify
}




testapp.get('/', (req, res) => res.send('Hello world'));

server.listen(8080);