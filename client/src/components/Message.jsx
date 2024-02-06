import React from "react";
import "./styles/Message.css";



export const Message = ({ author, message }) => {
  return (
    <div className={`message_${author}`}>
      <h3>{author}</h3>
        <p>{message}</p>
    </div>
  );
};
