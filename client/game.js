const socket = io(); // Aynı domain

let players = {};

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: {
    create:create,
    update:update
  }
};

const game = new Phaser.Game(config);

function create(){}

function update(){
  if(this.input.activePointer.isDown){
    socket.emit("move", { x:this.input.x, y:this.input.y });
  }

  const ctx = game.canvas.getContext("2d");
  ctx.clearRect(0,0,game.config.width,game.config.height);
  ctx.fillStyle = "red";

  for(let id in players){
    const p = players[id];
    ctx.fillRect(p.x,p.y,20,20);
  }
}

socket.on("updatePlayers", (data)=>{ players = data; });
