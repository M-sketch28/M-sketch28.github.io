
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';//Import qui crée un espace avec différente surface et lumière utilise pour le fragment
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'; //Organise les effets graphiques
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'; // Prépare le rendu initial de la scène
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'; // Ajoute l'effet de halo lumineux
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'; // import pour le coeur humain
console.log("NOUVELLE VERSION DU SCRIPT");



// 1. Création de la scène
const scene = new THREE.Scene(); //crée une nouvelle scène.

scene.background = new THREE.Color(0xD3D3D3); //définit sa couleur de fond
scene.fog = new THREE.Fog(0xD3D3D3, 12, 57);//ajoute du brouillard pour donner une impression de profondeur




// 2. Création de la caméra
const camera = new THREE.PerspectiveCamera(
    60, //Champ de vision (FOV), en degrés
    window.innerWidth / window.innerHeight, //Rapport largeur/hauteur de l'écran
    0.1,
    1000 //Distance maximale visible
);
camera.position.set(0, 1.5, 8);
const pointRegard = new THREE.Vector3(0, 1.5, -15);//stokcer les 3 coordonnées du point d'où regarde la caméra
camera.lookAt(pointRegard);// oriente la caméra vers ce point

document.addEventListener("keydown", function(event) {//keydown détecte lorsqu'une touche est enfoncée
    //AVANCER
    if (event.key === "ArrowUp") {//event.key permet de connaître la touche utilisée/ ArrowUp correspond à la flèche du haut

        camera.position.z -= 1;
        pointRegard.z -= 1;

    }

    // RECULER
    if (event.key === "ArrowDown") {
        camera.position.z += 1;
        pointRegard.z += 1;
    }

    // ALLER À GAUCHE
    if (event.key === "ArrowLeft") {
        camera.position.x -= 1;
        pointRegard.x -= 1;
    }

    // ALLER À DROITE
    if (event.key === "ArrowRight") {
        camera.position.x += 1;
        pointRegard.x += 1;
    }

    camera.lookAt(pointRegard);

});


// 3. Création du moteur graphique
const renderer = new THREE.WebGLRenderer({ //transforme ce que vois la caméra en image à afficher dans le navigateur / new THREE.WebGLRenderer() crée le moteur de rendu.
    antialias: true // rend les contours moins pixelisés
});
const pmremGenerator = new THREE.PMREMGenerator(renderer);
const environnement = new RoomEnvironment(); // Création d'une pièce virtuelle
const environnementMap = pmremGenerator.fromScene(environnement);//trnasforme notre environnment en une texture adaptée aux matériaux physiques

renderer.setSize(window.innerWidth, window.innerHeight);// Définit la taille du rendu selon la largeur et la hauteur de la fenêtre

const composer = new EffectComposer(renderer);// new : crée une istance de la classe EffectComposer EffectComposer: utiliser renderer(moteur de rendu)
const renderPass = new RenderPass(scene, camera); // prépare le rendu de notre scène depuis le point de la caméra, a besoin d'une scène pour observer
composer.addPass(renderPass);
const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth,window.innerHeight),
    0.34, // Instensité de la lumière
    1.0, // Rayon de diffusion
    0.85 // Seuil à partir duquel ça brille
);
composer.addPass(bloomPass);

document.querySelector("#scene").appendChild(renderer.domElement); //récupère l'élément HTML qui possède l'identifiant scene / renderer.domElement représente le canvas HTML créé par Three.js / appendChild() insère ce canvas dans #scene



// 5. Éclairage
const lumiereAmbiante = new THREE.AmbientLight(0xffffff, 1.5); //lumière ambiante de la scène avec sa couleur et son intensité
scene.add(lumiereAmbiante);

const lumiere = new THREE.DirectionalLight(0xffffff, 1);// lumière directionelle éclaire unendroit en particulier
lumiere.position.set(5, 10, 5);// positiond e la lumière
scene.add(lumiere); //ajout de la lumière à la scène



// 6. Affichage de la scène

// TOUCHES DE DEPLACEMENT

const touches = {
    haut: false,
    bas: false,
    gauche: false,
    droite: false
};
// DETECTION DES TOUCHES ENFONCEES

document.addEventListener("keydown", function(event) {

    if (event.key.startsWith("Arrow")) {
        event.preventDefault();
    }

    if (event.key === "ArrowUp") touches.haut = true;
    if (event.key === "ArrowDown") touches.bas = true;
    if (event.key === "ArrowLeft") touches.gauche = true;
    if (event.key === "ArrowRight") touches.droite = true;

});


// DETECTION DES TOUCHES RELACHEES

