import "./styles/Home.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket.jsx";


export const Home = () => {
  const navigate = useNavigate();
  const startChat = () => {
    console.log("looking for match");
    socket.emit("looking_for_match");
    navigate("/chat");
  };

  return (
    <>
      <div className="content">
        <div className="head-text">
          <h1>
            Welcome to RandomChat – <br />
            where connections happen naturally!
          </h1>
        </div>
        <div className="lower-text">
          <p>
            Discover interesting conversations with random people from around
            the world. Make new friends, share experiences, and embrace the joy
            of spontaneous connections. Start chatting now and let the
            randomness unfold!
          </p>

          <button className="start-btn" onClick={startChat}>
            Start chatting
          </button>
        </div>
      </div>
    </>
  );
};
