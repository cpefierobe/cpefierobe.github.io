let bgColor;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Récupérer la couleur de fond du body
  bgColor = color(window.getComputedStyle(document.body).backgroundColor);

  // Appliquer cette couleur comme fond
  background(bgColor);
}

function draw() {
  // Exemple : dessiner un cercle rouge au centre
  fill(255, 0, 0);
  noStroke();
  ellipse(width / 2, height / 2, 100, 100);
}

// Adapter la taille du canvas si la fenêtre change
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(bgColor);
}
