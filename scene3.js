import { SceneBase } from './scenebase.js';
import { Personnage } from './personnage.js';
import { Enemy } from './enemy.js'; // Importer la classe Enemy

export class Scene3 extends SceneBase {
    constructor(engine, canvas) {
        super(engine, canvas);
        this.sceneName = "Scene3";
        this.roomSize = 20; // Taille de la pièce
        this.initScene();
    }

    async initScene() {
        super.initScene();

        // Configurer la scène
        this.scene.clearColor = new BABYLON.Color3(0.2, 0.2, 0.2); // Couleur de fond
        this.scene.collisionsEnabled = true;
        this.camera.checkCollisions = true;
        this.camera.applyGravity = true;
       


        // Ajouter le sol
        const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: this.roomSize, height: this.roomSize }, this.scene);
        const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", this.scene);
        groundMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5); // Couleur grise
        ground.material = groundMaterial;
        ground.checkCollisions = true;
        ground.position.y = 0.01;

        // Ajouter les murs
        const wallMaterial = new BABYLON.StandardMaterial("wallMaterial", this.scene);
        wallMaterial.diffuseColor = new BABYLON.Color3(0.7, 0.7, 0.7); // Couleur claire

        const wallHeight = 10;
        const wallThickness = 0.5;

        const backWall = BABYLON.MeshBuilder.CreateBox("backWall", { width: this.roomSize, height: wallHeight, depth: wallThickness }, this.scene);
        backWall.position = new BABYLON.Vector3(0, wallHeight / 2, this.roomSize / 2);
        backWall.material = wallMaterial;
        backWall.checkCollisions = true;

        const leftWall = BABYLON.MeshBuilder.CreateBox("leftWall", { width: this.roomSize, height: wallHeight, depth: wallThickness }, this.scene);
        leftWall.rotation.y = Math.PI / 2;
        leftWall.position = new BABYLON.Vector3(-this.roomSize / 2, wallHeight / 2, 0);
        leftWall.material = wallMaterial;
        leftWall.checkCollisions = true;

        const rightWall = BABYLON.MeshBuilder.CreateBox("rightWall", { width: this.roomSize, height: wallHeight, depth: wallThickness }, this.scene);
        rightWall.rotation.y = Math.PI / 2;
        rightWall.position = new BABYLON.Vector3(this.roomSize / 2, wallHeight / 2, 0);
        rightWall.material = wallMaterial;
        rightWall.checkCollisions = true;

        // Supprimer le mur de devant (ne pas le créer)

        // Ajouter le personnage
        this.personnage = new Personnage(this.scene, new BABYLON.Vector3(0, 1, 0)); // Position initiale au centre de la pièce

        // Ajouter un ennemi
        const enemyPosition1 = new BABYLON.Vector3(5, 1, 5); // Position de l'ennemi
        const enemyPosition2 = new BABYLON.Vector3(-5, 1, 5); // Position de l'ennemi
        const enemyPosition3 = new BABYLON.Vector3(7, 1, 5); // Position de l'ennemi
        const enemy1 = new Enemy(this.scene, this.personnage, enemyPosition1, 1, 3); // Taille 2, santé 3
        const enemy2 = new Enemy(this.scene, this.personnage, enemyPosition2, 1, 3); // Taille 2, santé 3
        const boss = new Enemy(this.scene, this.personnage, enemyPosition3, 3, 3); // Taille 2, santé 3

        console.log("Scène 2 initialisée avec un ennemi.");
    }

    _restartScene() {
        console.log("✝️  Le joueur est mort – redémarrage de la scène 2");
        // débrancher la boucle de rendu de la scène courante
        this.scene.dispose();

        // recréer une scène 2 “neuve” avec le même engine & canvas
        const engine = this.getEngine();
        const canvas = engine.getRenderingCanvas();
        const newScene = new Scene2(engine, canvas);   // c’est tout !
    }
}