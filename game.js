
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

// Ajout de l'ennemi
const enemy = new Enemy(scene1.scene, new BABYLON.Vector3(2, 5, 0));

// Créer une instance du personnage
const personnage = new Personnage(scene1.scene, new BABYLON.Vector3(2, 3, 0));

// Compter les clics pour changer de scène
let clickCount = 0;

// Configurer les actions de clic sur l'ennemi
enemy.enemy.actionManager = new BABYLON.ActionManager(scene1.scene);
enemy.enemy.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
    BABYLON.ActionManager.OnPickTrigger,
    () => {
        clickCount++;
        console.log(`Clic numéro: ${clickCount}`);

        // Vérifier si l'utilisateur a cliqué 3 fois
        if (clickCount === 3) {
            console.log("Trois clics effectués. Changer de scène...");

            // Supprimer la scène actuelle et libérer la mémoire
            scene1.scene.dispose();
            scene1 = null;  // Libérer la mémoire de la scène précédente

            // Créer la nouvelle scène 2
            const scene2 = new Scene2(engine, canvas);

            // Lancer la boucle de rendu de la scène 2
            scene2.renderScene();
            scene2.resizeScene();
        }
    }
));