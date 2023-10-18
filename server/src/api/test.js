const express = require('express')
const testapp = express()
const server = require('http').createServer(testapp);
const WebSocket = require('ws');

const wss = new WebSocket.Server({ server: server });

wss.on('connection', function connection(ws) {
    console.log('A new client connected!');
    ws.send('Welcome to chat');

    ws.on('message', function incoming(message) {
        console.log('receiver: %s', message);
        ws.send('Got ur msg its: ' + message);
    });
});



testapp.get('/', (req, res) => res.send('Hello world'))

server.listen(8080, () => console.log('Lisening to port :8080'))