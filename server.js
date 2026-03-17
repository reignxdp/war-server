// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// WebSocket server, tüm domainlere izin (Vercel + mobil vs)
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Oyun durumunu saklayacağız
let players = {};

// Oyuncu bağlanınca
io.on("connection", (socket) => {
  console.log("Oyuncu bağlandı:", socket.id);

  // Rastgele başlangıç koordinatları
  players[socket.id] = {
    x: Math.random() * 500,
    y: Math.random() * 500,
  };

  // Tüm oyunculara güncel oyuncu listesi gönder
  io.emit("updatePlayers", players);

  // Oyuncu hareket edince
  socket.on("move", (data) => {
    if (players[socket.id]) {
      players[socket.id].x = data.x;
      players[socket.id].y = data.y;
    }
    io.emit("updatePlayers", players);
  });

  // Oyuncu disconnect olunca
  socket.on("disconnect", () => {
    delete players[socket.id];
    io.emit("updatePlayers", players);
  });
});

// Opsiyonel: / açınca basit mesaj
app.get("/", (req, res) => {
  res.send("Server çalışıyor!");
});

// Server portu (Render bunu otomatik yönlendiriyor)
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});
