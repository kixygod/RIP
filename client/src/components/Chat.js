import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const Chat = () => {
    const [socket, setSocket] = useState(null);
    const [nickname, setNickname] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const newSocket = io('ws://localhost:8080'); // Подставьте ваш URL сервера

        newSocket.on('connect', () => {
            console.log('Connected to the server'); // Добавляем логирование для подтверждения подключения
        });

        newSocket.on('message', (message) => {
            // message уже является объектом, так что нет необходимости в JSON.parse
            if (message.event === 'message') {
                setMessages((prevMessages) => [...prevMessages, message.data]);
            }
        });


        setSocket(newSocket);

        return () => newSocket.close(); // Закрываем соединение при размонтировании компонента
    }, []);

    const sendMessage = (message) => {
        if (socket) {
            const messageObject = { event: 'message', data: { message, nickname } };
            socket.emit('message', messageObject); // Убираем JSON.stringify
        }
    };


    // Установка никнейма и отправка на сервер не реализована на сервере, 
    // так что этот блок кода можно удалить или добавить соответствующую логику на сервер
    // useEffect(() => {
    //     if (socket && nickname) {
    //         socket.emit('setNickname', nickname);
    //     }
    // }, [nickname, socket]);

    return (
        <div>
            <MessageList messages={messages} />
            <MessageInput sendMessage={sendMessage} setNickname={setNickname} />
        </div>
    );
};

export default Chat;
