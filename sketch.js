let bgColor;

function setup() {
  // Créer le canvas à l'intérieur du div
  let canvas = createCanvas(600, 400);
  canvas.parent('sketch-container');

  // Récupérer la couleur de fond du div parent
  const parentDiv = document.getElementById('sketch-container');
  bgColor = color(window.getComputedStyle(parentDiv).backgroundColor || '#ffffff');

  // Appliquer la couleur comme fond
  background(bgColor);
}

function draw() {
  fill(255, 0, 0);
  noStroke();
  ellipse(width / 2, height / 2, 100, 100);
}
