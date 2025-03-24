// game.js

// Charger les classes
import { Scene1 } from './scene1.js';

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

// Créer une instance de la scène 1
let scene1 = new Scene1(engine, canvas);

// Lancer la boucle de rendu
scene1.renderScene();
scene1.resizeScene();

// Redimensionner le moteur Babylon.js lorsque la fenêtre est redimensionnée
window.addEventListener("resize", () => {
    engine.resize();
});