// scene2.js

import { SceneBase } from './sceneBase.js';
import { Personnage } from './personnage.js';

export class Scene2 extends SceneBase {
    constructor(engine, canvas) {
        super(engine, canvas);
        this.initScene();
    }

    async initScene() {
        super.initScene();

        // Restaurer la lumière naturelle
        this.scene.clearColor = new BABYLON.Color3(0.8, 0.8, 0.8); // Fond gris clair
        this.light.intensity = 0.7; // Réactiver la lumière hémisphérique

        // Agrandir le sol
        this.ground.dispose(); // Supprimer l'ancien sol
        this.ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 100, height: 100 }, this.scene); // Nouveau sol beaucoup plus grand

        // Créer un matériau bleu pour le sol
        const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", this.scene);
        groundMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1); // Couleur bleue
        this.ground.material = groundMaterial;

        // Créer un matériau en pierre pour les murs
        const wallMaterial = new BABYLON.StandardMaterial("wallMaterial", this.scene);
        wallMaterial.diffuseTexture = new BABYLON.Texture("asset/pierre.jpg", this.scene);
        wallMaterial.diffuseTexture.uScale = 5; // Répéter la texture sur l'axe U
        wallMaterial.diffuseTexture.vScale = 5; // Répéter la texture sur l'axe V

        // Vérifier le chargement de la texture
        wallMaterial.diffuseTexture.onLoadObservable.add(() => {
            console.log("Texture pierre.jpg chargée avec succès");
        });

        // Appliquer la texture en pierre aux murs
        const backWall = this.scene.getMeshByName("backWall");
        const leftWall = this.scene.getMeshByName("leftWall");
        const rightWall = this.scene.getMeshByName("rightWall");
        const frontWall = this.scene.getMeshByName("frontWall");

        if (backWall && leftWall && rightWall && frontWall) {
            backWall.material = wallMaterial;
            leftWall.material = wallMaterial;
            rightWall.material = wallMaterial;
            frontWall.material = wallMaterial;
        } else {
            console.error("Les murs n'ont pas été trouvés dans la scène");
        }

        // Créer le personnage ici et le placer au centre de la pièce
        this.personnage = new Personnage(this.scene, new BABYLON.Vector3(0, 1, 0));

        // Charger et dupliquer le modèle d'herbe sur le sol
        await this.loadAndPlaceGrass();
    }

    checkCollisions() {
        // Pas d'ennemi dans cette scène, donc pas de collisions à vérifier
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

    teleportToScene2() {
        // Pas de téléportation dans cette scène
    }

    createWall(name, width, height, position, rotation, thickness = 1) {
        const wall = BABYLON.MeshBuilder.CreateBox(name, { width, height, depth: thickness }, this.scene);
        wall.position = position;
        wall.rotation = rotation;
        return wall;
    }

    createInvisibleWall(name, width, height, position, rotation, thickness = 1) {
        const wall = BABYLON.MeshBuilder.CreateBox(name, { width, height, depth: thickness }, this.scene);
        wall.position = position;
        wall.rotation = rotation;
        wall.isVisible = false; // Rendre le mur invisible
        wall.checkCollisions = true; // Activer les collisions pour le mur invisible
        return wall;
    }

    async loadAndPlaceGrass() {
        const grassMeshes = await BABYLON.SceneLoader.ImportMeshAsync("", "asset/", "Herbe.glb", this.scene);
        const grass = grassMeshes.meshes.find(mesh => mesh.geometry); // Trouver le mesh avec de la géométrie

        if (!grass) {
            console.error("Aucun mesh avec de la géométrie trouvé dans le modèle d'herbe.");
            return;
        }

        // Vérifier le chargement du modèle d'herbe
        console.log("Modèle d'herbe chargé :", grass);

        // Redimensionner et positionner l'herbe
        grass.scaling = new BABYLON.Vector3(1, 1, 1);
        grass.position.y = 0.1; // Légèrement au-dessus du sol

        // Dupliquer l'herbe de manière aléatoire sur le sol
        const numGrassInstances = 500; // Nombre de brins d'herbe à placer
        const groundSize = 100; // Taille du sol
        for (let i = 0; i < numGrassInstances; i++) {
            const x = Math.random() * groundSize - groundSize / 2;
            const z = Math.random() * groundSize - groundSize / 2;
            const instance = grass.createInstance(`grass_${i}`);
            instance.position = new BABYLON.Vector3(x, 0.1, z);

            // Vérifier la création des instances
            console.log(`Instance ${i} positionnée à :`, instance.position);
        }

        // Masquer le modèle original
        grass.isVisible = false;
    }
}