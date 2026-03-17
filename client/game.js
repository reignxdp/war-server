// Render server linki burada
const socket = io("https://war-server-5u9e.onrender.com"); 

let players = {};

// Phaser oyun config
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: {
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

function create() {}

function update() {
  // Tıklayınca oyuncu koordinatlarını gönder
  if (this.input.activePointer.isDown) {
    socket.emit("move", {
      x: this.input.x,
      y: this.input.y
    });
  }

  // Basit çizim
  const ctx = game.canvas.getContext("2d");
  ctx.clearRect(0, 0, game.config.width, game.config.height);
  ctx.fillStyle = "red";

  for (let id in players) {
    let p = players[id];
    ctx.fillRect(p.x, p.y, 20, 20);
  }
}

// Serverdan oyuncu verisi al
socket.on("updatePlayers", (data) => {
  players = data;
  // Konsolda test edebilirsin
  console.log(players);
});
