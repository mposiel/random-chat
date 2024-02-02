import "./styles/Chat.css";
import Icon from "@mdi/react";
import {
  mdiRobotOffOutline,
  mdiSendVariantOutline,
  mdiStopCircleOutline,
} from "@mdi/js";
import { mdiAccount } from "@mdi/js";
import { useEffect, useState } from "react";
import { Message } from "./Message.jsx";
import Waiting from "./Waiting.jsx";
import { socket } from "../socket.jsx";

let curUser = 0;
//you - 1
//stranger - 2
let tempMessages = [];

export const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [messageSent, setMessageSent] = useState("");
  const [messageReceived, setMessageReceived] = useState("");
  const [loading, setLoading] = useState(true);
  const [roomID, setRoomID] = useState("");

  const displayMessage = (data) => {
    setMessages([
      ...messages,
      <Message author={data.author} messages={data.messages} />,
    ]);
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("match_found", (data) => {
      console.log("match found, room id: " + data);
      setLoading(false);
      setRoomID(data);
      socket.emit("join_room", data);
    });

    socket.on("stranger_disconnected", (data) => {
      console.log("stranger disconnected, leaving the room");
      socket.emit("leave_room", roomID);
      setRoomID("");
    });
  });

  const sendMessage = () => {
    if (roomID === "") {
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
        setMessageSent("");ls
        
      }
    }
  };

  const leaveChat = () => {
    if (roomID !== "") {
      console.log("leaving chat");
      socket.emit("disconnect_from_stranger", roomID);
      setRoomID("");
    }
  };

  return (
    <>
      <div className="content">
        <div className="container">
          <div className="chat-window">
            <h1>Chat</h1>

            {loading ? <Waiting /> : messages}
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
            <button className="end-btn" onClick={leaveChat}>
              <Icon path={mdiStopCircleOutline} size={1} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
