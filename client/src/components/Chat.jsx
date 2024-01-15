import "./styles/Chat.css";
import Icon from "@mdi/react";
import { mdiSendVariantOutline, mdiStopCircleOutline } from "@mdi/js";
import { mdiAccount } from "@mdi/js";
import { useEffect, useState } from "react";
import { Message } from "./Message.jsx";
import io from "socket.io-client";
import Waiting from "./Waiting.jsx";

let curUser = 0;
//you - 1
//stranger - 2
let tempMessages = [];

const socket = io("http://localhost:3001");


export const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [messageSent, setMessageSent] = useState("");
  const [messageReceived, setMessageReceived] = useState("");
  const [loading, setLoading] = useState(true);
  const [room, setRoom] = useState("");

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

      socket.emit("send_message", { messageSent, room: room });

      displayMessage({ messages: tempMessages, author: "You" });
      setMessageSent("");
    }
  };

  useEffect(() => {
    socket.on("room_created", (data) => {
      console.log(data);
      setRoom(data.room);
      setLoading(false);
    });

    //something to fix there, does not receive message
    socket.on("receive_message", (data) => {
      console.log(data);
      if (curUser === 0 || curUser === 2) {
        tempMessages.push(data.messageReceived);
        messages.pop();
        setMessages(messages);
        curUser = 2;
      } else {
        tempMessages = [];
        tempMessages.push(data.messageReceived);
        curUser = 2;
      }

      displayMessage({ messages: tempMessages, author: "Stranger" });
    });
  }, [socket]);

  return (
    <>
      <div className="content">
        <div className="container">
          <div className="chat-window">
            <h1>Chat</h1>

            {loading ? <Waiting /> :  messages }
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
