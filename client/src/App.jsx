import './App.css'
import io from 'socket.io-client'
import { useEffect, useState } from 'react'

const socket = io('http://localhost:3001')


function App() {

  const sendMessage = () => {
    socket.emit('send_message', "hello");
  };

  useEffect(() => {
    socket.on('recieve_message', (message) => {
      alert(message);
    })
  }, [socket]);

  return (
    <div className="App">
      <input type="text" placeholder="Message..." />
      <button onClick={sendMessage}>Send</button>
    </div>
  )
}

export default App
