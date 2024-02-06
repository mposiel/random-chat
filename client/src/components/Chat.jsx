import "./styles/Chat.css";
import Icon from "@mdi/react";
import {
  mdiRobotOffOutline,
  mdiSendVariantOutline,
  mdiStopCircleOutline,
} from "@mdi/js";
import { mdiAccount } from "@mdi/js";
import { useEffect, useState, useRef } from "react";
import { Message } from "./Message.jsx";
import Waiting from "./Waiting.jsx";
import { ChatStop } from "./ChatStop.jsx";
import { socket } from "../socket.jsx";

export const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [messageSent, setMessageSent] = useState("");
  const [loading, setLoading] = useState(true);
  const [stopChat, setStopChat] = useState(false);
  const [whoLeft, setWhoLeft] = useState("");

  const roomID = useRef("");
  const userID = useRef("");
  const uniqueMessageKey = useRef(0);

  const displayMessage = (data) => {
    const newMessage = (
      <Message
        key={uniqueMessageKey.current}
        author={data.author}
        message={data.message}
      />
    );
    setMessages((prevMessages) => [newMessage, ...prevMessages]);
    uniqueMessageKey.current++;
  };

  useEffect(() => {
    const handleConnect = () => {
      console.log("connected");
    };

    const handleMatchFound = (data) => {
      console.log("match found, room id: " + data.roomID);
      console.log("your ID:" + data.myID);
      setLoading(false);
      roomID.current = data.roomID;
      userID.current = data.myID;
      socket.emit("join_room", data.roomID);
    };

    const handleStrangerDisconnected = () => {
      console.log("stranger disconnected, leaving the room");
      socket.emit("leave_room", roomID.current);
      roomID.current = "";
      setWhoLeft("Stranger");
      setStopChat(true);
    };

    const handleReceiveMessage = (data) => {
      // console.log("data received: " + data);
      displayMessage({ message: data.message, author: "Stranger" });
    };

    socket.on("connect", handleConnect);
    socket.on("match_found", handleMatchFound);
    socket.on("stranger_disconnected", handleStrangerDisconnected);
    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("match_found", handleMatchFound);
      socket.off("stranger_disconnected", handleStrangerDisconnected);
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [socket, roomID.current]);

  const sendMessage = () => {
    if (roomID.current !== "") {
      if (messageSent.trim() !== "") {
        displayMessage({ message: messageSent, author: "You" });
        setMessageSent("");
        socket.emit("send_message", {
          message: messageSent,
          author: userID.current,
          roomID: roomID.current,
        });
      }
    }
  };

  const leaveChat = () => {
    if (roomID.current !== "") {
      console.log("leaving chat");
      socket.emit("disconnect_from_stranger", roomID.current);
      socket.emit("leave_room", roomID.current);
      roomID.current = "";
      setWhoLeft("You");
      setStopChat(true);
    }
  };

  const handleNewConnection = () => {
    setStopChat(false);
    setLoading(true);
    setMessages([]);
    setMessageSent("");
    uniqueMessageKey.current = 0;
    socket.emit("looking_for_match");
  };

  return (
    <>
      <div className="content">
        <div className="container">
          <div className="chat-window">
            {stopChat ? (
              <ChatStop whoLeft={whoLeft} onClick={handleNewConnection} />
            ) : (
              <h1>Chat</h1>
            )}
            <div className="messages">{loading ? <Waiting /> : messages}</div>
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
