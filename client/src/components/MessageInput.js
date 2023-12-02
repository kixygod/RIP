import React, { useState } from 'react';

const MessageInput = ({ sendMessage, setNickname }) => {
    const [inputValue, setInputValue] = useState('');

    const handleMessageSend = () => {
        if (inputValue.trim() !== '') {
            sendMessage(inputValue);
            setInputValue('');
        }
    };

    const handleNicknameChange = (event) => {
        setNickname(event.target.value);
    };

    function handleKeyDown(event) {
        if (event.key === 'Enter') {
            if (inputValue.trim() !== '') {
                handleMessageSend();
            }
        }
    }

    return (
        <div className='chat-input-column'>
            <input
                className='chat-input'
                type="text"
                placeholder="Введите имя"
                onChange={handleNicknameChange}
            />
            <input
                className='chat-input'
                type="text"
                placeholder="Введите сообщение..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <button onClick={handleMessageSend}>Отправить</button>
        </div>
    );
};

export default MessageInput;
