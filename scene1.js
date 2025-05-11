// scene1.js

import { SceneBase } from './scenebase.js';
import { Personnage } from './personnage.js';
import { Scene2 } from './scene2.js';
import { Enemy } from './enemy.js'; // Importer la classe Enemy

export class Scene1 extends SceneBase {
    constructor(engine, canvas) {
        super(engine, canvas);
        this.sceneName = "Scene1"; // Nom de la scène
        this.scene.sceneName = "Scene1";
        this.initScene();
    }

    async initScene() {
        super.initScene();

        // Restaurer la lumière naturelle
        this.scene.clearColor = new BABYLON.Color3(0.8, 0.8, 0.8); // Fond gris clair
        this.light.intensity = 0.7; // Réactiver la lumière hémisphérique

        // Agrandir le sol avec le bon motif 
        this.ground.dispose(); // Supprimer l'ancien sol
        this.ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 100, height: 100 }, this.scene); // Nouveau sol beaucoup plus grand

        // Créer un matériau terreux pour le sol
        const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", this.scene);
        groundMaterial.diffuseTexture = new BABYLON.Texture("asset/sol.jpg", this.scene);
        groundMaterial.diffuseTexture.uScale = 10; // Répéter la texture sur l'axe U
        groundMaterial.diffuseTexture.vScale = 10; // Répéter la texture sur l'axe V
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


       

        // Créer un ennemi
        this.enemy = new Enemy(this.scene, this.personnage);
    }    
    
}