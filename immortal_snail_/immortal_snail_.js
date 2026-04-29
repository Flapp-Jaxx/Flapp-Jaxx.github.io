var playerX = 300;
var playerY = 300;
var playerSize = 20;

// Enemy 1
var ballx = 100;
var bally = 100;
var vx = 0;
var vy = 0;

// Enemy 2
var ball2x = 400;
var ball2y = 200;
var vx2 = 0;
var vy2 = 0;

// Enemy 3
var ball3x = 200;
var ball3y = 400;
var vx3 = 0;
var vy3 = 0;

var ballSize = 40;

// STATES
var gameState = "TITLE";

// countdown
var countdownStart = 0;
var countdownValue = 3;

// player speed
var speed = 4;

// timer
var timeLimit = 10;
var startTime = 0;

// button
var btnX = 200;
var btnY = 300;
var btnW = 200;
var btnH = 50;

// ---------------- SETUP ----------------
function setup() {
  createCanvas(600, 600);
  textAlign(CENTER);
}

// ---------------- MAIN LOOP ----------------
function draw() {
  movePlayer();

  if (gameState == "TITLE") titleScreen();
  else if (gameState == "COUNTDOWN") countdownScreen();
  else if (gameState == "L1") levelOne();
  else if (gameState == "L2") levelTwo();
  else if (gameState == "L3") levelThree();
  else if (gameState == "L4") levelFour();
  else if (gameState == "L5") levelFive();
  else if (gameState == "WIN") winScreen();
  else if (gameState == "GAMEOVER") gameOverScreen();

  if (gameState != "TITLE") {
    drawThing(playerX, playerY, playerSize);
  }
}

// ---------------- HUD ----------------
function updateHUD(levelName, nextState) {

  var timePassed = (millis() - startTime) / 1000;
  var timeLeft = max(0, timeLimit - timePassed);

  fill(255);
  textSize(16);

  text(levelName, 70, 25);
  text("Time: " + nf(timeLeft, 1, 1), width - 80, 25);

  if (timePassed > timeLimit) {
    gameState = nextState;
    startTime = millis();

    vx = vy = 0;
    vx2 = vy2 = 0;
    vx3 = vy3 = 0;
  }
}

// ---------------- PLAYER ----------------
function drawThing(x, y, size) {
  push();
  translate(x, y);
  noStroke();
  fill(255, 0, 100);

  rect(-size, -size/2, size, size/2);
  rect(0, -size/2, size, size/2);
  rect(-size*1.5, 0, size, size/2);
  rect(size/2, 0, size, size/2);
  rect(-size, size/2, size*2, size/2);
  rect(-size/2, size, size, size/2);

  pop();
}

function movePlayer() {
  if (keyIsDown(LEFT_ARROW)) playerX -= speed;
  if (keyIsDown(RIGHT_ARROW)) playerX += speed;
  if (keyIsDown(UP_ARROW)) playerY -= speed;
  if (keyIsDown(DOWN_ARROW)) playerY += speed;
}

// ---------------- SNAIL ----------------
function drawSnail(x, y, size, vx, vy) {
  push();
  translate(x, y);

  var angle = atan2(vy, vx);
  rotate(angle);

  fill(100, 200, 100);
  ellipse(0, 0, size * 1.2, size * 0.6);

  fill(150, 100, 50);
  ellipse(-size * 0.3, 0, size * 0.8, size * 0.8);

  fill(120, 80, 40);
  ellipse(-size * 0.3, 0, size * 0.4, size * 0.4);

  stroke(0);
  line(size * 0.3, -size * 0.2, size * 0.4, -size * 0.5);
  line(size * 0.1, -size * 0.2, size * 0.2, -size * 0.5);

  noStroke();
  fill(0);
  ellipse(size * 0.4, -size * 0.5, 5, 5);
  ellipse(size * 0.2, -size * 0.5, 5, 5);

  pop();
}

// ---------------- AI ----------------
function chaseEnemy(px, py, bx, by, vx, vy, maxSpeed, accel) {

  // slight prediction of movement
  var targetX = px + (px - bx) * 0.05;
  var targetY = py + (py - by) * 0.05;

  var dx = targetX - bx;
  var dy = targetY - by;
  var distance = dist(bx, by, targetX, targetY);

  if (distance > 0) {
    dx /= distance;
    dy /= distance;
  }

  vx += dx * accel;
  vy += dy * accel;

  var speedMag = sqrt(vx * vx + vy * vy);
  if (speedMag > maxSpeed) {
    vx = (vx / speedMag) * maxSpeed;
    vy = (vy / speedMag) * maxSpeed;
  }

  bx += vx;
  by += vy;

  return { x: bx, y: by, vx: vx, vy: vy };
}

function checkHitEnemy(bx, by) {
  var d = dist(bx, by, playerX, playerY);
  if (d < ballSize / 2) {
    gameState = "GAMEOVER";
  }
}

// ---------------- RESET ----------------
function resetGame() {
  playerX = 300;
  playerY = 300;

  ballx = 100; bally = 100; vx = vy = 0;
  ball2x = 400; ball2y = 200; vx2 = vy2 = 0;
  ball3x = 200; ball3y = 400; vx3 = vy3 = 0;

  gameState = "COUNTDOWN";
  countdownStart = millis();
  countdownValue = 3;
}

