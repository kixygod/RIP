import React from 'react';

const Message = ({ text, isServer }) => {
    const messageClass = isServer ? 'server-message' : 'client-message';

    return (
        <div className={`message ${messageClass}`}>
            {text}
        </div>
    );
};

export default Message;
