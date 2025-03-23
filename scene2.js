// scene2.js

import { SceneBase } from './sceneBase.js';

export class Scene2 extends SceneBase {
    constructor(engine, canvas) {
        super(engine, canvas);
        this.initScene();
        this.applyColors(); // Appliquer les couleurs aux murs
    }

    initScene() {
        super.initScene();
        this.handleKeyboard(); // Gérer les entrées clavier spécifiques
    }

    // Appliquer des couleurs aux murs au lieu des textures
    applyColors() {
        const blueMaterial = new BABYLON.StandardMaterial("blueWall", this.scene);
        blueMaterial.diffuseColor = new BABYLON.Color3(0, 0, 1); // Couleur bleue pour les murs

        // Appliquer la couleur bleue aux murs
        this.scene.getMeshByName("backWall").material = blueMaterial;
        this.scene.getMeshByName("leftWall").material = blueMaterial;
        this.scene.getMeshByName("rightWall").material = blueMaterial;
    }
}
