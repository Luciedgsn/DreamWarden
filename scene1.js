// scene1.js

import { SceneBase } from './scenebase.js';
import { Personnage } from './personnage.js';
import { Enemy } from './enemy.js';

export class Scene1 extends SceneBase {
    constructor(engine, canvas) {
        super(engine, canvas);
        this.sceneName = "Scene1";
        this.roomSize = 12;
        this.initScene();
    }

    async initScene() {
        super.initScene();
        this.scene.collisionsEnabled = true;
        this.camera.checkCollisions = true;
        this.camera.applyGravity = true;
        this.ground.checkCollisions = true;

        this.scene.clearColor = new BABYLON.Color3(0, 0, 0);
        this.light.intensity = 0.1;

        this.customizeScene();
    }

    customizeScene() {
        const roomSize = this.roomSize;
        const wallHeight = 15;
        const wallThickness = 0.5;
    
        // 🧹 Étape 1 : SUPPRIMER les anciens murs et le sol
        const wallsToRemove = ["backWall", "frontWall", "leftWall", "rightWall", "collisionWall"];
        wallsToRemove.forEach(wallName => {
            const wall = this.scene.getMeshByName(wallName);
            if (wall) wall.dispose();
        });
    
        if (this.ground) this.ground.dispose();
    
        this.ground = BABYLON.MeshBuilder.CreateGround("ground", { width: roomSize, height: roomSize }, this.scene);
        const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", this.scene);
        groundMaterial.diffuseTexture = new BABYLON.Texture("asset/sol.jpg", this.scene);
        groundMaterial.diffuseTexture.uScale = 5;
        groundMaterial.diffuseTexture.vScale = 5;
        this.ground.material = groundMaterial;
        this.ground.checkCollisions = true;
    
      
        const wallMaterial = new BABYLON.StandardMaterial("wallMaterial", this.scene);
        wallMaterial.diffuseTexture = new BABYLON.Texture("asset/pierre.jpg", this.scene);
        wallMaterial.diffuseTexture.uScale = 2;
        wallMaterial.diffuseTexture.vScale = 2;
    
  
        const backWall = BABYLON.MeshBuilder.CreateBox("backWall", { width: roomSize, height: wallHeight, depth: wallThickness }, this.scene);
        backWall.position = new BABYLON.Vector3(0, wallHeight / 2, roomSize / 2);
        backWall.material = wallMaterial;
        backWall.checkCollisions = true;
    
        const collisionWall = BABYLON.MeshBuilder.CreateBox("collisionWall", { width: roomSize, height: wallHeight, depth: wallThickness }, this.scene);
        collisionWall.position = new BABYLON.Vector3(0, wallHeight / 2, roomSize / 2 - 1.5);
        collisionWall.isVisible = false;
        collisionWall.checkCollisions = true;
    
    
        const frontWall = BABYLON.MeshBuilder.CreateBox("frontWall", { width: roomSize, height: wallHeight, depth: wallThickness }, this.scene);
        frontWall.position = new BABYLON.Vector3(0, wallHeight / 2, -roomSize / 2);
        const transparentMaterial = new BABYLON.StandardMaterial("transparentMaterial", this.scene);
        transparentMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1);
        transparentMaterial.alpha = 0.05;
        frontWall.material = transparentMaterial;
        frontWall.checkCollisions = true;
    

