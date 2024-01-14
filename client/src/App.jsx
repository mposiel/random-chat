import "./App.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Link,
  Outlet,
  Route,
} from "react-router-dom";
import { Chat } from "./components/Chat";
import { Home } from "./components/Home";



const socket = io("http://localhost:3001");

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route index element={<Home />} />
      <Route element={<Chat />} />

    </Route>)
  );

  const [room, setRoom] = useState("");
  const [messageSent, setMessageSent] = useState("");
  const [messageRecieved, setMessageRecieved] = useState("");

  const sendMessage = () => {
    socket.emit("send_message", { messageSent, room });
  };

  const joinRoom = () => {
    socket.emit("join_room", { room });
    console.log("Joined room: " + room);
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log(data);
      setMessageRecieved(data.messageSent);
    });
  }, [socket]);

  return (
    <div className="App">
      <input
        type="text"
        placeholder="Room number..."
        onChange={(event) => {
          setRoom(event.target.value);
        }}
      />
      <br />
      <button onClick={joinRoom}>Join Room</button>

      <br />
      <input
        type="text"
        placeholder="Message..."
        onChange={(event) => {
          setMessageSent(event.target.value);
        }}
      />
      <br />
      <button onClick={sendMessage}>Send</button>
      <br />
      <div id="message-container">{messageRecieved}</div>
    </div>
  );
}

const Root = () => {
  return (
    <>
      <div>
        <Link to="/">Home</Link> <Link to="/data">Chat</Link>
      </div>
      <div>
        <Outlet />
      </div>
    </>
  );
};

export default App;
