import "./styles/Chat.css";
import Icon from "@mdi/react";
import { mdiSendVariantOutline, mdiStopCircleOutline } from "@mdi/js";
import { mdiAccount } from "@mdi/js";
import { useState } from "react";
import { Message } from "./Message.jsx";

let curUser = 0;
//you - 1
//stranger - 2
let tempMessages = [];

export const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [messageSent, setMessageSent] = useState("");

  const displayMessage = (data) => {
    setMessages([
      ...messages,
      <Message author={data.author} messages={data.messages} />,
    ]);
  };

  const sendMessage = () => {
    if (messageSent.trim() !== "") {
      console.log(messageSent);

      if (curUser === 0 || curUser === 1) {
        tempMessages.push(messageSent);
        messages.pop();
        setMessages(messages);
        curUser = 1;
      } else {
        tempMessages = [];
        tempMessages.push(messageSent);
        curUser = 1;
      }

      displayMessage({ messages: tempMessages, author: "You" });
      setMessageSent("");
    }
  };

  return (
    <>
      <div className="content">
        <div className="container">
          <div className="chat-window">
            <h1>Chat</h1>
            {messages}
          </div>

          <div className="controls">
            <div className="input">
              <input
                type="text"
                placeholder="Type a message..."
                onChange={(event) => {
                  setMessageSent(event.target.value);
                }}
                value={messageSent}
              />
            </div>
            <button className="send-btn" onClick={sendMessage}>
              <Icon path={mdiSendVariantOutline} size={1} />
            </button>
            <button className="end-btn">
              <Icon path={mdiStopCircleOutline} size={1} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
