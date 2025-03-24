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
        this.camera = new BABYLON.FreeCamera("FixedCamera", new BABYLON.Vector3(0, 13, -16), this.scene);
        this.camera.setTarget(new BABYLON.Vector3(0, 2.5, 0));
        this.camera.attachControl(this.canvas, false); // Désactivation du contrôle de la souris
        this.camera.inputs.clear(); // Supprime tous les contrôles de la caméra

        // Ajout de la lumière
        this.light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), this.scene);
        this.light.intensity = 0.7;

        // Création du sol (communs à toutes les scènes)
        this.ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 20, height: 20 }, this.scene);
        
        // Création des murs communs
        this.createWall("backWall", 20, 20, new BABYLON.Vector3(0, 5, 10), new BABYLON.Vector3(0, 0, 0));
        this.createWall("leftWall", 20, 20, new BABYLON.Vector3(-10, 5, 0), new BABYLON.Vector3(0, -Math.PI / 2, 0));
        this.createWall("rightWall", 20, 20, new BABYLON.Vector3(10, 5, 0), new BABYLON.Vector3(0, Math.PI / 2, 0));

        // Créer le personnage ici
        this.personnage = new Personnage(this.scene, new BABYLON.Vector3(0, 1, 0));
    }

    // Méthode pour gérer les entrées clavier
    handleKeyboard() {
        this.scene.inputStates = {};
        window.addEventListener("keydown", (event) => {
            if (event.key === "ArrowLeft") this.scene.inputStates.left = true;
            if (event.key === "ArrowRight") this.scene.inputStates.right = true;
            if (event.key === "ArrowUp") this.scene.inputStates.up = true;
            if (event.key === "ArrowDown") this.scene.inputStates.down = true;
        });

        window.addEventListener("keyup", (event) => {
            if (event.key === "ArrowLeft") this.scene.inputStates.left = false;
            if (event.key === "ArrowRight") this.scene.inputStates.right = false;
            if (event.key === "ArrowUp") this.scene.inputStates.up = false;
            if (event.key === "ArrowDown") this.scene.inputStates.down = false;
        });

        // Déplacer uniquement le personnage
        this.scene.onBeforeRenderObservable.add(() => {
            const speed = 0.1;

            if (this.scene.inputStates.left) this.personnage.mesh.position.x -= speed;
            if (this.scene.inputStates.right) this.personnage.mesh.position.x += speed;
            if (this.scene.inputStates.up) this.personnage.mesh.position.z += speed;  // Inversé : déplacement en arrière (sur l'axe Z)
            if (this.scene.inputStates.down) this.personnage.mesh.position.z -= speed;  // Inversé : déplacement en avant (sur l'axe Z)
        });
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