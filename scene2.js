// scene2.js

import { SceneBase } from './sceneBase.js';
import { Personnage } from './personnage.js';

export class Scene2 extends SceneBase {
    constructor(engine, canvas) {
        super(engine, canvas);
        this.initScene();
    }

    initScene() {
        super.initScene();

        // Agrandir le sol
        this.ground.dispose(); // Supprimer l'ancien sol
        this.ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 100, height: 100 }, this.scene); // Nouveau sol beaucoup plus grand

        // Agrandir les murs
        this.createWall("backWall", 100, 20, new BABYLON.Vector3(0, 10, 50), new BABYLON.Vector3(0, 0, 0));
        this.createWall("leftWall", 100, 20, new BABYLON.Vector3(-50, 10, 0), new BABYLON.Vector3(0, -Math.PI / 2, 0));
        this.createWall("rightWall", 100, 20, new BABYLON.Vector3(50, 10, 0), new BABYLON.Vector3(0, Math.PI / 2, 0));
        this.createWall("frontWall", 100, 20, new BABYLON.Vector3(0, 10, -50), new BABYLON.Vector3(0, Math.PI, 0));

        // Créer le personnage ici et le placer sur la gauche de la pièce
        this.personnage = new Personnage(this.scene, new BABYLON.Vector3(-48, 1, 0));

        // Appliquer des couleurs bleues aux murs
        const blueMaterial = new BABYLON.StandardMaterial("blueWall", this.scene);
        blueMaterial.diffuseColor = new BABYLON.Color3(0, 0, 1); // Couleur bleue pour les murs

        // Appliquer la couleur bleue aux murs
        this.scene.getMeshByName("backWall").material = blueMaterial;
        this.scene.getMeshByName("leftWall").material = blueMaterial;
        this.scene.getMeshByName("rightWall").material = blueMaterial;
        this.scene.getMeshByName("frontWall").material = blueMaterial;

        // Application de la texture "herbe.webp" sur le sol
        const groundMaterial = new BABYLON.StandardMaterial("groundMat", this.scene);
        groundMaterial.diffuseTexture = new BABYLON.Texture("texture/herbe.webp", this.scene);
        this.ground.material = groundMaterial;
    }
}
