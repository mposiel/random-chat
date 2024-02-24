import "./styles/Home.css";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket.jsx";
import { LanguageContext } from "./contexts/languageContext.jsx";

export const Home = ({ updateActiveState }) => {
  const navigate = useNavigate();
  const {language, setLanguage} = useContext(LanguageContext);

  const startChat = () => {
    updateActiveState(true);
    console.log("looking for match");
    socket.emit("looking_for_match", { language });
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
        </div>
        <div className="home-controls">
          <div className="language">
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
            >
              <option value="dan">Danish</option>
              <option value="deu">German</option>
              <option value="eng">English</option>
              <option value="fin">Finnish</option>
              <option value="fra">French</option>
              <option value="ita">Italian</option>
              <option value="jpn">Japanese</option>
              <option value="nld">Dutch</option>
              <option value="nor">Norwegian</option>
              <option value="pl">Polish</option>
              <option value="por">Portuguese</option>
              <option value="rus">Russian</option>
              <option value="spa">Spanish</option>
              <option value="swe">Swedish</option>
            </select>
          </div>
          <button className="start-btn" onClick={startChat}>
            Start chatting
          </button>
        </div>
      </div>
    </>
  );
};
