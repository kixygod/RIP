import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const Chat = () => {
    const [socket, setSocket] = useState(null);
    const [nickname, setNickname] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const newSocket = io('ws://localhost:8080');

        newSocket.on('connect', () => {
            console.log('Connected to the server');
        });

        newSocket.on('message', (message) => {
            if (message.event === 'message') {
                setMessages((prevMessages) => [...prevMessages, message.data]);
            }
        });


        setSocket(newSocket);

        return () => newSocket.close();
    }, []);

    const sendMessage = (message) => {
        if (socket) {
            const messageObject = { event: 'message', data: { message, nickname } };
            socket.emit('message', messageObject);
        }
    };

    return (
        <div>
            <MessageList messages={messages} />
            <MessageInput sendMessage={sendMessage} setNickname={setNickname} />
        </div>
    );
};

export default Chat;
