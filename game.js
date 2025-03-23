// game.js

// Charger les classes
import { Scene1 } from './scene1.js';
import { Scene2 } from './scene2.js';
import { Enemy } from './enemy.js';

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

// Créer une instance de la scène 1
let scene1 = new Scene1(engine, canvas);

// Lancer la boucle de rendu
scene1.renderScene();
scene1.resizeScene();

// Ajout de l'ennemi
const enemy = new Enemy(scene1.scene, new BABYLON.Vector3(0, 1, 0));

// Compter les clics pour changer de scène
let clickCount = 0;
enemy.enemy.actionManager = new BABYLON.ActionManager(scene1.scene);
enemy.enemy.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
    BABYLON.ActionManager.OnPickTrigger,
    () => {
        clickCount++;
        console.log(`Clic numéro: ${clickCount}`);
        if (clickCount === 3) {
            console.log("Trois clics effectués. Changer de scène...");
            // Supprimer la scène actuelle
            scene1.scene.dispose();
            scene1 = null;  // Libérer la mémoire

            // Créer la nouvelle scène 2
            const scene2 = new Scene2(engine, canvas); 
            scene2.renderScene(); // Afficher la scène 2
        }
    }
));
