let bodies = [];
let selectedBody = null;
let running = false;
let G = 1;
let sliders = [];
let startButton, resetButton;
let settingVelocity = false;

function setup() {
  createCanvas(windowWidth, windowHeight);

  initializeBodies();

  for (let i = 0; i < 3; i++) {
    sliders[i] = createSlider(10, 200, bodies[i].mass);
    sliders[i].position(20, 20 + i * 40);
    sliders[i].style('width', '100px');
  }

  startButton = createButton('Los!');
  startButton.position(20, 150);
  startButton.size(100, 40);
  startButton.mousePressed(() => running = true);

  resetButton = createButton('Neustart'); // bouton recommencer en allemand
  resetButton.position(20, 200);
  resetButton.size(100, 40);
  resetButton.mousePressed(() => {
    running = false;
    initializeBodies();
  });
}

function initializeBodies() {
  bodies = [];
  for (let i = 0; i < 3; i++) {
    bodies.push({
      pos: createVector(random(width), random(height)),
      vel: createVector(0, 0),
      acc: createVector(0, 0),
      mass: random(20, 80),
      velocityVector: createVector(random(-20, 20), random(-20, 20))
    });
  }
}

function draw() {
  background(0);

  for (let i = 0; i < bodies.length; i++) {
    bodies[i].mass = sliders[i].value();
  }

  if (running) {
    computeForces();
    updateBodies();
    handleCollisions();
  }

  drawBodies();
}

function drawBodies() {
  noStroke();
  fill(255);
  for (let b of bodies) {
    ellipse(b.pos.x, b.pos.y, b.mass, b.mass);
    if (!running) {
      let dir = b.velocityVector.copy().normalize();
      let start = p5.Vector.add(b.pos, dir.copy().mult(b.mass/2));
      let end = p5.Vector.add(start, b.velocityVector);
      stroke(0, 255, 0);
      strokeWeight(2);
      line(start.x, start.y, end.x, end.y);
      drawArrowHead(start, b.velocityVector);
    }
  }
}

function drawArrowHead(pos, vec) {
  push();
  translate(pos.x + vec.x, pos.y + vec.y);
  rotate(vec.heading());
  fill(0, 255, 0);
  noStroke();
  triangle(0, 0, -10, 5, -10, -5);
  pop();
}

function computeForces() {
  for (let i = 0; i < bodies.length; i++) {
    bodies[i].acc.set(0, 0);
    for (let j = 0; j < bodies.length; j++) {
      if (i != j) {
        let force = p5.Vector.sub(bodies[j].pos, bodies[i].pos);
        let d = max(force.mag(), 5);
        force.setMag(G * 10*bodies[i].mass * bodies[j].mass / (d * d));
        bodies[i].acc.add(force.div(bodies[i].mass));
      }
    }
  }
}

function updateBodies() {
  for (let b of bodies) {
    b.vel.add(b.acc);
    b.pos.add(b.vel);
  }
}

function handleCollisions() {
  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      let b1 = bodies[i];
      let b2 = bodies[j];
      let d = dist(b1.pos.x, b1.pos.y, b2.pos.x, b2.pos.y);
      let minDist = (b1.mass + b2.mass) / 2;
      if (d < minDist) {
        let normal = p5.Vector.sub(b2.pos, b1.pos).normalize();
        let relativeVel = p5.Vector.sub(b2.vel, b1.vel);
        let speed = relativeVel.dot(normal);
        if (speed > 0) {
          let impulse = normal.copy().mult(speed);
          b1.vel.add(impulse);
          b2.vel.sub(impulse);
        }
        let overlap = minDist - d;
        b1.pos.add(p5.Vector.mult(normal, -overlap/2));
        b2.pos.add(p5.Vector.mult(normal, overlap/2));
      }
    }
  }
}

function mousePressed() {
  if (!running) {
    selectedBody = null;
    settingVelocity = false;
    for (let b of bodies) {
      let d = dist(mouseX, mouseY, b.pos.x, b.pos.y);
      let dir = b.velocityVector.copy().normalize();
      let arrowStart = p5.Vector.add(b.pos, dir.copy().mult(b.mass/2));
      let arrowEnd = p5.Vector.add(arrowStart, b.velocityVector);
      let arrowDist = dist(mouseX, mouseY, arrowEnd.x, arrowEnd.y);
      if (arrowDist < 15) {
        selectedBody = b;
        settingVelocity = true;
        break;
      } else if (d < b.mass/2) {
        selectedBody = b;
        settingVelocity = false;
        break;
      }
    }
  }
}

function mouseDragged() {
  if (!running && selectedBody) {
    if (settingVelocity) {
      selectedBody.velocityVector.set(mouseX - selectedBody.pos.x, mouseY - selectedBody.pos.y);
    } else {
      selectedBody.pos.x = mouseX;
      selectedBody.pos.y = mouseY;
    }
  }
}

function mouseReleased() {
  if (!running && selectedBody && settingVelocity) {
    selectedBody.vel = selectedBody.velocityVector.copy().mult(0.1);
    selectedBody = null;
    settingVelocity = false;
  } else {
    selectedBody = null;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

