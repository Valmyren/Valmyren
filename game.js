let playerStats={
  hp:100,
  xp:0,
  gold:50,
  inventory:[]
}

const config={
  type:Phaser.AUTO,
  width:window.innerWidth,
  height:window.innerHeight,
  parent:"game",
  physics:{
    default:"arcade"
  },
  scene:{
    preload:preload,
    create:create,
    update:update
  }
}

const game=new Phaser.Game(config)

let player
let cursors
let enemies

function preload(){
  this.load.image("ground","https://labs.phaser.io/assets/tilemaps/tiles/grass.png")
  this.load.image("player","https://labs.phaser.io/assets/sprites/phaser-dude.png")
  this.load.image("dragon","https://labs.phaser.io/assets/sprites/dragon.png")
}

function create(){
  this.add.tileSprite(0,0,2000,2000,"ground").setOrigin(0)
  player=this.physics.add.sprite(400,300,"player")
  cursors=this.input.keyboard.createCursorKeys()

  enemies=this.physics.add.group()
  for(let i=0;i<5;i++){
    let e=enemies.create(
      Phaser.Math.Between(200,1000),
      Phaser.Math.Between(200,1000),
      "dragon"
    )
    e.setScale(0.5)
  }

  this.physics.add.overlap(player,enemies,hitEnemy,null,this)
}

function update(){
  player.setVelocity(0)
  if(cursors.left.isDown){ player.setVelocityX(-200) }
  if(cursors.right.isDown){ player.setVelocityX(200) }
  if(cursors.up.isDown){ player.setVelocityY(-200) }
  if(cursors.down.isDown){ player.setVelocityY(200) }
}

function hitEnemy(player,enemy){
  enemy.destroy()
  playerStats.xp+=50
  playerStats.gold+=20
  updateUI()
  loot()
}

function loot(){
  const items=[
    "Potion",
    "Épée",
    "Arc",
    "Armure",
    "Anneau magique"
  ]
  let item=items[Math.floor(Math.random()*items.length)]
  playerStats.inventory.push(item)
  updateUI()
}

function updateUI(){
  document.getElementById("xp").innerText=playerStats.xp
  document.getElementById("gold").innerText=playerStats.gold

  let inv=""
  playerStats.inventory.forEach(i=>{
    inv+=i+"<br>"
  })
  document.getElementById("inventory").innerHTML=inv
}
