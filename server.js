const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(express.static(path.join(__dirname, "client")));

let players = {};

io.on("connection", (socket) => {
  console.log("Oyuncu bağlandı:", socket.id);

  players[socket.id] = { x: Math.random()*500, y: Math.random()*500 };
  io.emit("updatePlayers", players);

  // CHAT
  socket.on("chatMessage", (msg) => {
    console.log(`Mesaj ${socket.id}: ${msg}`);
    io.emit("chatMessage", { id: socket.id, message: msg });
  });

  // Hareket
  socket.on("move", (data) => {
    if(players[socket.id]){
      players[socket.id].x = data.x;
      players[socket.id].y = data.y;
    }
    io.emit("updatePlayers", players);
  });

  socket.on("disconnect", () => {
    delete players[socket.id];
    io.emit("updatePlayers", players);
  });
});

// index.html’i göster
app.get("/", (req,res) => {
  res.sendFile(path.join(__dirname, "client/index.html"));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server ${PORT} portunda çalışıyor`));