document.addEventListener("keyup", function(event) {

    if (event.key === "ArrowUp") touches.haut = false;
    if (event.key === "ArrowDown") touches.bas = false;
    if (event.key === "ArrowLeft") touches.gauche = false;
    if (event.key === "ArrowRight") touches.droite = false;

});
const horloge = new THREE.Clock();//horloge pour mesurer le temps écoulé
function animer() {
    requestAnimationFrame(animer); // demande au navigateur de rapeler la fonction animer pour produirel'image suivante

   // TEMPS ECOULE
const delta = horloge.getDelta();

// VITESSE DE DEPLACEMENT
const vitesse = 20;

// DISTANCE PARCOURUE
const distance = vitesse * delta;


// DEPLACEMENT DE LA CAMERA

if (touches.haut) {
    camera.position.z -= distance;
    pointRegard.z -= distance;
}

if (touches.bas) {
    camera.position.z += distance;
    pointRegard.z += distance;
}

if (touches.gauche) {
    camera.position.x -= distance;
    pointRegard.x -= distance;
}

if (touches.droite) {
    camera.position.x += distance;
    pointRegard.x += distance;
}

camera.lookAt(pointRegard);

    //rotation des fragments
    for(const fragment of fragments){
        fragment.rotation[fragment.userData.axe] += fragment.userData.vitesse;
    }

    //rotation du coeur
    if (coeur) { // vérifie le mmodèle a été chargé 
        coeur.rotation.y += 0.003; // fait tourner le coeur
    }

    //rotation des poumons
    if(poumons){
        poumons.rotation.y += 0.003; //fait tourner les poumons
    }

     //rotation du cerveau
    if(cerveau){
        cerveau.rotation.y += 0.003; //fait tourner le cerveau
    }

    if(squelette){
        squelette.rotation.y += 0.003; //fait toutrner le squelette
    }

    if(digestif){
        digestif.rotation.y += 0.003; //fait tourner le système digestif
    }


    composer.render();//affiche l'image actuelle
}



//CRÉATION DES FRAGMENTS
//Matière du fragment
const fragmentMaterial = new THREE.MeshPhysicalMaterial({// apparence fragment
    color: 0xe5f2ff, // couleur du fragment
    roughness: 0.02, //rend la surface du fragment plus lisse, reflets plus nets /  Rugosité de la surface
    metalness: 0, // rend le fragment métallique /  Aspect métallique
    transmission: 1, // quantité de lumière qui traverse le matériau
    thickness: 0.6, // laisse passer beaucoup de lumière
    ior: 2.4, // determine la déviation de la lumière 
    envMapIntensity : 1.5 // Intensité de l'environnement réfléchi
});


const edgesMaterial = new THREE.LineBasicMaterial({
    color: 0xFFFFFF
});

function creerFragment(parent = scene){

    // 7. Création du premier fragment
    const fragmentGeometry = new THREE.IcosahedronGeometry(0.8, 0);// En premier le rayon en deuxième niveau de subdivision/ Base du fragment polyèdre, forme

    //Récupérer les sommets
    const positions = fragmentGeometry.attributes.position;

    // Utilisation de Map
    const facteurs = new Map(); // Map structure  qui permet d'utiliser clé/valeur  /crée une collection qui associe des clés à des valeurs
    //Déformations
    for(let i = 0; i < positions.count; i++){ //indique le nombre de positions de sommets enregistrées dans la géométrie
        const x = positions.getX(i); // getX(i), getY(i) et getZ(i) récupèrent les coordonnées du sommet
        const y = positions.getY(i);
        const z = positions.getZ(i);

        const cle = `${x},${y},${z}`; //template string créations des clés utiliser des accents grave au début et à la fin

        if(!facteurs.has(cle)){ //Si le facteur n'a pas de cle on en crée une nouvelle sinon on laisse comme ça
            facteurs.set(cle, 0.7 + Math.random() * 0.6); // crée un facteur aléatoire facteur = id

        }
        const facteur = facteurs.get(cle);// Récupérer la clé(repésente le sommet)du facteur

        positions.setXYZ(
            i,
            x * facteur,
            y * facteur,
            z * facteur
        );
    }
    fragmentGeometry.scale(0.5, 0.7, 0.70);// modifier la forme du fragment
    fragmentGeometry.computeVertexNormals(); //indiquent l'orientation des surfaces du fragment, calcule comment la lumière interagit avec chaque face

    const fragment = new THREE.Mesh(// Mesh combine la géometry et le matériau
    fragmentGeometry,
    fragmentMaterial
    );

    const axes = ["x", "y", "z"]; // Les trois axes possibles
    const axesChoisi = axes[Math.floor(Math.random() * axes.length)]; 
    const sens = Math.random() < 0.5 ? -1 : 1; // choisi entre une rotation positive et négative
    const vitesse = sens * (0.001 + Math.random() *0.002); // Vitesse de la rotation
    fragment.userData.axe = axesChoisi;// userData est un espace prévu par Three.js pour stocker des informations personnalisées sur un objet / garde en mémoire l'axes de l'objet
    fragment.userData.vitesse = vitesse; // garde en mémoire la vitesse de l'objet 

    const edgesGeometry = new THREE.EdgesGeometry(fragmentGeometry);// Analyse la géométrie et récupère les arrêtes
    const edges = new THREE.LineSegments( // dessine une succesion de segments independants 
    edgesGeometry,
    edgesMaterial
    );
    fragment.add(edges);

    fragment.position.set(
        Math.random() * 50 - 25,
        Math.random() * 9 + 2,
        Math.random() * 10 - 9
    );
   
    parent.add(fragment);    // Ajout de l'objet fragment à la scene

    return fragment;
}

