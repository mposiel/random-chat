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

io.on("connection", (socket) => {
  console.log(`a user connected: ${socket.id}`);

  socket.on("send_message", (data) => {

    console.log(data);


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
