// the Game object used by the phaser.io library
var stateActions = { preload: preload, create: create, update: update };

// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)
var game = new Phaser.Game(790, 400, Phaser.AUTO, 'game', stateActions);
var score = 0;
var gameGravity = 400;
var gameVelocity = -200;
var pipeVerticalSpeed = 10;
// var hasBullets = false;
// var numOfBullets;
// var bullets = [];
var pipes = [];
var gameOverImage;
var player;
var player2;
var labelScore;
var numOfPlayers;
// var furthestBulletPositionInArray = 0;
// var bulletOnScreen = false;


/*
* Loads all resources for the game and gives them names.
*/
function preload()  {
  game.load.image("playerImg", "../assets/trump_small.gif");
  game.load.image("pipeBlock","../assets/clinton_small.gif");
  game.load.image("backgroundImage", "../assets/usa_flag_small.jpeg");
  game.load.image("gameOverImage", "../assets/screenshotOver.jpg");
  game.load.image("star", "../assets/star.png");
  // game.load.image("bullet", "../assets/pipe2-end.png");
  game.load.audio("score", "../assets/point.ogg");

}

/*
* Initialises the game. This function is only called once.
*/
function create() {
  // set the background colour of the scene

  var backgroundVelocity = 200;
  var backgroundSprite = game.add.tileSprite(0, 0, 800, 400, "backgroundImage");

  backgroundSprite.autoScroll(-backgroundVelocity, 0);

  game.add.text(450, 10, "Make America Great Again!", {font: "20px Courier", fill: "#FFFFFF"});
  player = game.add.sprite(75, 270, "playerImg");
  player.anchor.setTo(0.5, 0.5);

  player2 = game.add.sprite(75, 200,"star");
  player2.anchor.setTo(0.5,0.5);

  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.physics.arcade.enable(player);
  game.physics.arcade.enable(player2);

  splashDisplay = game.add.text(150,190, "Press ENTER for 1 Player, '2' Key for 2 Player.", {font: "20px Courier", fill: "#FF0000"});
  splashDisplay2 = game.add.text(150,230, "Player 1 (Trump) - Spacebar to jump", {font: "20px Courier", fill: "#000000"});
  splashDisplay3 = game.add.text(150,250, "Player 2 (Star) - Up Arrow Key to jump", {font: "20px Courier", fill: "#000000"});

  game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onDown.add(start);
  game.input.keyboard.addKey(Phaser.Keyboard.TWO).onDown.add(start2Player);
}

/*
* This function updates the scene. It is called for every new frame.
*/

function start() {
  splashDisplay.destroy();
  splashDisplay2.destroy();
  splashDisplay3.destroy();
  numOfPlayers = 1;

  player2.destroy();

  game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(playerJump);

  labelScore = game.add.text(20, 10, "0", {font: "30px Courier", fill: "#FFFFFF"});

  var pipeInterval = 1.75 * Phaser.Timer.SECOND;
  game.time.events.loop(pipeInterval, generatePipe);
  //
  // var bulletTimer = 4 * Phaser.Timer.SECOND;
  // game.time.events.loop(bulletTimer,generateBullet);

  player.body.gravity.y = gameGravity;

  game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onDown.remove(start);
  game.input.keyboard.addKey(Phaser.Keyboard.TWO).onDown.remove(start2Player);


  generatePipe();
}

function start2Player() {
  splashDisplay.destroy();
  splashDisplay2.destroy();
  splashDisplay3.destroy();
  numOfPlayers = 2;

  game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(playerJump);
  game.input.keyboard.addKey(Phaser.Keyboard.UP).onDown.add(player2Jump);

  labelScore = game.add.text(20, 10, "0", {font: "30px Courier", fill: "#FFFFFF"});

  var pipeInterval = 1.75 * Phaser.Timer.SECOND;
  game.time.events.loop(pipeInterval, generatePipe);

  player.body.gravity.y = gameGravity;
  player2.body.gravity.y = gameGravity;

  game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onDown.remove(start);
  game.input.keyboard.addKey(Phaser.Keyboard.TWO).onDown.remove(start2Player);


  generatePipe();

}


function update() {
  game.physics.arcade.overlap(player, pipes, gameOver);
  game.physics.arcade.overlap(player2, pipes, gameOver2);
  // game.physics.arcade.overlap(player, bullets, pickUpBullet);

  player.rotation = Math.atan(player.body.velocity.y / 200);
  player2.rotation = Math.atan(player2.body.velocity.y / 200);
  //
  // if(bulletOnScreen === true) {
  //   if(bullets[0].x < 0) {
  //     bullets[0].destroy();
  //     bullets.splice(furthestBulletPositionInArray, 1);
  //     bulletOnScreen = false;
  //   }
  // }
  //
  // if(hasBullets === true) {
  //   game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onDown.add(shootBullet);
  // }

  if (player.y < 0 || player.y > 400) {
    gameOver();
  }
  if (player2.y < 0 || player2.y > 400) {
    gameOver2();
  }

}

function gameOver() {
  game.add.image(130, 50, "gameOverImage");
  if (numOfPlayers == 1){
    registerScore(score);
    player.destroy();
  }
  else {
    alert("Player 2 Wins!");
    player.destroy();
    player2.destroy();
  }
  score = 0;
  // hasBullets = false;
  game.state.restart();
  pipes.splice(0,pipes.length);
  // bullets.splice(0,bullets.length);

}

function gameOver2() {
  game.add.image(130, 50, "gameOverImage");
  player.destroy();
  player2.destroy();
  score = 0;
  alert("Player 1 Wins");
  game.state.restart();
}

function playerJump() {
  player.body.velocity.y = gameVelocity;
}

function player2Jump() {
  player2.body.velocity.y = gameVelocity;
}

function changeScore() {
  score += 1;
  labelScore.setText(score.toString());
}

function generatePipe() {
  var gap = game.rnd.integerInRange(2 ,5);
  for (var count = -2; count < 10; count++) {
    if (count != gap && count != gap+1) {
      addPipeBlock(750, count * 50);
    }
  }
  changeScore();
}

function addPipeBlock(x, y) {
  var pipeBlock = game.add.sprite(x,y,"pipeBlock");
  pipes.push(pipeBlock);
  game.physics.arcade.enable(pipeBlock);
  pipeBlock.body.velocity.x = gameVelocity;

  pipeBlock.body.velocity.y = 20;
  game.time.events.loop(1000, function(){pipeBlock.body.velocity.y = -pipeBlock.body.velocity.y;},this);

}

// function generateBullet() {
//   var y = game.rnd.integerInRange(100,300);
//   var bullet = game.add.sprite(800, y, "bullet");
//   bullets.push(bullet);
//   game.physics.arcade.enable(bullet);
//   bullet.body.velocity.x = gameVelocity;
//   bulletOnScreen = true;
// }
//
// function pickUpBullet() {
//   hasBullets = true;
//   numOfBullets ++;
//   bullets[0].destroy();
//   bulletOnScreen = false;
//
// }
//
// function shootBullet() {
//   var bullet = game.add.sprite(player.body.x + player.width/2 ,player.body.y + player.height/2 , "bullet");
//   bullet.body.velocity.x = -gameVelocity;
//   hasBullets = false;
//
// }
