io.on("connection", (socket) => {
  console.log("Oyuncu bağlandı:", socket.id);

  // Mevcut oyuncu ekleme
  players[socket.id] = {
    x: Math.random() * 500,
    y: Math.random() * 500
  };
  io.emit("updatePlayers", players);

  // **CHAT MESAJI GELDİĞİNDE**
  socket.on("chatMessage", (msg) => {
    console.log(`Mesaj ${socket.id}: ${msg}`);
    // Tüm oyunculara gönder
    io.emit("chatMessage", { id: socket.id, message: msg });
  });

  // Hareket
  socket.on("move", (data) => {
    if (players[socket.id]) {
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