fragmentMaterial.envMap = environnementMap.texture; // Association de l'objet environnement à la scene et fournit un environnement de réflexion aux matériaux compatibles

const fragments = [];

for(let i = 0; i < 120; i++){
    const fragment = creerFragment();
    fragments.push(fragment); // Ajoute chaque fragment au tableau 

    if(fragment.position.z > -7 && 
       fragment.position.z < -3 &&
       Math.abs(fragment.position.x) < 2){ // fragment proche de la profondeur du coeur / Math.abs() Repère les fragments proche du coeur

        if(fragment.position.x < 0){ // savoir dans quelle direction déplacer les fragments
            fragment.position.x -= 2;
        }
        else{ //savoir dans quelle direction déplacer les fragments
            fragment.position.x += 2;
        }

    }

}

//Creer les fragments au loin
for(let i = 0; i < 60; i++){
    const fragment = creerFragment();// reférence vers l'objet crée
    fragment.scale.setScalar(0.35);

    fragment.position.set(
        Math.random() * 50 - 15,
        Math.random() * 9 + 1,
        Math.random() * 10 - 25
    );
    fragments.push(fragment);
}




// ESCPACE DU CORPS HUMAIN

const espaceCorps = new THREE.Group();
espaceCorps.name = "EspaceCorps";

// SOL DE L'ESPACE DU CORPS

function creerTextureMarbre() {

    // Création d'une image de 1024 x 1024 pixels
    const canvas = document.createElement("canvas");//permet de créer une image directement en JavaScript.
    canvas.width = 1024;
    canvas.height = 1024;

    const contexte = canvas.getContext("2d");// Récupère les outils pour dessiner en 2D.

    // Fond blanc
    contexte.fillStyle = "#ffffff";
    contexte.fillRect(0, 0, 1024, 1024);

    
    // Transformation du dessin en texture Three.js
    const texture = new THREE.CanvasTexture(canvas);//transforme notre image en texture utilisable par Three.js.

    texture.colorSpace = THREE.SRGBColorSpace;

    return texture;
}

const solCorpsGeometry = new THREE.PlaneGeometry(200, 200);//création de la forme du sol du corps plan rectangulaire

const solCorpsMaterial = new THREE.MeshPhysicalMaterial({// physique du sol 
    map: creerTextureMarbre(),//map indique au matériau quelle image utiliser pour recouvrir sa surface. applique la texture blanche du sol
    color: 0xffffff,
    roughness: 0.08,
    metalness: 0.05,
    transmission : 0,
    side: THREE.DoubleSide

});

const solCorps = new THREE.Mesh(// creation de l'objet sol
    solCorpsGeometry,
    solCorpsMaterial
);

solCorps.rotation.x = -Math.PI / 2;// positionne horizontalement au niveau du sol
solCorps.position.y = -1; // positionne au sol

const lumiereSol = new THREE.PointLight(0xffffff, 16, 30);//lumière pour éclairer le sol et le faire être plus réflechissant / PointLight crée une lumière qui rayonne dans toutes les directions depuis un point précis

lumiereSol.position.set(0, 5, 0);

espaceCorps.add(lumiereSol);

espaceCorps.add(solCorps);


// Ajout piliers du coeur

const geometriePilier = new THREE.CylinderGeometry(
    0.18,  // Rayon du haut
    0.28,  // Rayon du bas
    1.6,   // Hauteur
    6      // Nombre de côtés
);

const materiauPilier = new THREE.MeshStandardMaterial({
    color: 0x25252a,
    roughness: 0.3,
    metalness: 0.35
});

const pilierCorps = new THREE.Mesh(
    geometriePilier,
    materiauPilier
);

const pilierCorps2 = pilierCorps.clone();
const pilierCorps3 = pilierCorps.clone();
const pilierCorps4 = pilierCorps.clone();

// Position du pilier
pilierCorps.position.set(3, 5, -5);
pilierCorps2.position.set(-3, 5, -10);
pilierCorps3.position.set(-3, 5, -5);
pilierCorps4.position.set(3, 5, -10);

