import React, { useState } from 'react';

const MessageInput = ({ sendMessage, setNickname }) => {
    const [inputValue, setInputValue] = useState('');

    const handleMessageSend = () => {
        sendMessage(inputValue);
        setInputValue('');
    };

    const handleNicknameChange = (event) => {
        setNickname(event.target.value);
    };

    return (
        <div className='chat-input-column'>
            <input
                className='chat-input'
                type="text"
                placeholder="Enter your nickname"
                onChange={handleNicknameChange}
            />
            <input
                className='chat-input'
                type="text"
                placeholder="Type a message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
            />
            <button onClick={handleMessageSend}>Send</button>
        </div>
    );
};

export default MessageInput;
