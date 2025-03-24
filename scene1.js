// scene1.js

import { SceneBase } from './sceneBase.js';

export class Scene1 extends SceneBase {
    constructor(engine, canvas) {
        super(engine, canvas);
        this.initScene();
        this.applyColors(); // Appliquer les couleurs aux murs
    }

    initScene() {
        super.initScene();
        this.handleKeyboard(); // Gérer les entrées clavier spécifiques

        // Assurez-vous qu'il n'y a pas de création de personnage supplémentaire ici
        // Si vous avez du code qui crée un personnage, supprimez-le ou commentez-le
        // Exemple :
        // const personnage = BABYLON.MeshBuilder.CreateBox("personnage", { size: 1 }, this.scene);
        // personnage.position = new BABYLON.Vector3(0, 1, 0);
    }

    // Appliquer des couleurs aux murs au lieu des textures
    applyColors() {
        const redMaterial = new BABYLON.StandardMaterial("redWall", this.scene);
        redMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0); // Couleur rouge pour les murs

        // Appliquer la couleur rouge aux murs
        this.scene.getMeshByName("backWall").material = redMaterial;
        this.scene.getMeshByName("leftWall").material = redMaterial;
        this.scene.getMeshByName("rightWall").material = redMaterial;

        // Application de la texture "herbe.webp" sur le sol
        const groundMaterial = new BABYLON.StandardMaterial("groundMat", this.scene);
        groundMaterial.diffuseTexture = new BABYLON.Texture("texture/herbe.webp", this.scene);
        this.ground.material = groundMaterial;
    }
}
