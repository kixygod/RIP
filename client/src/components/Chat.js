import React, { useEffect, useState, useMemo } from 'react';
import { io } from 'socket.io-client';
import { Link } from 'react-router-dom';
import Message from './Message'; // Импортируйте компонент Message

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [userName, setUserName] = useState('');


    const socket = useMemo(() => {
        return io('ws://localhost:8080');
    }, []);

    useEffect(() => {
        socket.on = (event) => {
            const message = JSON.parse(event.data)
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

        const messageObject = { event: 'message', message: newMessage, user: userName };
        socket.send(JSON.stringify(messageObject));
        setMessages((prevMessages) => [...prevMessages, { text: newMessage, isServer: false, user: userName }]);
        setNewMessage('');
    };

    const handleSetUserName = () => {
        if (userName.trim() !== '') {
            // Отправить имя на сервер (если требуется)
            // Начать чат
            setUserName(userName);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div style={{ fontFamily: 'Roboto, sans-serif', fontSize: '1.5rem' }}>
            {userName ? (
                <>
                    <Link to="/">Перейти к задачам</Link>
                    <div className="message-container">
                        {/* Отображение сообщений чата */}
                    </div>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <button onClick={handleSendMessage}>Отправить</button>
                </>
            ) : (
                <div>
                    <p>Пожалуйста, введите ваше имя:</p>
                    <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                    <button onClick={handleSetUserName}>Войти в чат</button>
                </div>
            )}
        </div>
    );




};

export default Chat;
