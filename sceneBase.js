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
        this.camera = new BABYLON.FreeCamera("FixedCamera", new BABYLON.Vector3(0, 5, -5), this.scene);
        this.camera.setTarget(new BABYLON.Vector3(0, 1.25, 0));
        this.camera.attachControl(this.canvas, false); // Désactivation du contrôle de la souris

        // Ajout de la lumière
        this.light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), this.scene);
        this.light.intensity = 0.7;

         // Création du sol
        this.ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 10, height: 10 }, this.scene);

        // Création des murs
        this.createWall("backWall", 50, 10, new BABYLON.Vector3(0, 5, 25), new BABYLON.Vector3(0, 0, 0), 0.5);
        this.createWall("leftWall", 50, 10, new BABYLON.Vector3(-25, 5, 0), new BABYLON.Vector3(0, -Math.PI / 2, 0), 0.5);
        this.createWall("rightWall", 50, 10, new BABYLON.Vector3(25, 5, 0), new BABYLON.Vector3(0, Math.PI / 2, 0), 0.5);
        const bottomWall = this.createWall("frontWall", 50, 10, new BABYLON.Vector3(0, 5, -25), new BABYLON.Vector3(0, Math.PI, 0), 0.5);

        
        // Rendre le mur du bas invisible mais conserver les collisions
        bottomWall.isVisible = false;
        bottomWall.checkCollisions = true;

        // Activer les collisions pour le sol et les autres murs
        this.ground.checkCollisions = true;
        this.scene.getMeshByName("backWall").checkCollisions = true;
        this.scene.getMeshByName("leftWall").checkCollisions = true;
        this.scene.getMeshByName("rightWall").checkCollisions = true;
    }

    // Méthode pour créer un mur
    createWall(name, width, height, position, rotation) {
        const wall = BABYLON.MeshBuilder.CreatePlane(name, { width, height }, this.scene);
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