// Ajouter le pilier à notre salle
espaceCorps.add(pilierCorps);
espaceCorps.add(pilierCorps2);
espaceCorps.add(pilierCorps3);
espaceCorps.add(pilierCorps4);


//CHARGEMENTS DES ORGANES
// CHARGEMENT DU COEUR
const loader = new GLTFLoader(); // est un outil fourni par Three.js pour charger des modèles 3D au format GLTF ou GLB céationd'une instance de cet outil
let coeur = null;

loader.load( // La méthode .load() reçoit quatre paramètres 
    './Models/human-heart-light.glb', // 1 Le chemin

    function(gltf) { // 2 fonction exécuté quand le modèle est chargé

        coeur = gltf.scene; // Le fichier GLB contient une scène (gltf.scene) qui regroupe le modèle 3D et ses éventuels éléments enfants / On récupère cette scène et on la stocke dans notre variable coeur

        coeur.scale.set(30, 30, 30);
        coeur.position.set(0, 2, -5);
        coeur.rotation.y = 0; // On définit sa rotation autour de l'axe vertical Y à zéro 
        rendreTranslucide(coeur,0xff3355);

        espaceCorps.add(coeur);

        //CREATION DU GROUPE FRAGMENT COEUR
        const groupeFragmentsCoeur = new THREE.Group();
        coeur.add(groupeFragmentsCoeur)

 
        for(let i = 0; i < 35; i++){
            const fragment = creerFragment(groupeFragmentsCoeur);

            fragment.material = fragmentMaterial.clone();//clone des matériaux fragment

            if(i < 2){
                // Fragments informatifs : turquoise
                fragment.userData.informatif = true;
                //FAITS CONTENUS DANS LES FRAGMENTS TURQUOISE
                if (i === 0) {
                    fragment.userData.fait = "Le cœur bat environ 100 000 fois par jour.";
                } 
                else {
                    fragment.userData.fait = "Les valves cardiaques guident le sang en s'ouvrant et en se fermant.";
                }
                
                fragment.material.color.set(0x2a9d8f);
                fragment.material.emissive.set(0x2a9d8f);//couleur le matériau semble émettre
                fragment.material.emissiveIntensity = 0.4//intensité de l'élission lumineuse
            }

            else{
                // Fragments décoratifs : rouge
               fragment.material.color.set(0xff3355);
                fragment.material.emissive.set(0xff3355);//couleur le matériau semble émettre
                fragment.material.emissiveIntensity = 0.4//intensité de l'élission lumineuse
            }


            fragment.scale.setScalar(0.02);

            fragment.position.set(
                Math.random() * 0.2 - 0.1,
                Math.random() * 0.3 - 0.1,
                Math.random() * 0.2 - 0.1
            );

        }
        //AURA
        const auraCoeur = new THREE.PointLight(// PointLight crée une lumière qui rayonne dans toutes les directions depuis un point précis
            0xff3355,//couleur
            30, //intensité
            30 //distance d'éclairage
        );
        coeur.add(auraCoeur);
        auraCoeur.position.set(0, 0, 0);
    },

    undefined, // 3 Suit la progression du chargement

    function(erreur) { // 4 Fonction exécutée en cas d'erreur
        console.error("Erreur lors du chargement du coeur :", erreur);
    }
);

// CHARGEMENT DES POUMONS
let poumons = null;

loader.load(
    './Models/human-lungs-light.glb',

    function(gltf) {

        poumons = gltf.scene;

        poumons.scale.set(15, 15, 15);
        poumons.position.set(-18.5, 2, -0.0);//-4, 2, -5)
        poumons.rotation.y = 0;
        rendreTranslucide(poumons,0xea9ab2);//f49cbb

        espaceCorps.add(poumons);

        //CREATION DU GROUPE FRAGMENT POUMONS
        const groupeFragmentsPoum = new THREE.Group();
        poumons.add(groupeFragmentsPoum);

 
        for(let i = 0; i < 56; i++){
            const fragment = creerFragment(groupeFragmentsPoum);

            fragment.material = fragmentMaterial.clone();//clone des matériaux fragment

            if(i < 2){
                // Fragments informatifs : turquoise
                fragment.userData.informatif = true;

                if (i === 0) {
                    fragment.userData.fait = "Les poumons aident aussi à parler et à chanter, l'air expiré fait vibrer les cordes vocales";
                } 
                else {
                    fragment.userData.fait = "Les poumons contiennent environ 300 millions d'alvéoles, de minuscules sacs où se produisent les échanges gazeux";
                }
                
                fragment.material.color.set(0x2a9d8f);
                fragment.material.emissive.set(0x2a9d8f);//couleur le matériau semble émettre
                fragment.material.emissiveIntensity = 0.4//intensité de l'élission lumineuse
            }

            else{
                // Fragments décoratifs : rose
                fragment.material.color.set(0xea9ab2);
                fragment.material.emissive.set(0xff3355);//couleur le matériau semble émettre
                fragment.material.emissiveIntensity = 0.4;//intensité de l'élmission lumineuse
            }

            fragment.scale.setScalar(0.03);

            fragment.position.set(
                Math.random() * 0.4 - 0.2,
                Math.random() * 0.7 - 0.3,
                Math.random() * 0.2 - 0.1
            );
        }
        //AURA
        const auraPoumons = new THREE.PointLight(
            0xea9ab2,//couleur
            30, //intensité
            30 //distance d'éclairage
        );
        poumons.add(auraPoumons);
        auraPoumons.position.set(0, 0, 0);

    },

    undefined,

    function(erreur) {
        console.error("Erreur lors du chargement des poumons :", erreur);
    }
);

