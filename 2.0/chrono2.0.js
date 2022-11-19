
// Les variables : 

let elem = document.getElementById('chiffres-chrono')
let nom;
let audio = document.getElementById('audio')
let estEnPause = false
let minute = 0;
let seconde = 0;
let estLancer = false;
let listeExercices = [];
let listeTimer = []
let curseur = 0;
let curseurExe = 0; //pour suivre la liste exo et pas celle des timer


//Fonctions : 

function afficher(m,s){ // Affiche avec le bon format les min et sec
	let affMin;
	let affSec;
	if (m < 10 ){
		affMin = "0"+m;
	}
	else{
		affMin = m;
	}
		
	if (s < 10 ){
		affSec = "0" + s;
	}
	else {
		affSec = s;
	}
	elem.innerText = affMin + ' : ' + affSec;
}
function newExercice(){// Creation d'un nouvel Exercice / ajout dans la liste
	let nom = document.getElementById('nom_exe').value;
	let nombre_rep = +(document.getElementById('nombre_rep').value);
	let temps_pause = [+(document.getElementById('temps_pause_min').value),+(document.getElementById('temps_pause_sec').value)];
	let need_timer = document.getElementById('need_timer').checked;
	let dure_exe = [+(document.getElementById('dure_exe_min').value),+(document.getElementById('dure_exe_sec').value)];
	listeExercices.push(new Exercice(nom , nombre_rep , temps_pause , need_timer , dure_exe));
	let l = listeExercices.length-1
	listeExercices[l].afficherExercice();
}

function createListeTimer(){ // creer la liste de timer;
	let l;
	for (exercice of listeExercices){
		if (exercice.need_timer){
			for (let i = 0; i < (exercice.nombre_rep -1)  ; i++){
				l = exercice.dure_exe.slice();
				l.push('exerciceAvecDure');
				listeTimer.push(l);// Indique aue c'est un exercice avec dure
				l = exercice.temps_pause.slice();
				l.push('petitePause');
				listeTimer.push(l);
			}
			l = exercice.dure_exe.slice();
			l.push('exerciceAvecDure');
			listeTimer.push(l);
		}
		else{
			for(let i = 0; i < (exercice.nombre_rep -1)  ; i++){
				listeTimer.push([-2,-2,'exerciceSansDure']) //faire en sorte que sa mette sur pause
				l = exercice.temps_pause.slice()
				l.push('petitePause');
				listeTimer.push(l);
			}
			listeTimer.push([-2,-2,'exerciceSansDure']);
		}
		listeTimer.push([+(document.getElementById('pause-min').value),+(document.getElementById('pause-sec').value),'grandePause']);
		
	}
}

function next(){
	if ((curseur < listeTimer.length) && !estEnPause){
		if (listeTimer[curseur][2] == 'exerciceSansDure'){
			elem.innerHTML = listeExercices[curseurExe].nom;
		}
		if ((listeTimer[curseur][2] == 'exerciceAvecDure') || (listeTimer[curseur][2] == 'exerciceSansDure')){
			document.getElementById('titre')
			.innerHTML = listeExercices[curseurExe].nom;
		}
		if (listeTimer[curseur][2] == 'petitePause'){
			document.getElementById('titre')
			.innerHTML = `PAUSE / Prochaine exercice : <br> ${listeExercices[curseurExe].nom}`
		}
		if (listeTimer[curseur][2] == 'grandePause'){
		
			document.getElementById('aff'+listeExercices[curseurExe].nom)
			.style.backgroundColor = 'green';
			
			if (curseurExe < listeExercices.length -1){
				curseurExe += 1;
				document.getElementById('titre')
				.innerHTML = `PAUSE / Prochaine exercice : <br> ${listeExercices[curseurExe].nom}`
			}
			else {
				document.getElementById('titre')
				.innerHTML = 'Seance terminee ! Bravo ^^';
				elem.innerText = 'GG BOY'
				return
			}
		}
		
		minute = listeTimer[curseur][0];
		seconde = listeTimer[curseur][1];
		curseur +=1;
		lancement_chrono()
	}
	else{
		return
	}
}

	
function lancement_chrono(){ // permet de lancer le chrono avec les var min et sec
	if ((minute == -2) && (seconde = -2)){
		estEnPause = true 
	}
			
	
	if ((minute >= 0) && estLancer && !estEnPause){
		afficher(minute,seconde);
		if ((minute == 0) && (seconde ==3)){
			audio.play();
		}
		seconde = seconde -1;
		if (seconde == -1){
			minute = minute - 1;
			seconde = 59;
		}
		setTimeout(lancement_chrono,1000);
		
	}
	else {
		clearTimeout();
		next()
		
	}
}

