
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';//Import qui crée un espace avec différente surface et lumière utilise pour le fragment
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'; //Organise les effets graphiques
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'; // Prépare le rendu initial de la scène
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'; // Ajoute l'effet de halo lumineux
console.log("NOUVELLE VERSION DU SCRIPT");

// 1. Création de la scène
const scene = new THREE.Scene();

scene.background = new THREE.Color(0x303030);
scene.fog = new THREE.Fog(0x303030, 20, 50);

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

// 4. Création du sol
const solGeometry = new THREE.PlaneGeometry(200, 200);

const solMaterial = new THREE.MeshStandardMaterial({
    color: 0xFAFAFA,
    side: THREE.DoubleSide
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
const axes = ["x", "y", "z"]; // Les trois axes possibles
const axesChoisi = axes[Math.floor(Math.random() * axes.length)]; 
const sens = Math.random() < 0.5 ? -1 : 1; // choisi entre une rotation positive et négative
const vitesse = sens * (0.001 + Math.random() *0.002); // Vitesse de la rotation

function animer() {
    requestAnimationFrame(animer);
    fragment.rotation[axesChoisi] += vitesse;
    composer.render();
}
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
fragmentGeometry.scale(0.40, 0.7, 0.70);// modifier la forme du fragment
fragmentGeometry.computeVertexNormals(); //indiquent l'orientation des surfaces du fragment, calcule comment la lumière interagit avec chaque face

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

const edgesGeometry = new THREE.EdgesGeometry(fragmentGeometry);// Analyse la géométrie et récupère les arrêtes
const edgesMaterial = new THREE.LineBasicMaterial({
    color: 0xFFFFFF
});

function creerFragment(){
    const fragment = new THREE.Mesh(
    fragmentGeometry,
    fragmentMaterial
    );

    const edges = new THREE.LineSegments( // dessine une succesion de segments independants 
    edgesGeometry,
    edgesMaterial
    );
    fragment.add(edges);

    fragment.position.set(
        Math.random() * 10 - 5
        Math.random() * 5 + 1,
        Math.random() * 10 - 5
        );
   
    scene.add(fragment);    // Ajout de l'objet fragment à la scene

    return fragment;
}

fragmentMaterial.envMap = environnementMap.texture; // Association de l'objet environnement à la scene et fournit un environnement de réflexion aux matériaux compatibles
for(let i = 0; i < 10; i++){
    creerFragment();
}


animer();

// 8. Adaptation à la taille de la fenêtre
window.addEventListener("resize", () => {

    composer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

});




