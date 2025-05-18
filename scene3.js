import { SceneBase } from './scenebase.js';
import { Personnage } from './personnage.js';
import { Enemy } from './enemy.js';
 
 
export class Scene3 extends SceneBase {
    constructor(engine, canvas) {
        super(engine, canvas);
        this.sceneName = "Scene3";
        this.roomSize = 24;
        this.tombeCharges = false;
        this.herbeCharges = false;
        this.initScene();
    }
 
    async initScene() {
        super.initScene();
		this.scene.clearColor = new BABYLON.Color3(0.2, 0.2, 0.2); // Couleur de fond
        this.scene.collisionsEnabled = true;
        this.camera.checkCollisions = true;
        this.camera.applyGravity = true;
        this.ground.checkCollisions = true;
 
 
        this.light.intensity = 0.1;
        // Permet de gérer les bugs de collision
        const targetingPlane = BABYLON.MeshBuilder.CreatePlane("targetPlane", { size: 100 }, this.scene);
        targetingPlane.rotation.x = Math.PI / 2; // Horizontal (à plat)
        targetingPlane.position.y = 1; // À la hauteur du tir (tu peux ajuster)
        targetingPlane.isPickable = true;
        targetingPlane.visibility = 0; // Invisible
        targetingPlane.isVisible = false; // Masque dans le debug layer aussi
 
        this.customizeScene();
       
    }
 
    customizeScene() {
        const roomSize = this.roomSize;
        const wallHeight = 15;
        const wallThickness = 0.5;
 
        // 🧹 Supprimer anciens murs et sol
        const wallsToRemove = ["backWall", "frontWall", "leftWall", "rightWall", "collisionWall"];
        wallsToRemove.forEach(wallName => {
            const wall = this.scene.getMeshByName(wallName);
            if (wall) wall.dispose();
        });
 
        if (this.ground) this.ground.dispose();
 
        // Sol
        this.ground = BABYLON.MeshBuilder.CreateGround("ground", { width: roomSize, height: roomSize }, this.scene);
        const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", this.scene);
        groundMaterial.diffuseTexture = new BABYLON.Texture("asset/solCim.png", this.scene); // A CHANGER 
        groundMaterial.diffuseTexture.uScale = 5;
        groundMaterial.diffuseTexture.vScale = 5;

        
        this.ground.material = groundMaterial;
        this.ground.checkCollisions = true;
 
        // Murs
        const wallMaterial = new BABYLON.StandardMaterial("wallMaterial", this.scene);
        wallMaterial.diffuseTexture = new BABYLON.Texture("asset/murCim.png", this.scene);
        wallMaterial.diffuseTexture.uScale = 2;
        wallMaterial.diffuseTexture.vScale = 2;
 
        const createWall = (name, position, rotationY = 0, isTransparent = false) => {
            const wall = BABYLON.MeshBuilder.CreateBox(name, {
                width: roomSize,
                height: wallHeight,
                depth: wallThickness
            }, this.scene);
            wall.position = position;
            wall.rotation.y = rotationY;
            wall.checkCollisions = true;
 
            if (isTransparent) {
                const transparentMaterial = new BABYLON.StandardMaterial("transparentMaterial", this.scene);
                transparentMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1);
                transparentMaterial.alpha = 0.05;
                wall.material = transparentMaterial;
            } else {
                wall.material = wallMaterial;
            }
 
            return wall;
        };
 
