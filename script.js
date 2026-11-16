
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';//Import qui crée un espace avec différente surface et lumière utilise pour le fragment
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'; //Organise les effets graphiques
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'; // Prépare le rendu initial de la scène
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'; // Ajoute l'effet de halo lumineux
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'; // import pour le coeur humain
console.log("NOUVELLE VERSION DU SCRIPT");

// 1. Création de la scène
const scene = new THREE.Scene();

scene.background = new THREE.Color(0xD3D3D3);
scene.fog = new THREE.Fog(0xD3D3D3, 12, 57);

//Géometrie deu pilier
const pilierGeometry = new THREE.BoxGeometry(2.5, 30, 2.5);

//matériau du pilier
const pilierMaterial = new THREE.MeshStandardMaterial({
    color : 0x777777,
    roughness : 0.8
});

const pilier = new THREE.Mesh(
    pilierGeometry,
    pilierMaterial
);
pilier.position.set(-9, 16, 0);
const pilier2 = pilier.clone();
const pilier3 = pilier.clone();
const pilier4 = pilier.clone();
const pilier5 = pilier.clone();
const pilier6 = pilier.clone();

pilier2.position.set(9, 16, 0);
pilier3.position.set(11, 19, -9);
pilier4.position.set(-11, 19, -9);
pilier5.position.set(11, 23, -20);
pilier6.position.set(-11, 23, -20);

scene.add(pilier);
scene.add(pilier2);
scene.add(pilier3);
scene.add(pilier4);
scene.add(pilier5);
scene.add(pilier6);


// Création d'une ruine composée de plusieurs blocs

function creerRuine(){

    // Conteneur qui rassemble tous les morceaux
    const ruine = new THREE.Group();

    // Matériau commun aux morceaux
    const ruineMaterial = new THREE.MeshStandardMaterial({
        color: 0x77818a,
        roughness: 0.75,
        metalness: 0.2
    });

    // Fonction qui fabrique un morceau de la ruine
    function ajouterBloc(largeur, hauteur, profondeur, x, y, z, rotationX, rotationZ){


        const facteurBloc = 1.7 + Math.random() * 1.6;
        const nouvelleLargeur = largeur * facteurBloc;
        const nouvelleHauteur = hauteur * facteurBloc;
        const nouvelleProfondeur = profondeur * facteurBloc;

        const geometry = new THREE.BoxGeometry(
            nouvelleLargeur,
            nouvelleHauteur,
            nouvelleProfondeur
        );

        const bloc = new THREE.Mesh(geometry, ruineMaterial);

        bloc.position.set(x, y, z);

        bloc.rotation.x = rotationX;
        bloc.rotation.z = rotationZ;

        ruine.add(bloc);
    }

    // Les différents morceaux de la ruine

    // 1. Partie verticale principale
    ajouterBloc(2, 8, 2, 0, 0, 0, 0, 0);

    // 2. Partie supérieure légèrement inclinée
    ajouterBloc(2, 3, 2, 0.5, 5, 0, 0.1, 0.15);

    // 3. Dalle brisée sur le côté
    ajouterBloc(4, 0.7, 2, -1.5, 3, 0, 0.1, 0.2);

    // 4. Morceau détaché
    ajouterBloc(1.5, 2, 1.5, 2.2, 4.5, 0.5, 0.2, -0.3);

    // 5. Petit fragment supérieur
    ajouterBloc(1.5, 1, 1.5, -1.5, 7, -0.5, 0.3, -0.2);

    return ruine;
}
const ruines = [];

for(let i = 0; i < 10; i++){
    const ruine = creerRuine();// Référence à l'objet crée

    ruine.position.set(
        Math.random() * 40 - 20,
        Math.random() * 40 + 3,
        Math.random() * -40 - 30
    );

    ruines.push(ruine);
    scene.add(ruine);
}


// 2. Création de la caméra
const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 1.5, 8);
camera.lookAt(0, 1.5, 0);

// 3. Création du moteur graphique
const renderer = new THREE.WebGLRenderer({ //transforme ce que vois la caméra en image à afficher dansle navigateur
    antialias: true
});
const pmremGenerator = new THREE.PMREMGenerator(renderer);
const environnement = new RoomEnvironment(); // Création d'une pièce virtuelle
const environnementMap = pmremGenerator.fromScene(environnement);//trnasforme notre environnment en une texture adaptée aux matériaux physiques

renderer.setSize(window.innerWidth, window.innerHeight);

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



document.querySelector("#scene").appendChild(renderer.domElement);

// Création d'une texture pour le sol
const canvas = document.createElement("canvas");// Création d'un éléments canva qui va servir de toile pour la texture

canvas.width = 512;//largeur
canvas.height = 512;// hauteur

const contexte = canvas.getContext("2d");// accès aux outils permettant de dessiner sur canva en deux dimensions

const image = contexte.createImageData(512, 512);//Création d'une structure qui va contenir les informations couleurs de chaque pixels

