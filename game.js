// game.js

// Charger les classes
import { Scene1 } from './scene1.js';
import { Scene2 } from './Scene2.js';
import { Enemy } from './enemy.js';
import { Personnage } from './personnage.js';

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

// Créer une instance de la scène 1
let scene1 = new Scene1(engine, canvas);

// Lancer la boucle de rendu
scene1.renderScene();
scene1.resizeScene();