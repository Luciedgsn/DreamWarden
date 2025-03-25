// game.js

// Charger les classes
import { Scene1 } from './scene1.js';
import { SceneWelcome } from './sceneWelcome.js';
import { Scene2 } from './scene2.js';

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

// Créer une instance de la scène d'accueil
let welcomeScene = new SceneWelcome(engine, canvas);

// Lancer la boucle de rendu de la scène d'accueil
welcomeScene.renderScene();

// Redimensionner le moteur Babylon.js lorsque la fenêtre est redimensionnée
window.addEventListener("resize", () => {
    engine.resize();
});