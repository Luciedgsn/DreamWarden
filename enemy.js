// scene1.js

import { SceneBase } from './scenebase.js';
import { Personnage } from './personnage.js';
import { Scene2 } from './scene2.js'; // Assurez-vous que Scene2 est correctement importé

export class Scene1 extends SceneBase {
    constructor(engine, canvas) {
        super(engine, canvas);
        this.initScene();
    }

    async initScene() {
        super.initScene();

    }
}

export class Enemy {
    constructor(scene, personnage, position = new BABYLON.Vector3(10, 1, 0), size = 2, health = 3) {
        this.scene = scene;
        this.personnage = personnage; // Référence au personnage
        this.position = position;
        this.size = size;
        this.health = health; // Nombre de coups nécessaires pour tuer l'ennemi

        // Créer un cube rouge pour représenter l'ennemi
        this.enemy = BABYLON.MeshBuilder.CreateBox("enemy", { size: this.size }, this.scene);
        this.enemy.position = this.position;
        const enemyMaterial = new BABYLON.StandardMaterial("enemyMaterial", this.scene);
        enemyMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0); // Couleur rouge
        this.enemy.material = enemyMaterial;

        // Activer les collisions pour l'ennemi
        this.enemy.checkCollisions = true;

        // Ajouter un observateur pour détecter les collisions avec les boules de feu
        this.scene.onBeforeRenderObservable.add(() => {
            this.checkCollisions();
        });
    }

    checkCollisions() {
        // Vérifier les collisions avec les boules de feu
        this.scene.meshes.forEach(mesh => {
            if (mesh.name.startsWith("fireball")) {
                if (mesh.intersectsMesh(this.enemy, false)) {
                    this.health -= 1; // Réduire la santé de l'ennemi
                    mesh.dispose(); // Supprimer la boule de feu

                    if (this.health <= 0) {
                        this.destroy(); // Détruire l'ennemi
                        this.showCompletionMessage();
                        this.showTeleportationMessage();
                        this.teleportToScene2();
                    }
                }
            }
        });

        // Vérifier les collisions entre le personnage et l'ennemi
        if (this.personnage && this.personnage.mesh && this.personnage.mesh.intersectsMesh(this.enemy, false)) {
            console.log("Collision détectée entre le personnage et l'ennemi");
            // Ajouter ici le code pour gérer la collision entre le personnage et l'ennemi
        }
    }

    showCompletionMessage() {
        const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        const message = new BABYLON.GUI.TextBlock();
        message.text = "Salle terminée";
        message.color = "white";
        message.fontSize = 50;
        message.top = "40%";
        advancedTexture.addControl(message);
    }

    showTeleportationMessage() {
        const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        const background = new BABYLON.GUI.Rectangle();
        background.width = "100%";
        background.height = "100%";
        background.background = "black";
        advancedTexture.addControl(background);

        const completionMessage = new BABYLON.GUI.TextBlock();
        completionMessage.text = "Salle terminée";
        completionMessage.color = "white";
        completionMessage.fontSize = 50;
        completionMessage.top = "-10%";
        advancedTexture.addControl(completionMessage);

        const teleportationMessage = new BABYLON.GUI.TextBlock();
        teleportationMessage.text = "Téléportation en cours...";
        teleportationMessage.color = "white";
        teleportationMessage.fontSize = 50;
        teleportationMessage.top = "10%";
        advancedTexture.addControl(teleportationMessage);
    }

    teleportToScene2() {
        // Vérifier si la scène actuelle est de type Scene1
        console.log("this.scene.sceneName :", this.scene.sceneName);
        if (this.scene.sceneName === "Scene1") {
            setTimeout(() => {
                console.log("Téléportation vers Scene2...");

                // Créer la nouvelle scène 2 avant de supprimer la scène actuelle
                const scene2 = new Scene2(this.scene.getEngine(), this.scene.getEngine().getRenderingCanvas());

                // Supprimer la scène actuelle après avoir créé Scene2
                this.scene.dispose();

                // Lancer la boucle de rendu de la scène 2
                scene2.renderScene();
            }, 2000); // Délai de 2 secondes avant de téléporter le joueur
        } else {
            console.log("La téléportation vers Scene2 est désactivée car la scène actuelle n'est pas Scene1.");
        }
    }

    destroy() {
        console.log("Ennemi détruit !");
        this.enemy.dispose(); // Supprimer l'ennemi de la scène
    }
}
