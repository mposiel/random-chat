const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

let usersWaiting = [];
let activeRooms = [];


io.on("connection", (socket) => {
  console.log(`a user connected: ${socket.id}`);
  //add user to waiting list
  usersWaiting.push(socket.id);


  //check if there are enough users to create a room
  if (usersWaiting.length >= 2) {
    //create a room
    let roomName = usersWaiting[0] + usersWaiting[1];
    
    //add room to active rooms
    activeRooms.push(roomName);
    //send room name to users
    io.to(usersWaiting[0]).emit("room_created", {
      room: roomName,
      user: 0,
    });
    io.to(usersWaiting[1]).emit("room_created", {
      room: roomName,
      user: 1,
    });
    //remove users from waiting list
    usersWaiting.splice(0, 2);
  } else {
    //wait for another user to join
    socket.emit("waiting", null);
  }




  socket.on("send_message", (data) => {
    console.log("Data:",data);
    //doesn not send the message
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("join_room", (data) => {
    socket.join(data.room);
    console.log(`user with ID: ${socket.id} joined room: ${data.room}`);
  });

  socket.on("disconnect", () => {
    console.log(`user ${socket.id} disconnected`);
  });
});

server.listen(3001, () => {
  console.log("listening on port:3001");
});
