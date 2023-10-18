import React, { useEffect, useState, useMemo } from 'react';
import { io } from 'socket.io-client';
import { Link } from 'react-router-dom';
import Message from './Message'; // Импортируйте компонент Message

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    const socket = useMemo(() => {
        return io('ws://localhost:8080');
    }, []);

    useEffect(() => {
        socket.onmessage = (event) => {
            const message = event.data;
            setMessages((prevMessages) => [...prevMessages, { text: message, isServer: true }]);
        };

        return () => {
            socket.close();
        };
    }, [socket]);

    const handleSendMessage = () => {
        if (newMessage.trim() === '') {
            return;
        }

        socket.send(newMessage);
        setMessages((prevMessages) => [...prevMessages, { text: newMessage, isServer: false }]);
        setNewMessage('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div style={{ fontFamily: 'Roboto, sans-serif', fontSize: '1.5rem' }}>
            <Link to="/">Перейти к задачам</Link>
            <div className="message-container">
                {messages.map((message, index) => (
                    <Message key={index} text={message.text} isServer={message.isServer} />
                ))}
            </div>
            <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
            />
            <button onClick={handleSendMessage}>Отправить</button>
        </div>
    );
};

export default Chat;
