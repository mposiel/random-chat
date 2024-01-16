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

function random_user(users) {
  return users[Math.floor(Math.random() * users.length)];
}

io.on("connection", (socket) => {
  console.log(`a user connected: ${socket.id}`);

  socket.on("looking_for_match", () => {
    console.log("looking_for_match, id:", socket.id);
    usersWaiting.push(socket.id);
    console.log("usersWaiting:", usersWaiting);

    if (usersWaiting.length >= 2) {
      const user1 = random_user(usersWaiting);
      usersWaiting = usersWaiting.filter((user) => user !== user1);
      const user2 = random_user(usersWaiting);
      usersWaiting = usersWaiting.filter((user) => user !== user2);

      const roomName = `${user1}_and_${user2}`;

      io.to(user1).emit("match_found", roomName);
      io.to(user2).emit("match_found", roomName);

      activeRooms.push(roomName);
      console.log("activeRooms:", activeRooms);
    }
  });

  socket.on("join_room", (roomName) => {
    console.log("join_room, id:", socket.id);
    socket.join(roomName);
    socket.to(roomName).emit("user_joined", socket.id);
  });

  socket.on("disconnect_from_stranger", (roomName) => {
    console.log("disconnect_from_stranger, id:", socket.id);
    console.log("roomName:", roomName);
    socket.to(roomName).emit("stranger_disconnected", socket.id);
    socket.leave(roomName);
  });

  socket.on("leave_room", (roomName) => {
    console.log("leave_room, id:", socket.id);
    socket.leave(roomName);
    activeRooms = activeRooms.filter((room) => !room.includes(socket.id));
  });



  socket.on("disconnect", () => {
    console.log(`user disconnected: ${socket.id}`);
    usersWaiting = usersWaiting.filter((user) => user !== socket.id);
    console.log("usersWaiting:", usersWaiting);
    activeRooms = activeRooms.filter((room) => !room.includes(socket.id));
    console.log("activeRooms:", activeRooms);
  });
});

server.listen(3001, () => {
  console.log("listening on port:3001");
});
