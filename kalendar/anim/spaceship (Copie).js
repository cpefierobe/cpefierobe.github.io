// Spaceship vs Asteroids with Stars + Interactive Box Story
// Move: LEFT/RIGHT arrows or drag/move finger
// Survive the asteroid belt, then tap the box to read the message...

let ship;
let asteroids = [];
let stars = [];
let score = 0;
let gameOver = false;
let victory = false;
let voidPhase = false;
let boxAppeared = false;
let boxTapped = false;
let voidStartTime;
let boxPos;
let targetAsteroids = 1;

// Story text paragraphs
let story = [
"Morty, hör zu! Ich musste mich verstecken —",
"langer, interdimensionaler Albtraum, okay? Bin mitten in der Nacht abgehauen.",
"Jetzt häng ich fest… in meinem eigenen Versteck, verdammt nochmal!",
"Du musst mich finden, Morty. In meinem Safe liegen Briefe — die brauchst du.",
"Der Safe öffnet sich nur mit einem Code, der sich dauernd ändert.",
"Eine Zahl wird angezeigt, und du musst ihren audioaktiven Nachfolger eingeben.",
"Denk nach, Morty!"
];

/*
  "You escaped the asteroid belt. The silence of space feels endless.",
  "Floating before you is a strange, metallic object... it's humming softly.",
  "A faint symbol glows on its surface — older than any known civilization.",
  "You feel it calling you... but then, it fades away into the void."
 */
let currentParagraph = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  ship = new Ship();
  for (let i = 0; i < 150; i++) stars.push(new Star());
}

function draw() {
  background(10);
  drawStars();

  if (gameOver) return showGameOver();
  if (voidPhase) return showVoidScene();

  if (victory) {
    victory = false;
    voidPhase = true;
    voidStartTime = millis();
    boxPos = createVector(width / 2, height / 2);
    return;
  }

  // ---- Main asteroid phase ----
  handleInput();
  ship.update();
  ship.show();

  // Spawn asteroids
  if (frameCount % 30 === 0 && score < targetAsteroids) {
    asteroids.push(new Asteroid());
  }

  for (let i = asteroids.length - 1; i >= 0; i--) {
    asteroids[i].update();
    asteroids[i].show();

    if (asteroids[i].hits(ship)) gameOver = true;

    if (asteroids[i].offscreen()) {
      asteroids.splice(i, 1);
      score++;
      if (score >= targetAsteroids) victory = true;
    }
  }

  fill(255);
  textSize(20);
  textAlign(LEFT, TOP);
  text("Asteroids passed: " + score + " / " + targetAsteroids, 10, 10);
}

// ---------- Controls ----------
function handleInput() {
  if (mouseIsPressed || touches.length > 0) {
    let xPos = touches.length > 0 ? touches[0].x : mouseX;
    ship.x = constrain(xPos, ship.size / 2, width - ship.size / 2);
  }
}
function keyPressed() {
  if (keyCode === LEFT_ARROW) ship.setDir(-1);
  else if (keyCode === RIGHT_ARROW) ship.setDir(1);
  if (key === 'r' || key === 'R') resetGame();
}
function keyReleased() {
  if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) ship.setDir(0);
}
function mousePressed() {
  if (gameOver) return resetGame();

  if (voidPhase && boxAppeared && !boxTapped) {
    let d = dist(mouseX, mouseY, boxPos.x, boxPos.y);
    if (d < 40) boxTapped = true;
  } else if (boxTapped) {
    handleStoryButtons(mouseX, mouseY);
  }
}
function touchStarted() {
  if (gameOver) return resetGame();

  if (voidPhase && boxAppeared && !boxTapped && touches.length > 0) {
    let d = dist(touches[0].x, touches[0].y, boxPos.x, boxPos.y);
    if (d < 40) boxTapped = true;
  } else if (boxTapped && touches.length > 0) {
    handleStoryButtons(touches[0].x, touches[0].y);
  }
  return false;
}

// ---------- Scenes ----------
function showGameOver() {
  fill(255, 50, 50);
  textAlign(CENTER, CENTER);
  textSize(40);
  text("💥 GAME OVER 💥", width / 2, height / 2);
  textSize(24);
  text("Score: " + score, width / 2, height / 2 + 50);
  text("Press R or Tap to Restart", width / 2, height / 2 + 100);
}