for(let i = 0; i < image.data.length; i += 4){// Boucle qui parcourt tous les pixels / image.data = tableau contenant les valeurs couleurs

    const blanc = 230 + Math.random() * 15;//générer une nuance de blanc
    //Atribution de la même couleur pour un sol gris
    image.data[i] = blanc;
    image.data[i + 1] = blanc;
    image.data[i + 2] = blanc;

    image.data[i + 3] = 255;
}

contexte.putImageData(image, 0, 0); //Permet d'appliquer les données à notre canva

const solTexture = new THREE.CanvasTexture(canvas);//CanvasTexture transforme le canva en texture
solTexture.colorSpace = THREE.SRGBColorSpace;// Adapte les couleurs à celui de notre image

// 4. Création du sol
const solGeometry = new THREE.PlaneGeometry(200, 200);

const solMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: solTexture,
    side: THREE.DoubleSide,
    roughness: 0.70,
    metalness: 0
});

const sol = new THREE.Mesh(solGeometry, solMaterial);

sol.rotation.x = -Math.PI / 2;
sol.position.y = -1;

scene.add(sol);


// 5. Éclairage
const lumiereAmbiante = new THREE.AmbientLight(0xffffff, 1.6);
scene.add(lumiereAmbiante);

const lumiere = new THREE.DirectionalLight(0xffffff, 1);
lumiere.position.set(5, 10, 5);
scene.add(lumiere);

// 6. Affichage de la scène
function animer() {
    requestAnimationFrame(animer); // demande au navigateur de rapeler la fonction
    //rotation des fragments
    for(const fragment of fragments){
        fragment.rotation[fragment.userData.axe] += fragment.userData.vitesse;
    }

    //rotation du coeur
    if (coeur) { // vérifie le mmodèle a été chargé 
        coeur.rotation.y += 0.003; // fait tourner le coeur
    }

    composer.render();//affcihe la scène
}

//Matière du fragment
const fragmentMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xe5f2ff, // couleur du fragment
    roughness: 0.02, //rend la surface du fragment plus lisse, reflets plus nets
    metalness: 0, // rend le fragment métallique
    transmission: 1, // quantité de lumière qui traverse le matériau
    thickness: 0.6, // laisse passer beaucoup de lumière
    ior: 2.4, // determine la déviation de la lumière 
    envMapIntensity : 1.5
});


const edgesMaterial = new THREE.LineBasicMaterial({
    color: 0xFFFFFF
});