// ---------------- TITLE ----------------
function titleScreen() {
  background(30, 30, 80);

  fill(255);
  textSize(45);
  text("THE SNAIL", width/2, 170);

  textSize(16);
  text("You are immortal, but you will be hunted forever by The Snail.", width/2, 210);
  text("If The Snail catches you, you die.", width/2, 230);
  text("After centuries, it has finally found you.", width/2, 250);
  text("(Use the arrow keys to move)", width/2, 400);

  fill(255);
  rect(btnX, btnY, btnW, btnH);

  fill(0);
  textSize(20);
  text("START", btnX + btnW/2, btnY + 30);
}

// ---------------- COUNTDOWN ----------------
function countdownScreen() {
  background(0);

  var elapsed = int((millis() - countdownStart) / 1000);
  var current = countdownValue - elapsed;

  fill(255);
  textSize(60);

  if (current > 0) {
    text(current, width/2, height/2);
  } else {
    gameState = "L1";
    startTime = millis();
  }
}

// ---------------- WIN ----------------
function winScreen() {
  background(0, 200, 100);

  fill(255);
  textSize(50);
  text("YOU WIN", width/2, 180);

  textSize(18);
  text("You escaped the snail... for now", width/2, 230);

  fill(255);
  rect(btnX, btnY, btnW, btnH);

  fill(0);
  textSize(20);
  text("PLAY AGAIN", btnX + btnW/2, btnY + 30);
}

// ---------------- GAME OVER ----------------
function gameOverScreen() {
  background(0);

  fill(255, 0, 0);
  textSize(40);
  text("GAME OVER", width/2, 200);

  fill(255);
  rect(btnX, btnY, btnW, btnH);

  fill(0);
  textSize(20);
  text("RESTART", btnX + btnW/2, btnY + 30);
}

// ---------------- LEVELS ----------------
function levelOne() {
  background(220);
  timeLimit = 10;

  updateHUD("Level 1", "L2");

  var e = chaseEnemy(playerX, playerY, ballx, bally, vx, vy, 2, 0.1);
  ballx = e.x; bally = e.y; vx = e.vx; vy = e.vy;

  checkHitEnemy(ballx, bally);
  drawSnail(ballx, bally, ballSize, vx, vy);
}

function levelTwo() {
  background(200, 100, 0);
  timeLimit = 15;

  updateHUD("Level 2", "L3");

  var e = chaseEnemy(playerX, playerY, ballx, bally, vx, vy, 4, 0.2);
  ballx = e.x; bally = e.y; vx = e.vx; vy = e.vy;

  checkHitEnemy(ballx, bally);
  drawSnail(ballx, bally, ballSize, vx, vy);
}

function levelThree() {
  background(200, 100, 200);
  timeLimit = 10;

  updateHUD("Level 3", "L4");

  var e = chaseEnemy(playerX, playerY, ballx, bally, vx, vy, 5, 0.3);
  ballx = e.x; bally = e.y; vx = e.vx; vy = e.vy;

  checkHitEnemy(ballx, bally);
  drawSnail(ballx, bally, ballSize, vx, vy);
}

function levelFour() {
  background(50, 150, 200);
  timeLimit = 12;

  updateHUD("Level 4", "L5");

  var e1 = chaseEnemy(playerX, playerY, ballx, bally, vx, vy, 5, 0.3);
  ballx = e1.x; bally = e1.y; vx = e1.vx; vy = e1.vy;
  checkHitEnemy(ballx, bally);
  drawSnail(ballx, bally, ballSize, vx, vy);

  var e2 = chaseEnemy(playerX, playerY, ball2x, ball2y, vx2, vy2, 5, 0.2);
  ball2x = e2.x; ball2y = e2.y; vx2 = e2.vx; vy2 = e2.vy;
  checkHitEnemy(ball2x, ball2y);
  drawSnail(ball2x, ball2y, ballSize, vx2, vy2);
}

function levelFive() {
  background(20);
  timeLimit = 20;

  updateHUD("FINAL LEVEL", "WIN");

  var e1 = chaseEnemy(playerX, playerY, ballx, bally, vx, vy, 5, 0.3);
  ballx = e1.x; bally = e1.y; vx = e1.vx; vy = e1.vy;
  checkHitEnemy(ballx, bally);
  drawSnail(ballx, bally, ballSize * 1.3, vx, vy);

  var e2 = chaseEnemy(playerX, playerY, ball2x, ball2y, vx2, vy2, 5, 0.2);
  ball2x = e2.x; ball2y = e2.y; vx2 = e2.vx; vy2 = e2.vy;
  checkHitEnemy(ball2x, ball2y);
  drawSnail(ball2x, ball2y, ballSize, vx2, vy2);

  var e3 = chaseEnemy(playerX, playerY, ball3x, ball3y, vx3, vy3, 5, 0.1);
  ball3x = e3.x; ball3y = e3.y; vx3 = e3.vx; vy3 = e3.vy;
  checkHitEnemy(ball3x, ball3y);
  drawSnail(ball3x, ball3y, ballSize, vx3, vy3);
}

// ---------------- INPUT ----------------
function mousePressed() {
  if (gameState == "TITLE") resetGame();
  if (gameState == "GAMEOVER" || gameState == "WIN") resetGame();
}