// CHARGEMENT DU CERVEAU
let cerveau = null;

loader.load(
    './Models/human-brain-light.glb',

    function(gltf) {

        cerveau = gltf.scene;

        cerveau.scale.set(15, 15, 15);
        cerveau.position.set(18, 2, 2);//9, 2, -5)
        cerveau.rotation.y = 0;
        rendreTranslucide(cerveau,0xc77dff);

        espaceCorps.add(cerveau);


         //CREATION DU GROUPE FRAGMENT CERVEAU
        const groupeFragmentsCerv = new THREE.Group();
        cerveau.add(groupeFragmentsCerv);

        for(let i = 0; i < 40; i++){
            const fragment = creerFragment(groupeFragmentsCerv);

            fragment.material = fragmentMaterial.clone();//clone des matériaux fragment

            if(i < 2){
                // Fragments informatifs : turquoise
                fragment.userData.informatif = true;

                if (i === 0) {
                    fragment.userData.fait = "Le cerveau représente environ 2% du poids du corps, mais consomme près de 20% de son énergie au repos";
                } 
                else {
                    fragment.userData.fait = "Le cerveau contient des milliards de neurones qui communiquent entre eux grâce à des signaux électriques et chimiques";
                }
                
                fragment.material.color.set(0x2a9d8f);
                fragment.material.emissive.set(0x2a9d8f);//couleur le matériau semble émettre
                fragment.material.emissiveIntensity = 0.4//intensité de l'élission lumineuse
            }

            else{
                // Fragments décoratifs : violet
                fragment.material.color.set(0xc77dff);
                fragment.material.emissive.set(0xff3355);//couleur le matériau semble émettre
                fragment.material.emissiveIntensity = 0.4;//intensité de l'élmission lumineuse
            }

            fragment.scale.setScalar(0.03);

            fragment.position.set(
                Math.random() * 0.5 - 0.3,
                Math.random() * 0.6 - 0.2,
                Math.random() * 0.2 - 0.1
            );
        }
        //AURA
        const auraCerveau = new THREE.PointLight(
            0xc77dff,//couleur
            30, //intensité
            30 //distance d'éclairage
        );
        cerveau.add(auraCerveau);
        auraCerveau.position.set(0, 0, 0);

    },

    undefined,

    function(erreur) {
        console.error("Erreur lors du chargement du cerveau :", erreur);
    }
);

// CHARGEMENT DU SQUELETTE
let squelette = null;

loader.load(
    './Models/human-skeleton-light.glb',

    function(gltf) {

        squelette = gltf.scene;

        squelette.scale.set(4, 4, 4);
        squelette.position.set(12.5, 1, -20);// 5, 2, -5
        squelette.rotation.y = 0;
        rendreTranslucide(squelette,0x8ecae6);

        espaceCorps.add(squelette);

        //CREATION DU GROUPE FRAGMENT SQUELETTE
        const groupeFragmentsSquel = new THREE.Group();
        squelette.add(groupeFragmentsSquel);

        for(let i = 0; i < 35; i++){
            const fragment = creerFragment(groupeFragmentsSquel);

            fragment.material = fragmentMaterial.clone();//clone des matériaux fragment

            if(i < 2){
                // Fragments informatifs : turquoise
                fragment.userData.informatif = true;

                if (i === 0) {
                    fragment.userData.fait = "Tes os servent aussi de réserve minérale, notamment pour le calcium et le phosphore";
                } 
                else {
                    fragment.userData.fait = "La moelle osseuse fabrique les cellules du sang";
                }
                
                fragment.material.color.set(0x2a9d8f);
                fragment.material.emissive.set(0x2a9d8f);//couleur le matériau semble émettre
                fragment.material.emissiveIntensity = 0.4//intensité de l'élission lumineuse
            }

            else{
                // Fragments décoratifs : bleu
                fragment.material.color.set(0x8ecae6);
                fragment.material.emissive.set(0x8ecae6);//couleur le matériau semble émettre
                fragment.material.emissiveIntensity = 0.4;//intensité de l'élmission lumineuse
            }

            fragment.scale.setScalar(0.1);

            fragment.position.set(
                Math.random() * 0.9 - 0.4,
                Math.random() * 2 - 0.1,
                Math.random() * 0.2 - 0.1
            );
        }
        //AURA
        const auraSquel = new THREE.PointLight(
            0x8ecae6,//couleur
            30, //intensité
            30 //distance d'éclairage
        );
        squelette.add(auraSquel);
        auraSquel.position.set(0, 0, 0);

    },

    undefined,

    function(erreur) {
        console.error("Erreur lors du chargement du squelette :", erreur);
    }
);

