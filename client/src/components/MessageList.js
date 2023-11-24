import React, { useEffect, useRef } from 'react';

const MessageList = ({ messages }) => {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="chat-line">
            {messages.map((message, index) => (
                <div className='message' key={index}>{`${message.nickname}: ${message.message}`}</div>
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default MessageList;
