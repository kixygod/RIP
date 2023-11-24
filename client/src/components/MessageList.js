import React from 'react';

const MessageList = ({ messages }) => {
    return (
        <ul>
            {messages.map((message, index) => (
                <li key={index}>{`${message.nickname}: ${message.message}`}</li>
            ))}
        </ul>
    );
};


export default MessageList;
