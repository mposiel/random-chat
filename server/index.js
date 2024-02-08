const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { getMaxListeners } = require("events");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://10.10.100.165:5173",
    methods: ["GET", "POST"],
  },
});

let usersWaiting = [];
let activeRooms = [];

// function random_user(users) {
//   return users[Math.floor(Math.random() * users.length)];
// }

function getMatch(users, language) {
  for (let i = 0; i < users.length - 1; i++) {
    if (users[i].language === language) {
      let found = users[i];
      usersWaiting = usersWaiting.filter((user) => user.id !== found.id);
      return found;
    }
  }
  return null;
}

let roomNumber = 0;

function getRoomName() {
  return `room_${roomNumber++}`;
}

io.on("connection", (socket) => {
  console.log(`a user connected: ${socket.id}`);

  socket.on("looking_for_match", ({ language }) => {
    console.log("looking_for_match, id:", socket.id);
    usersWaiting.push({ id: socket.id, language: language });
    console.log("usersWaiting:", usersWaiting);

    if (usersWaiting.length >= 2) {
      const user2 = getMatch(usersWaiting, language);
      if (user2 === null) {
        return;
      }

      const user1 = usersWaiting.pop();

      const roomName = getRoomName();

      io.to(user1.id).emit("match_found", { roomID: roomName, myID: user1.id });
      io.to(user2.id).emit("match_found", { roomID: roomName, myID: user2.id });

      activeRooms.push(roomName);
      console.log("activeRooms:", activeRooms);
    }
  });

  socket.on("join_room", (roomName) => {
    console.log("join_room, id:", socket.id);
    socket.join(roomName);
    socket.to(roomName).emit("user_joined", socket.id);
  });

  socket.on("send_message", (data) => {
    console.log("send_message, id:", socket.id);
    console.log(`roomName: '${data.roomID}'`);
    console.log("message:", data.message);
    socket.to(data.roomID).emit("receive_message", data);
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

  socket.on("disconnecting", () => {
    console.log(socket.rooms);
    let temp = Array.from(socket.rooms);
    socket.to(temp[1]).emit("stranger_disconnected");
  });

  socket.on("disconnect", () => {
    console.log(`user disconnected: ${socket.id}`);
    usersWaiting = usersWaiting.filter((user) => user.id !== socket.id);
    console.log("usersWaiting:", usersWaiting);
    activeRooms = activeRooms.filter((room) => !room.includes(socket.id));
    console.log("activeRooms:", activeRooms);
  });
});

// server.listen(3001, () => {
//   console.log("listening on port:3001");
// });

const host = "10.10.100.165";
const port = 3001;

server.listen(port, host, () => {
  console.log(`Server is running at http://${host}:${port}`);
});
