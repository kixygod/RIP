const express = require("express");
const testapp = express();
const server = require("http").createServer(testapp);
const WebSocketServer = require("ws");
var cors = require("cors");
testapp.use(cors());

const wss = require("socket.io")(server, { cors: { origin: "*" } });

console.log("WebSocket-сервер работает на порту 8080");
console.log("Ожидание подключений клиентов...");

wss.on("connection", (ws) => {
    console.log("Client connected");

    ws.on("message", (message) => {
        console.log("Received:", message);

        switch (message.event) {
            case "message":
                broadCastMessage(message);
                break;
            case "connection":
                ws.emit("message", { event: "message", data: "Привет, клиент!" });
                break;
        }
    });

    ws.send(JSON.stringify({ event: "message", data: "Привет, клиент!" }));
});

function broadCastMessage(message) {
    wss.emit("message", message);
}

testapp.get("/", (req, res) => res.send("Hello world"));

server.listen(8080);