// CHARGEMENT DU SYSTEME DIGESTIF
let digestif = null;

loader.load(
    './Models/digestive.glb',

    function(gltf) {

        digestif = gltf.scene;

        digestif.scale.set(3, 3, 3);
        digestif.position.set(-12.5, 3.5, -20 );// -9, 2, -5
        digestif.rotation.y = 0;
        rendreTranslucide(digestif,0xff7f51);

        espaceCorps.add(digestif);


        //CREATION DU GROUPE FRAGMENT SYS_DISG
        const groupeFragmentsDis = new THREE.Group();
        digestif.add(groupeFragmentsDis);

 
        for(let i = 0; i < 40; i++){
            const fragment = creerFragment(groupeFragmentsDis);

            fragment.material = fragmentMaterial.clone();//clone des matériaux fragment

            if(i < 2){
                // Fragments informatifs : turquoise
                fragment.userData.informatif = true;

                if (i === 0) {
                    fragment.userData.fait = "Ton estomac se protège lui-même, il produit une couche de mucus qui protège sa paroi contre son propre acide gastrique";
                } 
                else {
                    fragment.userData.fait = "La digestion continue pendant ton sommeil, ton système digestif poursuit son travail même lorsque tu dors";
                }

                fragment.material.color.set(0x2a9d8f);
                fragment.material.emissive.set(0x2a9d8f);//couleur le matériau semble émettre
                fragment.material.emissiveIntensity = 0.4//intensité de l'élission lumineuse
            }

            else{
                // Fragments décoratifs : bleu
                fragment.material.color.set(0xff7f51);//couleur des fragments
                fragment.material.emissive.set(0xff3355);//couleur le matériau semble émettre
                fragment.material.emissiveIntensity = 0.4;//intensité de l'élmission lumineuse
            }

            fragment.scale.setScalar(0.2);

            fragment.position.set(
                Math.random() * 4 - 2,
                Math.random() * 3 - 1,
                Math.random() * 0.8 - 0.1
            );
        }

        //AURA
        const auradig = new THREE.PointLight(
            0xff7f51,//couleur
            30, //intensité
            30 //distance d'éclairage
        );
        digestif.add(auradig);
        auradig.position.set(0, 0, 0);

    },

    undefined,

    function(erreur) {
        console.error("Erreur lors du chargement du digestif :", erreur);
    }
);



// SOCLES DES ORGANES
const geometrySocle = new THREE.CylinderGeometry(1.2, 2, 2, 120);


const materiauSocle = new THREE.MeshStandardMaterial({
    color:  0x333333
});


const soclePoumons = new THREE.Mesh(geometrySocle, materiauSocle);
soclePoumons.position.set(-18.5, -0.4, -0.01);
soclePoumons.scale.set(1.8, 1, 1.8);

const socleCerveau = soclePoumons.clone();
socleCerveau.position.set(18, -0.4, 0.2);
socleCerveau.scale.set(1.8, 1, 1.8);

const socleSquelette = soclePoumons.clone();
socleSquelette.position.set(12.5, -0.4, -20);
socleSquelette.scale.set(1.8, 1, 1.8);

const socleDigestif = soclePoumons.clone();
socleDigestif.position.set(-12.5, -0.4, -20.5);
socleDigestif.scale.set(1.8, 1, 1.8);

espaceCorps.add(socleDigestif);
espaceCorps.add(socleSquelette);
espaceCorps.add(soclePoumons);
espaceCorps.add(socleCerveau);



//TRANSPARENCE 3D MODELE
function rendreTranslucide(modele, couleur) {

    modele.traverse(function(objet) {

        if (objet.isMesh) {

            objet.material = objet.material.clone();

            objet.material = new THREE.MeshPhysicalMaterial({

                color: couleur,

                transparent: true,
                opacity: 0.95,

                roughness: 0.05,
                metalness: 0,

                transmission: 0.8,
                thickness: 1, // Simule l'épaisseur du verre.

                ior: 1.5,

                clearcoat: 1, //Ajoute une couche de brillance.
                clearcoatRoughness: 0.05,//Contrôle la netteté de cette brillance.

                iridescence: 1, //active l'effet au maximum
                iridescenceIOR: 1.3, //règle l'indice de réfraction du film
                iridescenceThicknessRange: [100, 800] //définit la plage d'épaisseur qui influence les couleurs.
            });

            objet.material.color.set(couleur);

            objet.material.depthWrite = false;
            objet.material.needsUpdate = true;
        }

    });

}



