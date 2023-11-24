import React, { useEffect, useRef } from 'react';

const MessageList = ({ messages }) => {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]); // Вызывать scrollToBottom при каждом обновлении сообщений

    return (
        <div className="chat-line">
            {messages.map((message, index) => (
                <div className='message' key={index}>{`${message.nickname}: ${message.message}`}</div>
            ))}
            {/* Элемент, к которому будет выполнена прокрутка */}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default MessageList;