class Exercice{
	constructor(nom , nombre_rep , temps_pause , need_timer , dure_exe){
		this.nom = nom; // string
		this.nombre_rep = nombre_rep; // number
		this.temps_pause = temps_pause; // liste [minute,sec]
		this.need_timer = need_timer // bool (true false)
		this.dure_exe = dure_exe // liste [minute,sec]
		this.estTerminer = false //Pour l'affichage des tache finies
	}
	afficherExercice(){// Pour afficher en HTML
		let t = 'aff'+this.nom
		const d = document.createElement('li'); // ID = aff + nom
		d.innerHTML = `<div id="${t}" class="affichage_exercices"> 
							<span> ${this.nom}</span>
							<div> ${this.nombre_rep} repetitions / ${this.temps_pause[0]} min et ${this.temps_pause[1]} de pause / Duree de l'exercice : ${this.dure_exe[0]} mins et ${this.dure_exe[1]} secs </div>
						</div>`
		document.getElementById('liste_exercices')
		.appendChild(d)
		
	}
}

// Scripts Boutons :

document.getElementById('play')
.addEventListener('click',function(e){
	if( !estEnPause ){
		estEnPause = true;
	}
	else{
		estEnPause = false;
		lancement_chrono();
	}
})
document.getElementById('reset')
.addEventListener('click',function(e){
	if (!estLancer){
		resetTimer();
	}
})

document.getElementById('add_exe')
.addEventListener('click',function(e){
	if (document.getElementById('nom_exe').value.split(' ').join('') == ''){
		alert ('Veiller choisir le nom de votre Exercice');
		return;
	}
	if (listeExercices.length >= 1){
		for (let i of listeExercices){
			if (i.nom == document.getElementById('nom_exe').value){
				alert ("Ce nom d'exercice est deja utilises !");
				return;
			}
		}
	}
	newExercice();
	document.getElementById('nom_exe').value = '';
	
})
document.getElementById('next')
.addEventListener('click',function(e){
		if (estEnPause ){
			estEnPause = false ;
			next()
		}	
})
document.getElementById('reset')
.addEventListener('click',function(e){
		if (estEnPause ){
			estEnPause = false ;
			minute = listeTimer[curseur-1][0];
			seconde = listeTimer[curseur-1][1];
			lancement_chrono()
		}
})
document.getElementById('prev')
.addEventListener('click',function(e){
		if (estEnPause ){
			estEnPause = false ;
			if (curseur >= 2){
				minute = listeTimer[curseur-2][0];
				seconde = listeTimer[curseur-2][1];
				lancement_chrono()
			}
			else {
				minute = listeTimer[curseur-1][0];
				seconde = listeTimer[curseur-1][1];
				lancement_chrono()
			}
		}
})
document.getElementById('start')
.addEventListener('click',function(e){
	createListeTimer();
	estLancer = true;
	next()
})
document.getElementById('need_timer')
.addEventListener('change',function(e){
	if (this.checked){
		document.getElementById('dure_exe').style.display='block';
	}
	else{
		document.getElementById('dure_exe').style.display='none'
	}
	
})