function showVoidScene() {
  let elapsed = millis() - voidStartTime;

  handleInput();
  ship.update();
  ship.show();

  // Box appears after 1.5 sec
  if (elapsed > 1000) {
    let alpha = constrain(map(elapsed, 1500, 2500, 0, 255), 0, 255);
    fill(100, 200, 255, alpha);
    noStroke();
    rectMode(CENTER);
    rect(boxPos.x, boxPos.y, 60, 60, 10);
    if (alpha >= 255) boxAppeared = true;
  }

  // When box tapped → show story
  if (boxTapped) showStoryBox();
}

// ---------- Story Interaction ----------
function showStoryBox() {
  // Draw a semi-transparent box
  fill(0, 150);
  rectMode(CENTER);
  rect(width / 2, height / 2 + 120, width * 0.8, 160, 20);

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(20);
  textWrap(WORD);
  text(story[currentParagraph], width / 2, height / 2 + 100, width * 0.75);

  // Draw navigation buttons
  let btnY = height / 2 + 180;
  textSize(18);

  if (currentParagraph > 0) {
    drawButton(width / 2 - 100, btnY, "⬅ Back");
  }
  if (currentParagraph < story.length - 1) {
    drawButton(width / 2 + 100, btnY, "Next ➡");
  } else {
    drawButton(width / 2 + 100, btnY, "Restart ↻");
  }
}

function drawButton(x, y, label) {
  fill(50, 150, 255);
  rectMode(CENTER);
  rect(x, y, 120, 36, 10);
  fill(255);
  noStroke();
  textAlign(CENTER, CENTER);
  text(label, x, y);
}

function handleStoryButtons(px, py) {
  let btnY = height / 2 + 180;
  if (currentParagraph > 0 && dist(px, py, width / 2 - 100, btnY) < 60) {
    currentParagraph--;
  } else if (currentParagraph < story.length - 1 && dist(px, py, width / 2 + 100, btnY) < 60) {
    currentParagraph++;
  } else if (currentParagraph === story.length - 1 && dist(px, py, width / 2 + 100, btnY) < 60) {
    resetGame();
  }
}

// ---------- Stars ----------
function drawStars() {
  fill(255);
  noStroke();
  for (let s of stars) {
    s.update();
    s.show();
  }
}
class Star {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.speed = random(0.5, 2);
  }
  update() {
    this.y += this.speed;
    if (this.y > height) {
      this.y = 0;
      this.x = random(width);
    }
  }
  show() {
    circle(this.x, this.y, 1.5);
  }
}

// ---------- Reset & Resize ----------
function resetGame() {
  gameOver = false;
  victory = false;
  voidPhase = false;
  boxAppeared = false;
  boxTapped = false;
  score = 0;
  asteroids = [];
  ship = new Ship();
  currentParagraph = 0;
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  ship.y = height - 60;
}

// ---------- Ship & Asteroids ----------
class Ship {
  constructor() {
    this.x = width / 2;
    this.y = height - 60;
    this.dir = 0;
    this.size = 40;
  }
  setDir(dir) { this.dir = dir; }
  update() {
    this.x += this.dir * 8;
    this.x = constrain(this.x, this.size / 2, width - this.size / 2);
  }
  show() {
    fill(0, 200, 255);
    noStroke();
    triangle(this.x, this.y - this.size / 2,
             this.x - this.size / 2, this.y + this.size / 2,
             this.x + this.size / 2, this.y + this.size / 2);
  }
}

class Asteroid {
  constructor() {
    this.x = random(width);
    this.y = -20;
    this.r = random(20, 40);
    this.speed = random(3, 7);
  }
  update() { this.y += this.speed; }
  show() {
    fill(180);
    noStroke();
    ellipse(this.x, this.y, this.r * 2);
  }
  offscreen() { return this.y > height + this.r; }
  hits(ship) {
    let d = dist(this.x, this.y, ship.x, ship.y);
    return d < this.r + ship.size / 2;
  }
}