//DETECTION DE LA SOURIS
const raycaster = new THREE.Raycaster(); //représente notre rayon invisible qui va détecter les objets.
const souris = new THREE.Vector2(); //va stocker la position du clic sur l'écran/ Vector2 2 dimensions

const ficheOrgane = document.getElementById("fiche-organe");
const boutonFermer = document.getElementById("fermer-fiche");

boutonFermer.addEventListener("click", function() {
    ficheOrgane.style.display = "none";
});



// INFO FICHE
const informationsOrganes = {

    "human-heart": {
        nom: "Le Cœur",
        image: "Images/coeur.png",
        fonction: "Le cœur est un organe musculaire creux et vital qui fonctionne comme une pompe pour assurer la circulation du sang dans tout l'organisme",
        description: "Le cœur est divisé en deux parties (gauche et droite) séparées par une paroi. Chaque partie comprend deux cavités. Le cœur droit reçoit le sang pauvre en oxygène (chargé en dioxyde de carbone) qui revient des organes. Il l'envoie vers les poumons via l'artère pulmonaire pour qu'il s'y oxygène. Le cœur gauche reçoit le sang riche en oxygène provenant des poumons. Il le propulse avec force dans tout le corps via l'aorte pour nourrir les cellules",
        fait: "Le cœur possède son propre système électrique, grâce à des cellules spécialisées, il génère lui-même ses propres impulsions. C'est ce qui lui permet de continuer à battre même lorsqu'il est retiré du corps, à condition de recevoir de l'oxygène",
        deplacement: "translate(340px, -270px)"
    },

    "human-lungs": {
        nom: "Les Poumons",
        image: "Images/poumons.png",
        fonction: "Les poumons sont les organes principaux de la respiration. Leur fonction vitale est d'assurer les échanges gazeux entre l'air extérieur et le sang",
        description: "Les poumons sont les deux principaux organes de l'appareil respiratoire, situés dans la cage thoracique de part et d'autre du cœur",
        fait: "Ils ne sont pas symétriques : Le poumon droit est plus grand et plus lourd (environ 650 g, divisé en 3 lobes) que le poumon gauche (environ 550 g, divisé en 2 lobes), car le cœur occupe une partie de l'espace du côté gauche",
        deplacement: "translate(330px, -190px)"
    },

    "human-brain": {
        nom: "Le Cerveau",
        image: "Images/cerveau.png",
        fonction: "Le cerveau est le véritable « chef d'orchestre » du corps humain. Il fait partie du système nerveux central et joue un rôle essentiel pour nous maintenir en vie, interagir avec notre environnement et donner sens à notre existence",
        description: "Le cerveau est l'organe principal du système nerveux central",
        fait: "Le cerveau lui-même ne possède aucun récepteur de la douleur (nocicepteurs). C'est pour cette raison que certaines opérations chirurgicales sur le cerveau peuvent se faire alors que le patient est éveillé",
        deplacement: "translate(340px, -190px)"
    },

    "human-skeleton": {
        nom: "Le Squelette",
        image: "Images/squelette.png",
        fonction: "Le squelette soutient le corps, protège les organes internes et permet les mouvements grâce à son association avec les muscles et les articulations. Il participe également à la production des cellules sanguines et au stockage des minéraux",
        description: "Le squelette humain adulte est constitué de 206 os. Ces os sont reliés entre eux par des articulations et forment la structure rigide du corps. On distingue deux grandes parties : le squelette axial (crâne, colonne vertébrale et cage thoracique) et le squelette appendiculaire (membres supérieurs, membres inférieurs et ceintures).",
        fait: "Le squelette n'est pas figé , il se remodèle en permanence (environ 10 % de la masse osseuse est renouvelée chaque année) grâce à l'action des ostéoclastes et des ostéoblastes",
        deplacement: "translate(-67px, -10px)"
    },

    "mesh_0": {
        nom: "Le système digestif",
        image: "Images/disgetif.png",
        fonction: "Le système digestif transforme les aliments en nutriments que le corps peut absorber et utiliser pour produire de l'énergie, construire et réparer les tissus. Il permet également d'éliminer les déchets issus de la digestion.",
        description: "Le système digestif est un ensemble d'organes qui travaillent ensemble pour assurer la digestion. Il comprend notamment la bouche, l'œsophage, l'estomac, l'intestin grêle et le gros intestin. Les aliments y sont progressivement décomposés : les nutriments sont principalement absorbés dans l'intestin grêle, tandis que le gros intestin récupère une partie de l'eau et participe à la formation des selles",
        fait: "Le système digestif possède un réseau nerveux si vaste — le système nerveux entérique, composé de 100 à 200 millions de neurones — qu'il est souvent surnommé notre  deuxième cerveau" ,
        deplacement: "translate(380px, -250px)"
    }

};

