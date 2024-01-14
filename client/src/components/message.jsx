import React from 'react';

const Message = ({ author, messages }) => {
    return (
        <div>
            <h3>{author}</h3>
            {messages.map((message, index) => (
                <p key={index}>{message}</p>
            ))}
        </div>
    );
};

export default Message;
