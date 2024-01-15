import React from 'react';
import "./styles/Message.css";

export const Message = ({ author, messages }) => {
    return (
        <div className='Message'>
            <h3>{author}</h3>
            {messages.map((message, index) => (
                <p key={index}>{message}</p>
            ))}
        </div>
    );
};


