let taille = 500;
let x_reel = 12;
let y_reel = 12;

let radius_pt = 7; //rayon des points
let afficher_droites_projectives = true;
let afficher_contraintes = true;
let afficher_texte = false;

let liste_des_points;
let depart1, depart2;
let cote1Ext1, cote1Ext2, cote2Ext1, cote2Ext2;
let rayon_param= 10;
let nb_rebonds = 3;
let nb_sommets = 3;
let nb_type = 2; //nombre de type de billard prédéfinis
let actual_type = 1;
let name_type = "";
let set_contraintes = false;
let bgColor;

function setup() {
  var canvas = createCanvas(taille, taille);
  canvas.parent('sketch');

  bgColor = window.getComputedStyle(document.body).backgroundColor;
  bgColor = color(bgColor);
  
  nb_sommets = int(random(3,10));
  nb_rebonds = 3; //int(random(2,nb_sommets));
  
  bsh = new BillardProjectif();
  liste_des_points = new listePoint();
  initFigure();
}


function draw() {
  background(bgColor);
  
  liste_des_points.run(); //s'occupe de la gestion souris des points
  //contraindre(depart1, depart2, cote1Ext1,cote1Ext2,cote2Ext1,cote2Ext2); //contraint les deux premiers points sur les deux premiers côtés
  bsh.show(); //affiche la table de billard
  //Lance une orbite de billard
  bsh.dessinerOrbite(liste_des_points.getPoint(depart1),liste_des_points.getPoint(depart2),nb_rebonds);
  liste_des_points.show(); //affiche les points
  
  if(afficher_texte){
	  dessinerParametres();
  }
  
	strokeWeight(0);
	textSize(12);
	textStyle(NORMAL);
	textAlign(CENTER);
	text('A projective billiard',taille/2,99/100 * taille);
}

function keyPressed() {
  if (keyCode == 38) {//arrow down
	  nb_rebonds++; 
  }
  else if (keyCode == 40) {//arrow up
	  nb_rebonds--; if(nb_rebonds<0) nb_rebonds=0;
  }
  else if (keyCode == 37) {//arrow left
	  nb_sommets--; if(nb_sommets<3) nb_sommets=3;
	  initFigure();
  }
   else if (keyCode == 39) {//arrow right
	  nb_sommets++;
	  initFigure();
  }
  else if(keyCode == 32){//barre espace
	  actual_type++;  if(actual_type>nb_type)  actual_type=1;	  
	  initFigure();
  }
  else if(keyCode == 67){//c
	  if(set_contraintes) set_contraintes = false; else set_contraintes = true;
	  initFigure();
  }
}

