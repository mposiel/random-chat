import React from "react";
import "./styles/ChatStop.css";

export const ChatStop = ({whoLeft, onClick}) => {
  
  return (
    <div className={`user_disconnected`}>
      <h3>{`${whoLeft} left the chat!`}</h3>
      <button onClick={onClick}>New Connection</button>
    </div>
  );
};
