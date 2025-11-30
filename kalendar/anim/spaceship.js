// Spaceship vs Asteroids mit Sternen + Interaktiver Story + Hinweistext
// Steuerung: Links/Rechts-Pfeile oder Fingerbewegung
// Überlebe das Asteroidenfeld und tippe auf das Objekt im All...

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
let showHint = false;
let hintStartTime;
let targetAsteroids = 50;

// Storytext
let story = [
"Morty, hör zu! Ich musste mich verstecken —\n langer, interdimensionaler Albtraum, okay?",
"Bin mitten in der Nacht abgehauen.",
"Jetzt häng ich fest… in meinem eigenen Versteck,\n verdammt nochmal!",
"Du musst mich finden, Morty!",
"In meinem Safe liegen Briefe — die brauchst du.",
"Der Safe öffnet sich nur mit einem Code,\n der sich dauernd ändert.",
"Eine Zahl wird angezeigt,\nund du musst ihren audioaktiven Nachfolger eingeben.",
"Denk nach, Morty!"
];
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

  // ---- Asteroidenphase ----
  handleInput();
  ship.update();
  ship.show();

  // Asteroiden erzeugen
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
  text("Asteroiden passiert: " + score + " / " + targetAsteroids, 10, 10);
}

// ---------- Steuerung ----------
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

  // Objekt antippen
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

// ---------- Szenen ----------
function showGameOver() {
  fill(255, 50, 50);
  textAlign(CENTER, CENTER);
  textSize(40);
  text("💥 GAME OVER 💥", width / 2, height / 2);
  textSize(24);
  text("Punkte: " + score, width / 2, height / 2 + 50);
  text("Drücke R oder tippe zum Neustart", width / 2, height / 2 + 100);
}

function showVoidScene() {
  let elapsed = millis() - voidStartTime;

  handleInput();
  ship.update();
  ship.show();

  // Objekt erscheint nach .5 Sekunden
  if (elapsed > 500) {
    let alpha = constrain(map(elapsed, 1500, 2500, 0, 255), 0, 255);
    fill(100, 200, 255, alpha);
    noStroke();
    rectMode(CENTER);
    rect(boxPos.x, boxPos.y, 60, 60, 10);

    if (alpha >= 255 && !showHint) {
      showHint = true;
      hintStartTime = millis();
    }
    if (alpha >= 255) boxAppeared = true;
  }

  // Hinweistext anzeigen
  if (showHint && !boxTapped) {
    let hintAge = millis() - hintStartTime;
    let hintAlpha = map(hintAge, 0, 5000, 255, 0); // verblasst in 5s
    if (hintAlpha > 0) {
      fill(255, hintAlpha);
      textAlign(CENTER, CENTER);
      textSize(22);
      text("Ein unbekanntes Objekt erscheint im All...", width / 2, height / 2 - 100);
    }
  }

  // Story anzeigen, wenn Objekt angetippt wurde
  if (boxTapped) showStoryBox();
}

// ---------- Story ----------
function showStoryBox() {
  fill(0, 150);
  rectMode(CENTER);
  rect(width / 2, height / 2 + 120, width * 0.8, 160, 20);

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(20);
  textWrap(WORD);
  text(story[currentParagraph], width / 2, height / 2 + 100, width * 0.75);

  // Buttons
  let btnY = height / 2 + 180;
  textSize(18);
  if (currentParagraph > 0) drawButton(width / 2 - 100, btnY, "⬅ Zurück");
  if (currentParagraph < story.length - 1)
    drawButton(width / 2 + 100, btnY, "Weiter ➡");
  else drawButton(width / 2 + 100, btnY, "Neustart ↻");
}

function drawButton(x, y, label) {
  fill(50, 150, 255);
  rectMode(CENTER);
  rect(x, y, 130, 36, 10);
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

// ---------- Sterne ----------
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

// ---------- Reset ----------
function resetGame() {
  gameOver = false;
  victory = false;
  voidPhase = false;
  boxAppeared = false;
  boxTapped = false;
  showHint = false;
  score = 0;
  asteroids = [];
  ship = new Ship();
  currentParagraph = 0;
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  ship.y = height - 60;
}

// ---------- Schiff & Asteroiden ----------
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