function creerFragment(){

    // 7. Creéation du premier fragment
    const fragmentGeometry = new THREE.IcosahedronGeometry(0.8, 0);// En premier le rayon en deuxième niveau de subdivision

    //Récupérer les sommets
    const positions = fragmentGeometry.attributes.position;

    // Utilisation de Map
    const facteurs = new Map(); // Map structure  sui permet d'utiliser clé/valeur
    //Déformations
    for(let i = 0; i < positions.count; i++){
        const x = positions.getX(i);
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

    const fragment = new THREE.Mesh(
    fragmentGeometry,
    fragmentMaterial
    );

    const axes = ["x", "y", "z"]; // Les trois axes possibles
    const axesChoisi = axes[Math.floor(Math.random() * axes.length)]; 
    const sens = Math.random() < 0.5 ? -1 : 1; // choisi entre une rotation positive et négative
    const vitesse = sens * (0.001 + Math.random() *0.002); // Vitesse de la rotation
    fragment.userData.axe = axesChoisi;
    fragment.userData.vitesse = vitesse;

    const edgesGeometry = new THREE.EdgesGeometry(fragmentGeometry);// Analyse la géométrie et récupère les arrêtes
    const edges = new THREE.LineSegments( // dessine une succesion de segments independants 
    edgesGeometry,
    edgesMaterial
    );
    fragment.add(edges);

    fragment.position.set(
        Math.random() * 15 - 5,
        Math.random() * 7 + 1,
        Math.random() * 9 - 5
    );
   
    scene.add(fragment);    // Ajout de l'objet fragment à la scene

    return fragment;
}

fragmentMaterial.envMap = environnementMap.texture; // Association de l'objet environnement à la scene et fournit un environnement de réflexion aux matériaux compatibles

const fragments = [];

for(let i = 0; i < 50; i++){
    const fragment = creerFragment();
    fragments.push(fragment); // Ajoute chaque fragment au tableau 

    if(fragment.position.z > -7 && 
       fragment.position.z < -3 &&
       Math.abs(fragment.position.x) < 2){ // fragment proche de la profondeur du portail / Math.abs() Repère les fragments proche du portail

        if(fragment.position.x < 0){ // savoir dans quelle directeion déplacer les fragments
            fragment.position.x -= 2;
        }
        else{ //savoir dans quelle directeion déplacer les fragments
            fragment.position.x += 2;
        }

    }

}

for(let i = 0; i < 60; i++){
    const fragment = creerFragment();// reférence vers l'objet crée
    fragment.scale.setScalar(0.35);

    fragment.position.set(
        Math.random() * 50 - 15,
        Math.random() * 8 + 1,
        Math.random() * 10 - 25
    );
    fragments.push(fragment);
}
function creerPortail(){
    const portail = new THREE.Group();

    const positions = [
    [-1, 1, 0.3],
    [-1.5, 2, -0.3],
    [-1.5, 3, 0.1],
    [-1, 4, 0],
    [0, 4.5, 0.5],
    [1, 4, 0],
    [1.5, 3, -0.1],
    [1.5, 2, 0.4],
    [1, 1, 0]
    ];

    for(let i = 0; i < positions.length; i++){
        const fragment = creerFragment();

        fragment.material = fragment.material.clone();// clone des matériaux fragment
        fragment.material.emissive.set(0xff6961);// couleur le matériau semble émettre
        fragment.material.emissiveIntensity = 0.4;// Intensité de l'émission lumineuse

        fragment.position.set(
            positions[i][0],
            positions[i][1],
            positions[i][2]
        );

        portail.add(fragment);
    }
    portail.position.set(0, -1, -5);

    const lumierePortail = new THREE.PointLight(// Crée une lumière qui rayonne dans toutes les directions
    0x8ADFFF, // Couleur bleu clair
    5,        // Intensité
    12        // Distance d'éclairage
    );

    lumierePortail.position.set(0, -1, -5);
    portail.add(lumierePortail);

    return portail;
}
const portail = creerPortail();
scene.add(portail);



// ESCPACE DU CORPS HUMAIN

const espaceCorps = new THREE.Group();
espaceCorps.name = "EspaceCorps";

// SOL DE L'ESPACE DU CORPS


function creerTextureMarbre() {

    // Création d'une image de 1024 x 1024 pixels
    const canvas = document.createElement("canvas");//permet de créer une image directement en JavaScript.
    canvas.width = 1024;
    canvas.height = 1024;

    const contexte = canvas.getContext("2d");

    // Fond blanc
    contexte.fillStyle = "#ffffff";
    contexte.fillRect(0, 0, 1024, 1024);

    
    // Veines principales
    for (let i = 0; i < 40; i++) { //40 veines principales 

        const departX = Math.random() * 1024;
        const departY = Math.random() * 1024;

        contexte.beginPath();
        contexte.moveTo(departX, departY);

        contexte.bezierCurveTo(
            departX + Math.random() * 150 - 75,
            departY + Math.random() * 150 - 75,
            departX + Math.random() * 250 - 125,
            departY + Math.random() * 250 - 125,
            departX + Math.random() * 350 - 175,
            departY + Math.random() * 350 - 175
        );

        contexte.strokeStyle = "rgba(150, 20, 35, 0.23)";
        contexte.lineWidth = Math.random() * 2 + 1;
        contexte.stroke();
    }

    // Fines ramifications
    for (let i = 0; i < 25; i++) {//25 ramifications pour enrichir le motif 

        contexte.beginPath();// dessine un trait 

        const x = Math.random() * 1024;//choix d'une position aléatoire
        const y = Math.random() * 1024;

        contexte.moveTo(x, y);//definit le point de départ
        contexte.lineTo(// indique où le trait doit se terminer.
            x + Math.random() * 100 - 50,//choix aléatoire du lieu du trait
            y + Math.random() * 100 - 50
        );

        contexte.strokeStyle = "rgba(150, 20, 35, 0.23)";// choix de la couleur, quantité de rouge 150, de vert 20, de bleu 35 et opavité 0.23
        contexte.lineWidth = 1;//épaisseur du trait
        contexte.stroke();// demande au navigateur de dessiner
    }

    // Transformation du dessin en texture Three.js
    const texture = new THREE.CanvasTexture(canvas);//transforme notre image en texture utilisable par Three.js.

    texture.colorSpace = THREE.SRGBColorSpace;

    return texture;
}

const solCorpsGeometry = new THREE.PlaneGeometry(40, 40);//création de la forme du sol du corps

const solCorpsMaterial = new THREE.MeshPhysicalMaterial({// physique du sol 
    map: creerTextureMarbre(),//map indique au matériau quelle image utiliser pour recouvrir sa surface.
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

solCorps.rotation.x = -Math.PI / 2;
solCorps.position.y = -1;

const lumiereSol = new THREE.PointLight(0xffffff, 16, 30);//lumière pour éclairer le sol et le faire être plus réflechissant

lumiereSol.position.set(0, 5, 0);

espaceCorps.add(lumiereSol);

espaceCorps.add(solCorps);


// PREMIER PILIER

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

// CHARGEMENT DU COEUR
const loader = new GLTFLoader();
let coeur = null;

loader.load(
    './models/human-heart-light.glb',

    function(gltf) {

        coeur = gltf.scene;

        coeur.scale.set(30, 30, 30);
        coeur.position.set(0, 2, -5);
        coeur.rotation.y = 0;

        espaceCorps.add(coeur);

    },

    undefined,

    function(erreur) {
        console.error("Erreur lors du chargement du coeur :", erreur);
    }
);


scene.add(espaceCorps);

animer();

// 8. Adaptation à la taille de la fenêtre
window.addEventListener("resize", () => {

    composer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

});




