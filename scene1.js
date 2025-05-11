// scene1.js

import { SceneBase } from './scenebase.js';
import { Personnage } from './personnage.js';
import { Enemy } from './enemy.js';

export class Scene1 extends SceneBase {
    constructor(engine, canvas) {
        super(engine, canvas); // Appeler le constructeur de SceneBase
        this.sceneName = "Scene1"; // Nom de la scène
        this.initScene(); // Initialiser la scène
    }

    async initScene() {
        super.initScene(); // Appeler la méthode initScene de SceneBase pour les éléments communs

        // Activer les collisions globales et pour la caméra
        this.scene.collisionsEnabled = true; // Activer les collisions globales
        this.camera.checkCollisions = true; // Activer les collisions pour la caméra
        this.camera.applyGravity = true; // Appliquer la gravité à la caméra
        this.ground.checkCollisions = true; // Activer les collisions pour le sol

        // Personnalisation spécifique à Scene1
        this.customizeScene();
    }

    customizeScene() {
        const roomSize = 25; // Taille de la pièce (largeur et profondeur)
        const wallHeight = 15; // Hauteur des murs
        const wallThickness = 0.5; // Épaisseur des murs

        // Supprimer tous les murs en dehors de la pièce
        this.scene.meshes.forEach(mesh => {
            if (mesh.name.includes("Wall") && !["backWall", "frontWall", "leftWall", "rightWall"].includes(mesh.name)) {
                mesh.dispose(); // Supprimer les murs inutiles
            }
        });

        // Supprimer l'ancien sol
        this.ground.dispose();

        // Créer un nouveau sol
        this.ground = BABYLON.MeshBuilder.CreateGround("ground", { width: roomSize, height: roomSize }, this.scene);

        // Appliquer une texture au sol
        const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", this.scene);
        groundMaterial.diffuseTexture = new BABYLON.Texture("asset/sol.jpg", this.scene);
        groundMaterial.diffuseTexture.uScale = 5;
        groundMaterial.diffuseTexture.vScale = 5;
        this.ground.material = groundMaterial;

        // Créer un matériau pour les murs
        const wallMaterial = new BABYLON.StandardMaterial("wallMaterial", this.scene);
        wallMaterial.diffuseTexture = new BABYLON.Texture("asset/pierre.jpg", this.scene);
        wallMaterial.diffuseTexture.uScale = 2;
        wallMaterial.diffuseTexture.vScale = 2;

        // Créer les murs avec collisions
        const backWall = BABYLON.MeshBuilder.CreateBox("backWall", { width: roomSize, height: wallHeight, depth: wallThickness }, this.scene);
        backWall.position = new BABYLON.Vector3(0, wallHeight / 2, roomSize / 2);
        backWall.material = wallMaterial;
        backWall.checkCollisions = true; // Activer les collisions

        const collisionWall = BABYLON.MeshBuilder.CreateBox("collisionWall", { width: roomSize, height: wallHeight, depth: wallThickness }, this.scene);
        collisionWall.position = new BABYLON.Vector3(0, wallHeight / 2, roomSize / 2 - 1.5); // Position légèrement en avant du mur visible
        collisionWall.isVisible = false; // Rendre le mur invisible
        collisionWall.checkCollisions = true; // Activer les collisions

        const frontWall = BABYLON.MeshBuilder.CreateBox("frontWall", { width: roomSize, height: wallHeight, depth: wallThickness }, this.scene);
        frontWall.position = new BABYLON.Vector3(0, wallHeight / 2, -roomSize / 2);
        const transparentMaterial = new BABYLON.StandardMaterial("transparentMaterial", this.scene);
        transparentMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1); // Blanc
        transparentMaterial.alpha = 0.05; // Transparence (30%)
        frontWall.material = transparentMaterial;
        frontWall.checkCollisions = true; // Activer les collisions

        const leftWall = BABYLON.MeshBuilder.CreateBox("leftWall", { width: roomSize, height: wallHeight, depth: wallThickness }, this.scene);
        leftWall.rotation.y = Math.PI / 2;
        leftWall.position = new BABYLON.Vector3(-roomSize / 2, wallHeight / 2, 0);
        leftWall.material = wallMaterial;
        leftWall.checkCollisions = true; // Activer les collisions

        const rightWall = BABYLON.MeshBuilder.CreateBox("rightWall", { width: roomSize, height: wallHeight, depth: wallThickness }, this.scene);
        rightWall.rotation.y = Math.PI / 2;
        rightWall.position = new BABYLON.Vector3(roomSize / 2, wallHeight / 2, 0);
        rightWall.material = wallMaterial;
        rightWall.checkCollisions = true; // Activer les collisions

        // Supprimer les murs par défaut créés dans SceneBase
        ["backWall", "leftWall", "rightWall", "frontWall"].forEach(wallName => {
            const wall = this.scene.getMeshByName(wallName);
            if (wall) {
                wall.dispose(); // Supprimer les murs par défaut
            }
        });

        // Ajouter des éléments spécifiques à Scene1
        this.addCustomElements();
    }

    addCustomElements() {
        // Ajouter un personnage au centre de la pièce
        this.personnage = new Personnage(this.scene, new BABYLON.Vector3(0, 1, 0));

        // Ajouter un ennemi
        this.enemy = new Enemy(this.scene, this.personnage);
    }
}