const nomOrganeHTML = document.getElementById("nom-organe");
const imageOrganeHTML = document.querySelector("#image-organe img");

const fonctionOrganeHTML = document.getElementById("fonction-organe");
const descriptionOrganeHTML = document.getElementById("description-organe");
const faitOrganeHTML = document.getElementById("fait-organe");

//FONCTION AFFICH_FICHE
function afficherFicheOrgane(nom, fait = null) {

    // MODE 1 : AFFICHER UN FAIT INTÉRESSANT
    if (fait !== null) {

        nomOrganeHTML.textContent = "LE SAVAIS-TU ?";
        imageOrganeHTML.style.display = "none";

        fonctionOrganeHTML.textContent = "";
        descriptionOrganeHTML.textContent = fait;
        faitOrganeHTML.textContent = "";

        ficheOrgane.style.display = "block";
        return;
    }

    // MODE 2 : AFFICHER LA FICHE DE L'ORGANE
    const informations = informationsOrganes[nom];// JavaScript va récupérer automatiquement toutes les informations associées à cette clé dans ton objet

    if (!informations) {
        return;
    }

    //Remplir la fiche
    nomOrganeHTML.textContent = informations.nom;
    imageOrganeHTML.style.display = "";// Réaffiche l'image de la fiche
    imageOrganeHTML.src = informations.image;
    imageOrganeHTML.style.transform = informations.deplacement || "translate(0px, 0px)";

    //Infos sur les organes
    fonctionOrganeHTML.textContent = informations.fonction;
    descriptionOrganeHTML.textContent = informations.description;
    faitOrganeHTML.textContent = informations.fait;

    ficheOrgane.style.display = "block";// affi
}

//FONCTION QUI DETECTE OU ON CLIQUE
function detecterClic(event){
    
    souris.x = (event.clientX / window.innerWidth) * 2 - 1 // récupère la position horizontale du clic.
    souris.y = -(event.clientY / window.innerHeight) * 2 + 1 // récupère sa position verticale

    raycaster.setFromCamera(souris, camera); // Elle récupère la position de la souris / Elle projette un rayon depuis la caméra dans la direction correspondante

    const objets = [coeur, poumons, cerveau, squelette, digestif].filter(objet => objet !== null); //création d'un tableau des eléments cliquable/ garde les objets sui sont différent de null
    const intersections = raycaster.intersectObjects(objets, true); // cherche les objets  rencontrés par le rayon
    console.log(intersections);// observer le résultat dans la console

    if (intersections.length > 0){ // vérifie qu'au moins un objet a été touché

        const objetClique = intersections[0].object; // récupère la première intersection

        let fragmentInformatif = objetClique;

        while (fragmentInformatif && !fragmentInformatif.userData.informatif) {
            fragmentInformatif = fragmentInformatif.parent;
        }

        const organeSelectionne = objets.find(organe => {

            let parent = objetClique;
            while (parent) {

                if (parent === organe) {
                    return true;
                }

                parent = parent.parent;
            }
                                          
            return false;
        });
        console.log(organeSelectionne);

        console.log(objetClique); //
        const nomOrgane = objetClique.name;

       if (fragmentInformatif && fragmentInformatif.userData.informatif) {

            afficherFicheOrgane(null, fragmentInformatif.userData.fait);
        }

        else if (organeSelectionne) {

            afficherFicheOrgane(nomOrgane);
        }

        const positionOrgane = new THREE.Vector3();// crée un vecteur  qui possède 3 coordonnées
        organeSelectionne.getWorldPosition(positionOrgane); // récupère la position réel de l'organe
        positionOrgane.project(camera);// transforme les coordonnées 3D de l'organe en coordonnées normalisées par rapport à la caméra
        //elle permet à Three.js de calculer où l'organe apparaît sur l'écran selon le point de vue.
        
        const x = (positionOrgane.x * 0.5 + 0.5) * window.innerWidth;
        const y = (-positionOrgane.y * 0.5 + 0.5) * window.innerHeight;

        ficheOrgane.style.left = (x + 40) + "px";
        ficheOrgane.style.top = (y - 150) + "px";
    }

};
window.addEventListener("click", detecterClic); //dit à ton navigateur d'appeler la fonction lorsqu'on clique

//ajoute à la scène les éléments dy corps
scene.add(espaceCorps);

animer();

// 8. Adaptation à la taille de la fenêtre
window.addEventListener("resize", () => {

    composer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

});




