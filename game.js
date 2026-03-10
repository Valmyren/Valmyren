let playerStats={
  hp:100,
  xp:0,
  gold:50,
  inventory:[]
};

const config={
  type:Phaser.AUTO,
  width:window.innerWidth,
  height:window.innerHeight,
  parent:"game",
  physics:{
    default:"arcade",
    arcade:{ debug:false }
  },
  scene:{
    preload:preload,
    create:create,
    update:update
  }
};

const game=new Phaser.Game(config);

let player;
let cursors;
let enemies;

function preload(){
  this.load.image("ground","https://labs.phaser.io/assets/tilemaps/tiles/grass.png");
  this.load.image("player","https://labs.phaser.io/assets/sprites/phaser-dude.png");
  this.load.image("dragon","https://labs.phaser.io/assets/sprites/dragon.png");
}

function create(){
  // Fond adapté à l’écran
  this.add.tileSprite(0,0,window.innerWidth,window.innerHeight,"ground").setOrigin(0);

  // Création du joueur
  player=this.physics.add.sprite(window.innerWidth/2, window.innerHeight/2,"player");
  player.setCollideWorldBounds(true);

  // Création des dragons
  enemies=this.physics.add.group();
  for(let i=0;i<5;i++){
    let e=enemies.create(
      Phaser.Math.Between(50, window.innerWidth-50),
      Phaser.Math.Between(50, window.innerHeight-50),
      "dragon"
    );
    e.setScale(0.5);
  }

  this.physics.add.overlap(player,enemies,hitEnemy,null,this);

  // Clavier pour PC
  cursors=this.input.keyboard.createCursorKeys();

  // Boutons tactiles pour mobile
  createMobileControls(this);
}

function update(){
  // PC : mouvement avec flèches
  if(cursors){
    player.setVelocity(0);
    if(cursors.left.isDown){ player.setVelocityX(-200); }
    if(cursors.right.isDown){ player.setVelocityX(200); }
    if(cursors.up.isDown){ player.setVelocityY(-200); }
    if(cursors.down.isDown){ player.setVelocityY(200); }
  }
}

function hitEnemy(player,enemy){
  enemy.destroy();
  playerStats.xp+=50;
  playerStats.gold+=20;
  updateUI();
  loot();
}

function loot(){
  const items=["Potion","Épée","Arc","Armure","Anneau magique"];
  let item=items[Math.floor(Math.random()*items.length)];
  playerStats.inventory.push(item);
  updateUI();
}

function updateUI(){
  document.getElementById("xp").innerText=playerStats.xp;
  document.getElementById("gold").innerText=playerStats.gold;

  let inv="";
  playerStats.inventory.forEach(i=>{
    inv+=i+"<br>";
  });
  document.getElementById("inventory").innerHTML=inv;
}

// Boutons tactiles pour mobile
function createMobileControls(scene){
  let size=60;
  let padding=10;

  let up=scene.add.rectangle(size+padding, window.innerHeight-size*2-padding, size, size, 0x555555).setInteractive();
  let down=scene.add.rectangle(size+padding, window.innerHeight-padding, size, size, 0x555555).setInteractive();
  let left=scene.add.rectangle(padding, window.innerHeight-size-padding, size, size, 0x555555).setInteractive();
  let right=scene.add.rectangle(size*2+padding*2, window.innerHeight-size-padding, size, size, 0x555555).setInteractive();

  up.on('pointerdown', ()=> player.setVelocityY(-200));
  up.on('pointerup', ()=> player.setVelocityY(0));

  down.on('pointerdown', ()=> player.setVelocityY(200));
  down.on('pointerup', ()=> player.setVelocityY(0));

  left.on('pointerdown', ()=> player.setVelocityX(-200));
  left.on('pointerup', ()=> player.setVelocityX(0));

  right.on('pointerdown', ()=> player.setVelocityX(200));
  right.on('pointerup', ()=> player.setVelocityX(0));
}