        createWall("backWall", new BABYLON.Vector3(0, wallHeight / 2, roomSize / 2));
        createWall("collisionWall", new BABYLON.Vector3(0, wallHeight / 2, roomSize / 2 - 1.5)).isVisible = false;
        createWall("frontWall", new BABYLON.Vector3(0, wallHeight / 2, -roomSize / 2), 0, true);
        createWall("leftWall", new BABYLON.Vector3(-roomSize / 2, wallHeight / 2, 0), Math.PI / 2);
        createWall("rightWall", new BABYLON.Vector3(roomSize / 2, wallHeight / 2, 0), Math.PI / 2);


 
        this.addCustomElements();
    }
 
    addCustomElements() {
        const roomSize = this.roomSize;
        this.personnage = new Personnage(this.scene, new BABYLON.Vector3(0, 1, 0));

        // Ajouter des ennemis
        this.addEnemies();

        // Ajouter la lampe
        this.addLamp();

        // Ajouter d'autres éléments personnalisés ici
    }

    addEnemies() {
        // Liste des ennemis
        this.enemies = [];

        // Ajouter des ennemis
        const enemyPosition1 = new BABYLON.Vector3(5, 1, 5);
        const enemyPosition2 = new BABYLON.Vector3(-5, 1, 5);
        const enemyPosition3 = new BABYLON.Vector3(7, 1, 5);

        const enemy1 = new Enemy(this.scene, this.personnage, enemyPosition1, 1, 3);
        const enemy2 = new Enemy(this.scene, this.personnage, enemyPosition2, 1, 3);
        const boss = new Enemy(this.scene, this.personnage, enemyPosition3, 3, 3);

        // Ajouter les ennemis à la liste
        this.enemies.push(enemy1, enemy2, boss);

        // Vérifier régulièrement si tous les ennemis sont morts
        this.scene.onBeforeRenderObservable.add(() => {
            this.checkEnemiesStatus();
        });

        // 🌳 Tombes (chargement une seule fois)
        if (!this.tombeCharges) {
            this.tombeCharges = true;
            BABYLON.SceneLoader.ImportMesh("", "asset/", "tombe.glb", this.scene, (meshes) => {
                console.log(" Fichier GLB chargé, meshes :", meshes);
                const tombeMeshes = meshes.filter(m => m instanceof BABYLON.Mesh && m.geometry);
                console.log(" Meshes filtrés (avec géométrie) :", tombeMeshes);
                if (tombeMeshes.length === 0) return;

                const tombeRoot = new BABYLON.TransformNode("tombeRoot", this.scene);
                const positions = [
                    // Rangée de gauche (x = -4)
                    new BABYLON.Vector3(-4, 4, -10),
                    new BABYLON.Vector3(-8, 4, -6),
                    new BABYLON.Vector3(-4, 4, -2),

                    new BABYLON.Vector3(-8, 4, 2),
                    new BABYLON.Vector3(-4, 4, 6),
                    new BABYLON.Vector3(-8, 4, 10),

                    // Rangée de droite (x = 4)
                    new BABYLON.Vector3(4, 4, -10),
                    new BABYLON.Vector3(8, 4, -6),
                    new BABYLON.Vector3(4, 4, -2),
                    new BABYLON.Vector3(8, 4, 2),
                    new BABYLON.Vector3(4, 4, 6),
                    new BABYLON.Vector3(8, 4, 10),
                ];

                positions.forEach((pos, i) => {
                    console.log(` Création de la tombe ${i} à la position`, pos);
                    const tombeInstance = new BABYLON.TransformNode("tombeInstance" + i, this.scene);
                    tombeInstance.position = pos;
                    tombeInstance.scaling = new BABYLON.Vector3(1, 1, 1);
                    tombeInstance.parent = tombeRoot;

                    tombeMeshes.forEach((m, j) => {
                        const inst = m.createInstance(`tombe${i}_mesh${j}`);
                        inst.parent = tombeInstance;
                    });
                });

                tombeMeshes.forEach(m => m.setEnabled(false)); // Cache les originaux
            });

        }

        // 🌾 Herbes mortes
        if (!this.HerbesCharges) {
            this.HerbesCharges = true;

            BABYLON.SceneLoader.ImportMesh("", "asset/", "herbeM.glb", this.scene, (meshes) => {
                console.log(" Fichier GLB herbes chargé, meshes :", meshes);

                const herbeMeshes = meshes.filter(m => m instanceof BABYLON.Mesh && m.geometry);
                console.log(" Meshes filtrés (herbes avec géométrie) :", herbeMeshes);
                if (herbeMeshes.length === 0) return;

                const herbeRoot = new BABYLON.TransformNode("herbeRoot", this.scene);

                const positions = [
                    new BABYLON.Vector3(-7.5, 1, -8.5),
                    new BABYLON.Vector3(-2.5, 1, -5.3),
                    new BABYLON.Vector3(0.8, 1, -3.9),
                    new BABYLON.Vector3(6.6, 1, -1.1),
                    new BABYLON.Vector3(2.9, 1, 1.7),
                    new BABYLON.Vector3(-6.2, 1, 3.3),
                    new BABYLON.Vector3(1.5, 1, 6.9),
                    new BABYLON.Vector3(9, 1, -11),
                ];

                positions.forEach((pos, i) => {
                    console.log(` Création de l'herbe ${i} à la position`, pos);

                    const herbeInstance = new BABYLON.TransformNode("herbeInstance" + i, this.scene);
                    herbeInstance.position = pos;
                    herbeInstance.scaling = new BABYLON.Vector3(1, 1, 1);
                    herbeInstance.parent = herbeRoot;

                    herbeMeshes.forEach((mesh, j) => {
                        const inst = mesh.createInstance(`herbe${i}_mesh${j}`);
                        inst.parent = herbeInstance;
                    });
                });

        // Cache les originaux après duplication
        herbeMeshes.forEach(m => m.setEnabled(false));
    });
}




        // 💀 Chargement du crâne
        BABYLON.SceneLoader.ImportMesh("", "asset/", "crane.glb", this.scene, (meshes) => {
            console.log(" Crâne chargé :", meshes);
            const craneRoot = new BABYLON.TransformNode("craneRoot", this.scene);
            
            meshes.forEach((mesh, i) => {
                mesh.parent = craneRoot;
            });

            craneRoot.position = new BABYLON.Vector3(-4.75, 1, 5.5); // Position au centre, ajustable
            craneRoot.scaling = new BABYLON.Vector3(0.003, 0.003, 0.003);  // Ajuste si trop petit/grand
            craneRoot.rotation = new BABYLON.Vector3(0, Math.PI * -0.85, 0); // Rotation de 180° autour de Y

        });

        // Chargement du pot de fleurs
        BABYLON.SceneLoader.ImportMesh("", "asset/", "flower_pot.glb", this.scene, (meshes) => {
            console.log(" Pot de fleurs chargé :", meshes);
            const potRoot = new BABYLON.TransformNode("potRoot", this.scene);
            
            meshes.forEach((mesh, i) => {
                mesh.parent = potRoot;
            });

            potRoot.position = new BABYLON.Vector3(4.75, 1, -3.25); // Position au centre, ajustable
            potRoot.scaling = new BABYLON.Vector3(5, 5, 5);  // Ajuste si trop petit/grand

        });

        //Chargement arbre mort
        BABYLON.SceneLoader.ImportMesh("", "asset/", "arbreMort.glb", this.scene, (meshes) => {
            console.log(" Arbre mort chargé :", meshes);
            const arbreRoot = new BABYLON.TransformNode("arbreRoot", this.scene);
            
            meshes.forEach((mesh, i) => {
                mesh.parent = arbreRoot;
            });

            arbreRoot.position = new BABYLON.Vector3(-8, 1, -5); // Position au centre, ajustable
            arbreRoot.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);  // Ajuste si trop petit/grand

        });
    }

    addLamp() {
        // Charger le modèle de la lampe
        BABYLON.SceneLoader.ImportMesh("", "asset/", "lanterne.glb", this.scene, (meshes) => {
            const lantern = meshes[0];
            lantern.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);

            // Ajouter une lumière à la lampe
            const lanternLight = new BABYLON.PointLight("lanternLight", new BABYLON.Vector3(0, 0, 0), this.scene);
            lanternLight.intensity = 2;
            lanternLight.range = 10;
            lanternLight.diffuse = new BABYLON.Color3(1, 0.9, 0.7);

            // Appliquer un matériau émissif à la lampe
            const lanternMaterial = lantern.material || new BABYLON.StandardMaterial("lanternMaterial", this.scene);
            lanternMaterial.emissiveColor = new BABYLON.Color3(1, 1, 0.8);
            lantern.material = lanternMaterial;

            // Faire suivre la lampe au personnage
            this.scene.onBeforeRenderObservable.add(() => {
                if (this.personnage.mesh && lantern) {
                    lantern.position.copyFrom(this.personnage.mesh.position.add(new BABYLON.Vector3(0.5, 1, 0)));
                    lanternLight.position.copyFrom(lantern.position);
                }
            });

            console.log("Lampe ajoutée à la scène 3.");
        });
    }

    checkEnemiesStatus() {
        // Vérifier si tous les ennemis sont morts
        const allEnemiesDead = this.enemies.every(enemy => enemy.health <= 0);

        if (allEnemiesDead) {
            this.showEndCredits(); // Afficher l'écran de fin avec crédits
        }
    }

    showEndCredits() {
        // Empêcher plusieurs affichages
        if (this.endScreenDisplayed) return;
        this.endScreenDisplayed = true;

        // Créer une interface utilisateur pour afficher l'image et le texte
        const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

        // Afficher l'image de fin
        const endImage = new BABYLON.GUI.Image("endImage", "asset/fin.png");
        endImage.width = "100%";
        endImage.height = "100%";
        advancedTexture.addControl(endImage);

        // Créer un bloc de texte pour les crédits
        const creditsText = new BABYLON.GUI.TextBlock();
        creditsText.text = "Vous avez sauvé le monde des rêves !\n\n\n\nMerci d'avoir joué à notre jeu !\n\n\nDéveloppeurs :\n\n Lucie DEGUISNE et Mathis PILON \nL3 MIAGE Université de TOULOUSE \n\n\n\nÀ bientôt pour de nouvelles aventures !";
        creditsText.color = "white";
        creditsText.fontSize = 35;
        creditsText.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        creditsText.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        creditsText.top = "100%"; // Commence en bas de l'écran
        advancedTexture.addControl(creditsText);

        // Faire défiler le texte
        const scrollSpeed = 1; // Vitesse de défilement (pixels par frame)
        const interval = setInterval(() => {
            const currentTop = parseFloat(creditsText.top);
            creditsText.top = `${currentTop - scrollSpeed}px`; // Déplacer le texte vers le haut

            // Arrêter le défilement lorsque le texte a complètement disparu
            if (currentTop <= -advancedTexture.getSize().height) {
                clearInterval(interval);
                console.log("Défilement des crédits terminé.");
            }
        }, 30); // Mettre à jour toutes les 30 ms

        console.log("Tous les ennemis sont morts. Affichage de l'écran de fin avec crédits.");
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