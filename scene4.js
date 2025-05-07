// scene2.js

import { SceneBase } from './scenebase.js';
import { Personnage } from './personnage.js';

export class Scene4 extends SceneBase {
    constructor(engine, canvas) {
        super(engine, canvas);
        this.sceneName = "Scene4"; // Nom de la scène
        this.scene.sceneName = "Scene4";
        this.initScene();
    }

    async initScene() {
        super.initScene();

        // Restaurer la lumière naturelle
        this.scene.clearColor = new BABYLON.Color3(1, 0.8, 0.86) // Fond gris clair
        this.light.intensity = 0.7; // Réactiver la lumière hémisphérique

        // Agrandir le sol
        this.ground.dispose(); // Supprimer l'ancien sol
        this.ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 100, height: 100 }, this.scene); // Nouveau sol beaucoup plus grand

        // Créer un matériau bleu pour le sol
        const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", this.scene);
        groundMaterial.diffuseColor = new BABYLON.Color3(1, 1, 0.8); // Couleur jaune 
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

    showCompletionMessage() {
        const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        const message = new BABYLON.GUI.TextBlock();
        message.text = "Salle terminée";
        message.color = "white";
        message.fontSize = 50;
        message.top = "40%";
        advancedTexture.addControl(message);
    }

    async loadAndPlaceGrass() {
        const grassMeshes = await BABYLON.SceneLoader.ImportMeshAsync("", "asset/", "Herbe.glb", this.scene);
        const grass = grassMeshes.meshes.find(mesh => mesh.geometry); // Trouver le mesh avec de la géométrie

        if (!grass) {
            console.error("Aucun mesh avec de la géométrie trouvé dans le modèle d'herbe.");
            return;
        }
        }
}