        const leftWall = BABYLON.MeshBuilder.CreateBox("leftWall", { width: roomSize, height: wallHeight, depth: wallThickness }, this.scene);
        leftWall.rotation.y = Math.PI / 2;
        leftWall.position = new BABYLON.Vector3(-roomSize / 2, wallHeight / 2, 0);
        leftWall.material = wallMaterial;
        leftWall.checkCollisions = true;
    
 
        const rightWall = BABYLON.MeshBuilder.CreateBox("rightWall", { width: roomSize, height: wallHeight, depth: wallThickness }, this.scene);
        rightWall.rotation.y = Math.PI / 2;
        rightWall.position = new BABYLON.Vector3(roomSize / 2, wallHeight / 2, 0);
        rightWall.material = wallMaterial;
        rightWall.checkCollisions = true;
    
        
        this.addCustomElements();
    }
    
    
    addCustomElements() {
        const roomSize = this.roomSize;
        this.personnage = new Personnage(this.scene, new BABYLON.Vector3(0, 1, 0));
    
        BABYLON.SceneLoader.ImportMesh("", "asset/", "livres.glb", this.scene, (meshes) => {
            const livres = meshes[0];
            livres.position = new BABYLON.Vector3(0,0,0);
            livres.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1);
        });

     
    
        // Variables pour lanterne
        let isLanternEquipped = false;
    
        BABYLON.SceneLoader.ImportMesh("", "asset/", "lanterneCage.glb", this.scene, (meshes) => {
            const lantern = meshes[0];
            lantern.position = new BABYLON.Vector3(-roomSize / 2 + 1, 0.5, roomSize / 2 - 1);
            lantern.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);
    
            const lanternLight = new BABYLON.PointLight("lanternLight", new BABYLON.Vector3(0, 0, 0), this.scene);
            lanternLight.parent = lantern;
            lanternLight.intensity = 2;
            lanternLight.range = 10;
            lanternLight.diffuse = new BABYLON.Color3(1, 0.9, 0.7);
    
            const lanternMaterial = lantern.material || new BABYLON.StandardMaterial("lanternMaterial", this.scene);
            lanternMaterial.emissiveColor = new BABYLON.Color3(1, 1, 0.8);
            lantern.material = lanternMaterial;
    
            this.scene.onBeforeRenderObservable.add(() => {
                if (isLanternEquipped) return;
                const distance = BABYLON.Vector3.Distance(this.personnage.mesh.position, lantern.position);
                if (distance < 3) {
                    this.showLanternMessage("Appuyez sur F pour prendre la lanterne");
                }
            });
    
            window.addEventListener("keydown", (event) => {
                if (event.key.toLowerCase() === "f") {
                    const distance = BABYLON.Vector3.Distance(this.personnage.mesh.position, lantern.position);
                    if (distance < 3 && !isLanternEquipped) {
                        this.equipLantern(lantern, lanternLight);
                        isLanternEquipped = true;
                    }
                }
            });

            BABYLON.SceneLoader.ImportMesh("", "asset/", "lit.glb", this.scene, (meshes) => {
                const lit = meshes[0];
                lit.name = "lit";
                lit.scaling = new BABYLON.Vector3(2, 2, 2);
                lit.position = new BABYLON.Vector3(-4, 0, -4.5);
                lit.position.y = 2.2;
                lit.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);
                lit.rotation.y = Math.PI / 2;
                lit.checkCollisions = true;
            
                // Pyjama (invisible au début)
                BABYLON.SceneLoader.ImportMesh("", "asset/", "pyjama.glb", this.scene, (meshes) => {
                    const pyjama = meshes[0];
                    pyjama.name = "pyjama";
                    pyjama.scaling = new BABYLON.Vector3(0.3, 0.3, 0.3);
                    pyjama.position = new BABYLON.Vector3(lit.position.x, 2, lit.position.z);
                    pyjama.setEnabled(false);
            
                    let litFouille = false;
                    let pyjamaRamasse = false;
            
                    this.scene.onBeforeRenderObservable.add(() => {
                        const distanceToLit = BABYLON.Vector3.Distance(this.personnage.mesh.position, lit.position);
            
                        if (!litFouille && distanceToLit < 3) {
                            this.showLanternMessage("Fouiller le lit avec F");
                        }
            
                        if (!litFouille) {
                            window.addEventListener("keydown", (event) => {
                                if ((event.key === "f" || event.key === "F") && distanceToLit < 3 && !litFouille) {
                                    pyjama.setEnabled(true);
                                    litFouille = true;
                                    this.showLanternMessage("Un pyjama est apparu !");
                                }
                            });
                        }
            
                        // Ramasser le pyjama
                        if (litFouille && !pyjamaRamasse) {
                            const distanceToPyjama = BABYLON.Vector3.Distance(this.personnage.mesh.position, pyjama.position);
            
                            if (distanceToPyjama < 2) {
                                this.showLanternMessage("Ramasser le pyjama avec F");
            
                                window.addEventListener("keydown", (event) => {
                                    if ((event.key === "f" || event.key === "F") && distanceToPyjama < 2 && !pyjamaRamasse) {
                                        pyjama.setEnabled(false);
                                        pyjamaRamasse = true;
                                        this.showLanternMessage("Vous avez ramassé le pyjama !");
                                    }
                                });
                            }
                        }
                    });
                });
            });
        });



        let doudou;
        let doudouRamasse = false;              
        BABYLON.SceneLoader.ImportMesh("", "asset/", "doudou.glb", this.scene, (meshes) => {
            doudou = meshes[0];
            doudou.name = "doudou";
            doudou.scaling = new BABYLON.Vector3(0.3, 0.3, 0.3);
            doudou.position = new BABYLON.Vector3(3, 0.5, -3); // Place-le où tu veux dans la pièce
            doudou.checkCollisions = true;
            doudou.isVisible = true;
        
            this.scene.onBeforeRenderObservable.add(() => {
                if (doudouRamasse) return;
                const distDoudou = BABYLON.Vector3.Distance(this.personnage.mesh.position, doudou.position);
                if (distDoudou < 3) {
                    this.showLanternMessage("Ramasser le doudou avec F");
                }
            });
        
            window.addEventListener("keydown", (event) => {
                if ((event.key.toLowerCase() === "f") && !doudouRamasse) {
                    const distDoudou = BABYLON.Vector3.Distance(this.personnage.mesh.position, doudou.position);
                    if (distDoudou < 3) {
                        doudou.setEnabled(false);
                        doudouRamasse = true;
                        this.showLanternMessage("Vous avez ramassé le doudou !");
                    }
                }
            });
        });


        // Variables pour gérer armoire et train
        let armoire, train;
        let trainVisible = false;
        let armoireDeplacee = false;
        let trainRamasse = false;
    
        BABYLON.SceneLoader.ImportMesh("", "asset/", "armoire.glb", this.scene, (meshes) => {
            armoire = meshes[0];
          
            armoire.position = new BABYLON.Vector3(2, 0, 4.5);
            armoire.position.y = 2;
            armoire.rotation.y = Math.PI;
           
            armoire.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);


            armoire.scaling = new BABYLON.Vector3(2, 2, 2);
            armoire.checkCollisions = true;
    
            BABYLON.SceneLoader.ImportMesh("", "asset/", "train.glb", this.scene, (trainMeshes) => {
                train = trainMeshes[0];
                train.position = new BABYLON.Vector3(armoire.position.x+0.5, 0, armoire.position.z);
                train.scaling = new BABYLON.Vector3(0.2, 0.2, 0.2);
                train.position.y = 0.2;
                train.isVisible = false;
                train.checkCollisions = true;
            });
        });
    
        // Message UI générique pour interaction
        const showMessage = (msg) => {
            if (this.messageDisplayed) return;
            this.messageDisplayed = true;
            const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
            const textBlock = new BABYLON.GUI.TextBlock();
            textBlock.text = msg;
            textBlock.color = "white";
            textBlock.fontSize = 24;
            textBlock.background = "black";
            textBlock.width = "300px";
            textBlock.height = "50px";
            textBlock.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
            textBlock.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
            textBlock.top = "-100px";
            advancedTexture.addControl(textBlock);
            setTimeout(() => {
                advancedTexture.removeControl(textBlock);
                this.messageDisplayed = false;
            }, 3000);
        };
    
        // Détection de proximité et interaction clavier
        this.scene.onBeforeRenderObservable.add(() => {
            if (!armoire) return;
            const distArmoire = BABYLON.Vector3.Distance(this.personnage.mesh.position, armoire.position);
    
            if (distArmoire < 3 && !armoireDeplacee) {
                showMessage("Déplacer l'armoire avec F");
            } else if (distArmoire < 3 && armoireDeplacee && trainVisible && !trainRamasse) {
                const distTrain = BABYLON.Vector3.Distance(this.personnage.mesh.position, train.position);
                if (distTrain < 3) {
                    showMessage("Ramasser le train avec F");
                }
            }
        });
    
        window.addEventListener("keydown", (event) => {
            if (event.key.toLowerCase() === "f") {
                if (!armoire) return;
                const distArmoire = BABYLON.Vector3.Distance(this.personnage.mesh.position, armoire.position);
    
                if (distArmoire < 3 && !armoireDeplacee) {
                    armoire.position.x -= 2;
                    armoireDeplacee = true;
                    trainVisible = true;
                    if (train) train.isVisible = true;
                } else if (armoireDeplacee && trainVisible && !trainRamasse) {
                    const distTrain = BABYLON.Vector3.Distance(this.personnage.mesh.position, train.position);
                    if (distTrain < 3) {
                        train.setEnabled(false);
                        trainRamasse = true;
                        showMessage("Train ramassé !");
                        
                    }
                }
            }
        });
    }
    

    equipLantern(lantern, lanternLight) {
        // Attacher la lanterne au personnage
        lantern.parent = this.personnage.mesh;
        lantern.position = new BABYLON.Vector3(0.5, 1, 0); // Position relative au personnage
        lantern.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5); // Ajuster l'échelle si nécessaire

        // Attacher la lumière de la lanterne au personnage
        lanternLight.parent = lantern;

        // Afficher un message pour indiquer que la lanterne est équipée
        this.showLanternMessage("Vous avez équipé la lanterne !");
    }

    showLanternMessage(message) {
        if (this.messageDisplayed) return;
        this.messageDisplayed = true;

        const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        const textBlock = new BABYLON.GUI.TextBlock();
        textBlock.text = message;
        textBlock.color = "white";
        textBlock.fontSize = 24;
        textBlock.background = "black";
        textBlock.width = "300px";
        textBlock.height = "50px";
        textBlock.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        textBlock.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        textBlock.top = "-100px";
        advancedTexture.addControl(textBlock);

        setTimeout(() => {
            advancedTexture.removeControl(textBlock);
            this.messageDisplayed = false;
        }, 3000);
    }
}

