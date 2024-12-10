const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { Game } = require("./Classes/Game.js");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const gameRooms = new Map();

const createId = function () {
  return Math.floor(1000 + Math.random() * 9999);
};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Create the game
  socket.on("create-game", (callback) => {
    let roomId = createId();

    while (gameRooms.has(roomId)) {
      roomId = createId();
    }

    gameRooms.set(roomId, new Game());
    socket.join(roomId);
    callback({ roomId });
  });

  socket.on("join-game", ({ roomId, player }, callback) => {
    if (!gameRooms.has(roomId)) {
      return callback({ error: "Room not found" });
    }

    const game = gameRooms.get(roomId);
    game.players.push({ id: socket.id, ...player });

    callback({ success: true });
  });

  socket.on("make-move", ({ roomId, move }) => {});

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });

  socket.on("destroy", (roomId) => {
    socket.leaveAll();
    gameRooms.delete(roomId);
    console.log(`Room ${roomId} destroyed`);
  });
});

server.listen(3000, () => {
  console.log("Server is running");
});