function initFigure(){
  //*
  
  //createRegularPolygonalCentral(3,7);
  //createRegularPolygonalCentral(nb_sommets,7, false);
  //*/
  
  if(actual_type==1){
	  createRegularPolygonalCentral(nb_sommets,rayon_param, set_contraintes);
	  name_type = "centrally polygonal";
  }
  else if(actual_type ==2){
	  createSphericalBilliard(nb_sommets,rayon_param);
	  name_type = "right spherical";
  }
  
  //Calcul les points de départ
  let ext1 = liste_des_points.getPoint(cote1Ext1);
  let ext2 = liste_des_points.getPoint(cote1Ext2);
  let ext3 = liste_des_points.getPoint(cote2Ext1);
  let ext4 = liste_des_points.getPoint(cote2Ext2);
  
  mi1 = randomPointOn(ext1,ext2);
  mi2 = randomPointOn(ext3,ext4);
  
  depart1 = liste_des_points.addPoint(mi1.x, mi1.y);
  depart2 = liste_des_points.addPoint(mi2.x, mi2.y);
  
  liste_des_points.setContrainte(depart1,cote1Ext1,cote1Ext2);
  liste_des_points.setContrainte(depart2,cote2Ext1,cote2Ext2);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//////////Objets géométriques
////////////////////////////////////////////////////////////////////////////////////////////////////

//Code les etiquettes des points définissant une ligne de contrainte
// c1=-1 si pas de contrainte
class ptContrainte{
	contructor(x,y,c1,c2,actif){
		this.x=x;
		this.y=y;
		this.cont1=c1;
		this.cont2=c2;
		this.actif=actif;
	}
}

class Vecteur{
	constructor(x1,y1){
		this.x=x1;
		this.y=y1;
	}
}

function distance(x1,y1,x2,y2){
	return sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
}

//Renvoie le prochain point de collision ligne (A,v) sur ligne B1B2
function nextPoint(A,v,B1,B2){
	let ux = B2.x-B1.x;
	let uy = B2.y-B1.y;
	let t = (uy*(A.x-B1.x)-ux*(A.y-B1.y))/(ux*v.y-uy*v.x);
	return new Vecteur(A.x+t*v.x,A.y+t*v.y);
}

//Projection orthogonale de (A) sur ligne B1B2
function projectionOrth(A,B1,B2){
	let v = new Vecteur(B1.y-B2.y, B2.x-B1.x);
	return nextPoint(A,v,B1,B2);
}

function miPoint(pt1,pt2){
	return new Vecteur((pt1.x+pt2.x)/2, (pt1.y+pt2.y)/2);
}

function randomPointOn(pt1,pt2){
	let t=random(10,90)/100;
	return new Vecteur(pt1.x+t*(pt2.x-pt1.x), pt1.y+t*(pt2.y-pt1.y));
}

class listePoint{
	constructor(){
		this.nbPoints = 0;
		this.liste = [];
		this.listeC = [];
		this.object_selection = -1;
	}
	
	addPoint(x,y){
		this.liste[this.nbPoints] = new Vecteur(x,y);
		this.listeC[this.nbPoints] = new ptContrainte(x,y,-1,-1,false);
		this.nbPoints++;
		return this.nbPoints-1;
	}
	
	setPoint(label, pt){
		this.liste[label].x = pt.x;
		this.liste[label].y = pt.y;
	}
	
	getPoint(label){
		return new Vecteur(this.liste[label].x, this.liste[label].y);
	}
	
	setContrainte(label, c1, c2){
		this.listeC[label].cont1=c1;
		this.listeC[label].cont2=c2;
		this.listeC[label].actif=true;
	}
	
	show(){
		for (let i = 0; i < this.nbPoints; i++) {   
			fill(0);
			ellipse(abstractToScreenX(this.liste[i].x),abstractToScreenY(this.liste[i].y),radius_pt,radius_pt);
		}
	}
	
	init(){
		this.nbPoints = 0;
		this.liste = [];
		this.listeC = [];
		this.object_selection = -1;
	}
	
	run(){
		let dist_min = 10;
		
		if(mouseIsPressed && (this.object_selection == -1)){
			for (let i = 0; i < this.nbPoints; i++) {   
				if(distance(abstractToScreenX(this.liste[i].x), abstractToScreenY(this.liste[i].y), mouseX, mouseY) <= dist_min){
					this.object_selection = i;
				}
			}
		}
		else if(mouseIsPressed && (this.object_selection != -1)){
				this.liste[this.object_selection].x = map(mouseX, 0, width, -x_reel, x_reel);
				this.liste[this.object_selection].y = map(mouseY, height, 0, -y_reel, y_reel);
				
				//si contraintes
				let cont = this.listeC[this.object_selection];
				if(cont.actif){
					//On récupère la droite de contrainte et on projette dessus
					this.actualiser_contraintes_un(this.object_selection, true);
				}
		}
		else{
			this.object_selection = -1;
		}
	}
	
	actualiser_contraintes_un(label, show){
		let cont = this.listeC[label];
		let M = this.liste[label];
		let B1 = this.getPoint(cont.cont1);
		let B2 = this.getPoint(cont.cont2);
		let H = projectionOrth(M,B1,B2);
		this.liste[label].x=H.x;
		this.liste[label].y=H.y;
		
		if(afficher_contraintes&&show){
			strokeWeight(1);
			drawingContext.setLineDash([2, 5]);
			lineToScreen(B1, B2);
			drawingContext.setLineDash([]);
		}
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//////////Conversion de la grille abstraite en pixels
////////////////////////////////////////////////////////////////////////////////////////////////////

function abstractToScreenX(x){
	return map(x, -x_reel, x_reel, 0, width);
}

function abstractToScreenY(y){
	return map(y, -y_reel, y_reel, height, 0);
}

function lineToScreen(Pt1,Pt2){
	line(abstractToScreenX(Pt1.x),abstractToScreenY(Pt1.y),abstractToScreenX(Pt2.x),abstractToScreenY(Pt2.y));
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//////////Objets de billard
////////////////////////////////////////////////////////////////////////////////////////////////////

class FrontiereProjective {
  constructor(labExt1, labExt2, labPt){ //x1,y1,x2,y2, ptx, pty) {  
	//extrémités de la frontière
    this.labExt1 = labExt1;
    this.labExt2 = labExt2;
	
	//Point dirigeant le champ de droites
	this.labPt = labPt;
  }
  
  rebond(pt_contact,u_incident){
	  let ptProj = liste_des_points.getPoint(this.labPt); //Point par lequel passent les droites projectives
	  let ptExt1 = liste_des_points.getPoint(this.labExt1);
	  let ptExt2 = liste_des_points.getPoint(this.labExt2);
	  let tx = ptExt2.x-ptExt1.x;
	  let ty = ptExt2.y-ptExt1.y;
	  let lx = ptProj.x-pt_contact.x;
	  let ly = ptProj.y-pt_contact.y;
	  let vx = (lx*ty+ly*tx)*u_incident.x-2*lx*tx*u_incident.y;
	  let vy = 2*u_incident.x*ly*ty-(lx*ty+ly*tx)*u_incident.y;
	  let d = sqrt(vx*vx+vy*vy);
	  //let d=1;
	  return new Vecteur(vx/d,vy/d);
  }

  show() {
	  strokeWeight(1);
	  lineToScreen(liste_des_points.getPoint(this.labExt1),liste_des_points.getPoint(this.labExt2));
  }
}

class BillardProjectif{
	constructor() {  
		this.nbFrontieres = 0;
		this.frontiere = [];
	}
	
	init(){
		this.nbFrontieres = 0;
		this.frontiere = [];	
	}
	
	addFrontiere(front){
		this.frontiere[this.nbFrontieres] = front;
		this.nbFrontieres++;
	}
	
	addFrontiereCentral(labExt1, labExt2, labPt){
		this.addFrontiere(new FrontiereProjective(labExt1, labExt2, labPt));
	}
	
	createSpherical(lab1,lab2,lab3){
		this.nbFrontieres = 0;
		this.frontiere = [];
		this.addFrontiereCentral(lab1,lab2,lab3);
		this.addFrontiereCentral(lab2,lab3,lab1);
		this.addFrontiereCentral(lab3,lab1,lab2);
	}
	
	createPolygonCentral(tabLabSommets, labPtCentral){
		this.nbFrontieres = 0;
		this.frontiere = [];
		
		let nb = tabLabSommets.length;
		let j=0;
		for(let i=0; i<nb; i++){
			j=i+1; if(j>=nb) j=0;
			this.addFrontiereCentral(tabLabSommets[i],tabLabSommets[j],labPtCentral);
		}
	}
	
	dessinerOrbite(pt1,pt2,n){
		let point0 = new Vecteur(pt1.x,pt1.y);
		let point1 = new Vecteur(10,10);
		let vdir = new Vecteur(pt2.x-pt1.x,pt2.y-pt1.y);
		point0 = nextPoint(point0,vdir,liste_des_points.getPoint(this.frontiere[0].labExt1),liste_des_points.getPoint(this.frontiere[0].labExt2));
		//lineToScreen(this.frontiere[0].x1, this.frontiere[0].y1, this.frontiere[0].x2, this.frontiere[0].y2);
		
		let  j=0;
		
		for(let i=0; i<=n; i++){
			j++;
			if(j>=this.nbFrontieres){
				j=0;
			}
			
			point1 = nextPoint(point0,vdir,liste_des_points.getPoint(this.frontiere[j].labExt1), liste_des_points.getPoint(this.frontiere[j].labExt2));
			
			stroke('rgb(0,255,0)');
			strokeWeight(3);
			lineToScreen(point0,point1);
			stroke('black');
			strokeWeight(1);
			lineToScreen(point0,point1);
			lineToScreen(liste_des_points.getPoint(this.frontiere[j].labExt1),point1);
			
			if(i<n){
				if(afficher_droites_projectives){
					drawingContext.setLineDash([5, 5]);
					lineToScreen(point1, liste_des_points.getPoint(this.frontiere[j].labPt));
					drawingContext.setLineDash([]);
				}
				
				point0.x = point1.x;
				point0.y = point1.y;
				vdir = this.frontiere[j].rebond(point1, vdir);
			}
		}
	}
	
	show(){
		for (let i = 0; i < this.nbFrontieres; i++) {   
			this.frontiere[i].show();
		}
	}
}


//Crée un polygone régulier, avec champ de droites projectives central, contraint ou non
function createRegularPolygonalCentral(n, rayon, contraintes = false){
	let sommets = [];
	liste_des_points.init();
	for(let k=0; k<n; k++){
	  sommets[k] = liste_des_points.addPoint(rayon*cos(2*PI*k/n), rayon*sin(2*PI*k/n));
	}
	
	let labPtCentral = liste_des_points.addPoint(0,0);
	bsh.createPolygonCentral(sommets, labPtCentral);
	cote1Ext1 = sommets[0];
	cote1Ext2 = sommets[1];
	cote2Ext1 = sommets[1];
	cote2Ext2 = sommets[2];

	if(contraintes){
		let j=n/2-1;
		for(let k=0; k<n; k++){
			j++; if(j>=n) j=0;
			liste_des_points.setContrainte(sommets[k],labPtCentral, sommets[j]);
		}
	}
}

function createSphericalBilliard(n,rayon){
	let sommets = [];
	let j=0;
	let l=1;
	bsh.init();
	liste_des_points.init();
	for(let k=0; k<n; k++){
	  sommets[k] = liste_des_points.addPoint(rayon*cos(2*PI*k/n), rayon*sin(2*PI*k/n));
	}
	
	for(let k=0; k<n; k++){
		j++; if(j>=n) j=0;
		l++; if(l>=n) l=0;
		bsh.addFrontiereCentral(sommets[k], sommets[j] , sommets[l]);
	}	
	cote1Ext1 = sommets[0];
	cote1Ext2 = sommets[1];
	cote2Ext1 = sommets[1];
	cote2Ext2 = sommets[2];
}

function dessinerParametres(){
	strokeWeight(0);
	textSize(12);
	textStyle(NORMAL);
	
	let marge = 10;
	textAlign(LEFT);
	text('Billiard type: ' + name_type,marge,marge);
	text('Bounces: ' + nb_rebonds,marge,3*marge);
	text('Vertices: ' + nb_sommets,marge,5*marge);
	textAlign(RIGHT);
	text('About',taille-marge,marge);
	
	if(mouseIsPressed && (mouseX>taille-50) && (mouseY <20)){
		background(255);
		
		textAlign(LEFT);
		let expl = 'Simulation of projective billiards\n\n';
		expl+= ' > The orbit is in GREEN, the border in BLACK. \n';
		expl+= ' > The reflection law at a point is defined by the tangent line and the DOTTED line at this point.\n';
		expl+= ' > For more details, see preprint 2002.09845 on arxiv.org.';
		expl+= '\n---------------------------------------------------------------------------------------------------------------------------------------------\n\n';
		expl+= 'Keys to interact with the simulation:\n\n';
		expl+= ' > arrows up/down: +/- bounces;\n > arrows right/left: +/- vertices;\n';
		expl+= ' > space bar: change billiard type;\n > mouse click: move any circled point;\n'
		expl+= ' > c: impose constraint that the vertices and the central point are on the same line.'
		expl+= '\n---------------------------------------------------------------------------------------------------------------------------------------------\n\n';
		expl+= 'Billiard types\n\n';
		expl+= ' > Centrally polygonal: there is a point (\'central point\') such that the lines of the projective field of lines pass through this point.\n';
		expl+= ' > Right spherical: for each side of the polygonal, the lines of the projective field of lines on this side pass through a certain point, defined to be the next vertex of the polygonal in the cyclic order.\n';
		expl+= '\n---------------------------------------------------------------------------------------------------------------------------------------------\n\n';
		expl+= 'Coded by Corentin Fierobe with p5.js (corentin.fierobe@ens-lyon.fr)';
		text(expl, marge, marge, taille-marge, taille-marge);
	}
}
