// the Game object used by the phaser.io library
var stateActions = { preload: preload, create: create, update: update };

// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)
var game = new Phaser.Game(790, 400, Phaser.AUTO, 'game', stateActions);
var gameOverBool = false;
var score = 0;
var gameGravity = 400;
var gameVelocity = -200;
var pipes = [];
var gameOverImage;
var player;
var labelScore;

/*
 * Loads all resources for the game and gives them names.
 */
function preload()  {
  game.load.image("playerImg", "../assets/trump_small.gif");
  game.load.image("pipeBlock","../assets/clinton_small.gif");
  game.load.image("backgroundImage", "../assets/usa_flag_small.jpeg");
  game.load.image("gameOverImage", "../assets/screenshotOver.jpg");
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

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.enable(player);

    splashDisplay = game.add.text(150,190, "Press ENTER to start, SPACEBAR to jump", {font: "20px Courier", fill: "#FF0000"});

    game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onDown.add(start);
}

/*
 * This function updates the scene. It is called for every new frame.
 */

function start() {
  splashDisplay.destroy();

  game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(playerJump);
  labelScore = game.add.text(20, 10, "0", {font: "30px Courier", fill: "#FFFFFF"});

  var pipeInterval = 1.75 * Phaser.Timer.SECOND;
  game.time.events.loop(pipeInterval, generatePipe);

  var outOfBoundsTimer = 1.00 * Phaser.Timer.SECOND;
  game.time.events.loop(outOfBoundsTimer,outOfBounds);

  player.body.gravity.y = gameGravity;

  game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onDown.remove(start);
}

function update() {
  game.physics.arcade.overlap(player, pipes, gameOver);
  player.rotation = Math.atan(player.body.velocity.y / 200);

  if (player.x < 0 || player.x > 800 || player.y < 0 || player.y > 400) {
    gameOver();
  }
}

function gameOver() {
  game.add.image(130, 50, "gameOverImage");
  registerScore(score);
  player.destroy();
  score = 0;
  game.state.restart();
}

function playerJump() {
    player.body.velocity.y = gameVelocity;
}

function changeScore() {
  score += 1;
  labelScore.setText(score.toString());
}

function generatePipe() {
    var gap = game.rnd.integerInRange(1 ,5);
    for (var count = 0; count < 8; count++) {
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
}

function outOfBounds() {
  if (player.x < 0 || player.x > 800 || player.y < 0 || player.y > 400) {
    gameOver();
  }
}
