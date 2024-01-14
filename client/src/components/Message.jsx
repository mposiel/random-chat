import React from 'react';

export const Message = ({ author, messages }) => {
    return (
        <div>
            <h3>{author}</h3>
            {messages.map((message, index) => (
                <p key={index}>{message}</p>
            ))}
        </div>
    );
};


