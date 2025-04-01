<?php
$fichier = fopen('system/visites/visites.txt', 'a');
date_default_timezone_set('Europe/Paris');
$donnees_visites =  date('d/m/y H:i:s') . " " . $_SERVER["REMOTE_ADDR"] . " " . "\n";
fputs($fichier, $donnees_visites);
fclose($fichier);
?>

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <link rel="stylesheet" href="style.css" />
        <title>Personal page of Corentin Fierobe</title>
		<meta name="title" content="Corentin Fierobe - pages personnelles"/>
		<meta name="description" content="Me contacter"/>
		<meta name="keywords" content="Corentin, Fierobe, contact, mathématiques"/>

    <script src="http://cdnjs.cloudflare.com/ajax/libs/p5.js/0.5.6/p5.js"></script>
	<!--script src="sketch/p5.sound.js"></script-->

<!--script src="sketch/sketch_music.js"></script-->
<script src="sketch/sketch_home.js"></script>
    </head>

    <body>
	<div class="corps_de_page">
		<?php include "menu.php" ?>
		<div class="contenu">
			<div  id="head"><p><h1>Corentin Fierobe</h1>
			<h2>PhD student at ENS de Lyon</h2>
			<span class="emph">e-mail:</span> corentin [dot] fierobe [at] ens-lyon [dot] fr<br/>
			My field of research is about the billiard as a dynamical system. <br/>
			I'm under the supervision of Alexey Glutsyuk.</p></div>
			
			<h2 class="rubrique">Scientific papers</h2>
			<!--h3> Published and accepted</h3-->
				<p class="description"><a href="https://arxiv.org/pdf/1904.03706.pdf">Complex caustics of the complex elliptic billiard</a> in <a href="https://link.springer.com/article/10.1007/s40598-020-00152-w">Arnold Mathematical Journal</a>, august 2020</p>
				<p class="description"><a href="https://arxiv.org/pdf/1807.11903.pdf">On the circumcenters of triangular orbits in elliptic billiard</a>, july 2019, submitted to Journal of Dynamical and Control Systems. "Editor's decision: could be considered for publication after minor revision." </p>
			<!--h3> Preprints</h3-->
				<p class="description"><a href="https://arxiv.org/pdf/2005.02012.pdf">On projective billiards with open subsets of triangular orbits</a></p>
				<p class="description"><a href="https://arxiv.org/pdf/2002.09845.pdf">Examples of reflective projective billards</a></p>

			<h2 class="rubrique">Scientific communications</h2>
				<p class="description"><span class="emph">Conference «Dynamics in Siberia»</span>, February 25. 2020, Sobolev Institute of Mathematics, Novosibirsk 
<br/>[<a href="documents/pres_projective_billard_in_novosibirsk.pdf">slides</a>] [<a href="http://math.nsc.ru/conference/ds/2020/">website</a>]</p>
				<p class="description"><span class="emph">Conference «Mathematical Spring – 2020»</span>, February 21. 2020, Higher School of Economics, Nizhny Novgorod
<br/>[<a href="https://nnov.hse.ru/en/bipm/mathspring2020">website</a>]</p>
				<p class="description"><span class="emph">International conference «Real and Complex Dynamical Systems»,  on the occasion of Prof. Yulij Ilyashenko's 75th birthday</span>, November 2018, Higher School of Economics, Moscow, Russia
<br/>[<a href="http://rcds.dyn-sys.org/">website</a>]</p>

				<p class="description"><span class="emph">Seminar «GGD» (Geometry, Groups and Dynamics)</span>, November 18. 2020, ENS de Lyon, Lyon 
<br/>[<a href="https://indico.math.cnrs.fr/event/6301/">abstract</a>][<a href="documents/pres_projective_billiard_GGD.pdf">slides</a>] </p>
				<p class="description"><span class="emph">Seminar of Prof. Dmitry Treshchev</span>, March 11. 2020, Steklov Mathematical Institute, Moscow</p>
				<p class="description"><span class="emph">Seminar «Complex analysis in several variables» (Vitushkin Seminar)</span>, March 04. 2020, MSU, Moscow 
<br/>[<a href="http://www.mathnet.ru/php/seminars.phtml?option_lang=eng&presentid=26520">abstract</a>]</p>
				<p class="description"><span class="emph">Conference «Dynamics in Siberia»</span>, February 25. 2020, Sobolev Institute of Mathematics, Novosibirsk 
<br/>[<a href="documents/pres_projective_billard_in_novosibirsk.pdf">slides</a>] [<a href="http://math.nsc.ru/conference/ds/2020/">website</a>]</p>
				<p class="description"><span class="emph">Conference «Mathematical Spring – 2020»</span>, February 21. 2020, Higher School of Economics, Nizhny Novgorod
<br/>[<a href="https://nnov.hse.ru/en/bipm/mathspring2020">website</a>]</p>
				<p class="description"><span class="emph">Seminar «Dynamical Systems»</span>, April 05. 2019, Higher School of Economics, Faculty of mathematics, Moscow
<br/>[<a href="http://rcds.dyn-sys.org">website</a>]</p>

			<h2 class="rubrique">Teaching</h2>
				<p class="description"><span class="emph">2020-2021:</span><br/>Lecture of differential calculus for third year undergraduates in economy at ENS de Lyon<br/>Directed studies of complex analysis for third year undergraduates in mathematics at ENS de Lyon<br/>Leçons d'agrégation (oral trainings) at ENS de Lyon.</p>
				
				<p class="description"><span class="emph">2019-2020:</span><br/>Lecture of differential calculus for third year undergraduates in economy at ENS de Lyon<br/>Colles (oral trainings) for CPES students at ENS de Lyon.</p>
				
				<p class="description"><span class="emph">2018-2019:</span><br/>Lecture of differential calculus for third year undergraduates and master degree students in economy at ENS de Lyon<br/>Colles (oral trainings) for CPES students at ENS de Lyon.</p>

			<h2 class="rubrique">Didactic and academic activities</h2>
				<p class="description">Correction writing of entrance examinations (Centrale-Supélec 2018&2019) for 
				<a href="http://www.h-k.fr/publications/annales.html">H&K édition</a>. <br/>
				Extracts can be found 
				<a href="https://www.prepamag.fr/concours/pdf/corriges.pdf.extraits/2018/PSI_MATHS_CENTRALE_1_2018.extrait.pdf">here</a> (2018)
				and
				<a href="https://www.prepamag.fr/concours/pdf/corriges.pdf.extraits/2019/MP_MATHS_CENTRALE_1_2019.extrait.pdf">here</a> (2019).</p>
				
				<p class="description"><a href="https://jmeenslyon.files.wordpress.com/2017/07/jmenouveau1.pdf">Le théorème de Lindemann-Weierstrass</a> Journal de Mathématiques des Élèves de l'ENS de Lyon, page 14, septembre 2015</p>					
		</div>
			<div id="sketch" style="text-align: center;">
			</div>
	</div>
    </body>
</html>
