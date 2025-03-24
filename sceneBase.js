import { Personnage } from './personnage.js';

export class SceneBase {
    constructor(engine, canvas) {
        this.engine = engine;
        this.canvas = canvas;
        this.scene = new BABYLON.Scene(engine);
        this.camera = null;
        this.light = null;
        this.ground = null;
        this.personnage = null;  // Personnage ajouté ici
    }

    // Initialisation de la scène avec les éléments communs
    initScene() {
        // Création de la caméra fixe
        this.camera = new BABYLON.FreeCamera("FixedCamera", new BABYLON.Vector3(0, 10, -10), this.scene);
        this.camera.setTarget(new BABYLON.Vector3(0, 2.5, 0));
        this.camera.attachControl(this.canvas, false); // Désactivation du contrôle de la souris

        // Ajout de la lumière
        this.light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), this.scene);
        this.light.intensity = 0.7;

        // Création du sol (communs à toutes les scènes)
        this.ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 20, height: 20 }, this.scene);
    }

    // Méthode pour créer un mur
    createWall(name, width, height, position, rotation) {
        const wall = BABYLON.MeshBuilder.CreatePlane(name, { width, height }, this.scene);
        wall.position = position;
        wall.rotation = rotation;
        return wall;
    }

    // Méthode de rendu
    renderScene() {
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
    }

    // Méthode de redimensionnement
    resizeScene() {
        window.addEventListener("resize", () => {
            this.engine.resize();
        });
    }

    // Méthode pour appliquer la texture spécifique à chaque scène
    applyTextures(wallTexture) {
        const wallMaterial = new BABYLON.StandardMaterial("wallMat", this.scene);
        wallMaterial.diffuseTexture = new BABYLON.Texture(wallTexture, this.scene);
        wallMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

        // Appliquer la texture aux murs
        this.scene.getMeshByName("backWall").material = wallMaterial;
        this.scene.getMeshByName("leftWall").material = wallMaterial;
        this.scene.getMeshByName("rightWall").material = wallMaterial;
    }
}