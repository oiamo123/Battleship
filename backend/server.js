const express = require("express");
const http = require("http");
const Server = require("socket.io-Client");
const { Game } = require("./Classes/Game.js");
const { Player } = require("./Classes/Player.js");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const gameRooms = new Map();

const createId = function () {
  return Math.floor(1000 + Math.random() * 9999);
};

const createPlayer = function (playerData) {
  const player = new Player(playerData.name);

  playerData.ships.forEach((ship) => {
    player.placeShip(ship.start, ship.end);
  });

  return player;
};

io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("create-game", (callback, playerData) => {
    let roomId = createId();
    const player = createPlayer(playerData);

    while (gameRooms.has(roomId)) {
      roomId = createId();
    }

    const game = new Game();
    game.addPlayer(player);
    gameRooms.set(roomId, game);

    socket.join(roomId);
    callback({ roomId });
  });

  socket.on("join-game", ({ roomId, playerData }, callback) => {
    if (!gameRooms.has(roomId)) {
      return callback({ error: "Room not found" });
    }

    // add the player to the game
    const game = gameRooms.get(roomId);
    const player = createPlayer(playerData);
    game.addPlayer(player);

    socket.join(roomId);
    callback({ success: true });
  });

  socket.on("make-move", ({ roomId, move }) => {
    const game = gameRooms.get(roomId);

    if (!game) {
      return socket.emit("error", { message: "Game not found" });
    }

    game.attack(move.name, move.coords, move.type);

    io.to(roomId).emit("game-state", game);
  });

  socket.on("disconnect", () => {
    gameRooms.forEach((game) => {
      game.removePlayer(socket.id);
    });
    console.log("A user disconnected:", socket.id);
  });

  socket.on("destroy", (roomId) => {
    gameRooms.delete(roomId);
    io.to(roomId).emit("game-destroyed");
    console.log(`Room ${roomId} destroyed`);
  });
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
