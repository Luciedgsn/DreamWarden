// Initialisation de la scène
const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

const createScene = () => {
    const scene = new BABYLON.Scene(engine);

    // Lumière globale très faible pour assombrir la scène
    const ambientLight = new BABYLON.HemisphericLight("ambientLight", new BABYLON.Vector3(0, 1, 0), scene);
    ambientLight.intensity = 0.05;

    let player;
    BABYLON.SceneLoader.ImportMesh(
        null,
        "models/",
        "mec.gltf",
        scene,
        (meshes) => {
            if (meshes.length > 0) { // Vérification si des meshes sont chargés
                player = meshes[0];
                player.scaling = new BABYLON.Vector3(2, 2, 2);
                player.position = new BABYLON.Vector3(0, 1.5, 0);
                player.checkCollisions = true;

                const playerMaterial = new BABYLON.StandardMaterial("playerMaterial", scene);
                playerMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1);
                player.material = playerMaterial;
            } else {
                console.error("Aucun mesh n'a été chargé pour le joueur.");
            }
        },
        null,
        (error) => console.error("Erreur lors du chargement du modèle:", error)
    );

    // Ajout d'une lumière ponctuelle pour simuler la lanterne
    const lanternLight = new BABYLON.PointLight("lanternLight", new BABYLON.Vector3(0, 1.5, 0), scene);
    lanternLight.intensity = 1; // Luminosité de la "lanterne"
    lanternLight.range = 10; // Distance maximale d'éclairage
    lanternLight.diffuse = new BABYLON.Color3(1, 0.85, 0.6); // Couleur chaleureuse

    // Associez la lumière à la position du joueur
    scene.onBeforeRenderObservable.add(() => {
        if (player) {
            lanternLight.position = player.position.clone().add(new BABYLON.Vector3(0, 1.5, 0));
        }
    });

    // Ajout d'un effet volumétrique pour une lueur douce
    const glowLayer = new BABYLON.GlowLayer("glow", scene);
    glowLayer.intensity = 0.2; // Ajustez l'intensité pour l'effet souhaité

    // Ennemi
    const enemy = BABYLON.MeshBuilder.CreateBox("enemy", { size: 3 }, scene);
    enemy.position.set(5, 1.5, 0);
    const enemyMaterial = new BABYLON.StandardMaterial("enemyMaterial", scene);
    enemyMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0); 
    enemy.material = enemyMaterial;

    // Sol
    let ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 60, height: 60 }, scene);  // Taille ajustée pour la grande pièce
    const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
    groundMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5); 
    ground.material = groundMaterial;
    ground.checkCollisions = true;

    // Hauteur des murs
    const wallHeight = 10;  // Hauteur des murs
    const wallThickness = 1;
    const taillePiece = 60;  // Taille de la pièce

    // Création du matériau gris pour les murs
    const wallMaterial = new BABYLON.StandardMaterial("wallMaterial", scene);
    wallMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);  // Gris pour les murs

    // Mur avant
    const wallFront = BABYLON.MeshBuilder.CreateBox("wallFront", { width: taillePiece, height: wallHeight, depth: wallThickness }, scene);
    wallFront.position = new BABYLON.Vector3(0, wallHeight / 2, taillePiece / 2); // Positionner à l'avant
    wallFront.material = wallMaterial;
    wallFront.checkCollisions = true;

    // Mur arrière
    const wallBack = BABYLON.MeshBuilder.CreateBox("wallBack", { width: taillePiece, height: wallHeight, depth: wallThickness }, scene);  
    wallBack.position = new BABYLON.Vector3(0, wallHeight / 2, -taillePiece / 2); // Positionner à l'arrière
    wallBack.material = wallMaterial;
    wallBack.checkCollisions = true;

    // Mur gauche
    const wallLeft = BABYLON.MeshBuilder.CreateBox("wallLeft", { width: wallThickness, height: wallHeight, depth: taillePiece }, scene);
    wallLeft.position = new BABYLON.Vector3(-taillePiece / 2, wallHeight / 2, 0); // Positionner à gauche
    wallLeft.material = wallMaterial;
    wallLeft.checkCollisions = true;

    // Mur droit
    const wallRight = BABYLON.MeshBuilder.CreateBox("wallRight", { width: wallThickness, height: wallHeight, depth: taillePiece }, scene);
    wallRight.position = new BABYLON.Vector3(taillePiece / 2, wallHeight / 2, 0); // Positionner à droite
    wallRight.material = wallMaterial;
    wallRight.checkCollisions = true;

    // Cube au fond de la salle pour déclencher la destruction
    const targetCube = BABYLON.MeshBuilder.CreateBox("targetCube", { size: 5 }, scene);
    targetCube.position.set(-15, 1.5, 20);  // Position au fond de la salle
    const targetMaterial = new BABYLON.StandardMaterial("targetMaterial", scene);
    targetMaterial.diffuseColor = new BABYLON.Color3(0, 0, 1); // Cube bleu pour être visible
    targetCube.material = targetMaterial;

    // Caméra
    const camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 10, -30), scene);  // Ajuster la position de la caméra
    camera.rotation.x = Math.atan(10 / 30);
    camera.attachControl(canvas, true); // Correction pour permettre le contrôle de la caméra

    // Interface utilisateur
    const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    const clickText = new BABYLON.GUI.TextBlock();
    clickText.text = "Clics restants : 3";
    clickText.color = "white";
    clickText.fontSize = 24;
    clickText.top = "-40px";
    clickText.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    clickText.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    advancedTexture.addControl(clickText);

    let clickCount = 0;

    // Variables pour le déplacement
    const speed = 0.1;
    const jumpSpeed = 0.2;
    const jumpHeightMax = 2;
    let isJumping = false;
    let jumpHeight = 0;
    const keyboardMap = {};

    const thresholdX = 4;

    // Fonction de gestion des clics sur l'ennemi
    const checkClickOnEnemy = (event) => {
        const pickResult = scene.pick(scene.pointerX, scene.pointerY);
        if (pickResult && pickResult.pickedMesh === enemy) {
            clickCount++;
            console.log(`Clic détecté sur l'ennemi. Compteur: ${clickCount}`);

            const originalColor = enemy.material.diffuseColor.clone();
            enemy.material.diffuseColor = new BABYLON.Color3(1, 1, 0); // Jaune temporaire
            setTimeout(() => {
                enemy.material.diffuseColor = originalColor;
            }, 200); 

            const remainingClicks = 3 - clickCount;
            if (remainingClicks > 0) {
                clickText.text = `Clics restants : ${remainingClicks}`;
            }

            if (clickCount >= 3) {
                console.log("L'ennemi est tué !");
                clickText.text = "L'ennemi est éliminé !";

                // Effet d'augmentation de la luminosité
                BABYLON.Animation.CreateAndStartAnimation(
                    "lightIntensityIncrease",
                    ambientLight,
                    "intensity",
                    30, // FPS
                    60, // Nombre de frames
                    ambientLight.intensity,
                    1.0, // Intensité finale
                    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
                );

                const particleSystem = new BABYLON.ParticleSystem("particles", 1000, scene);
                particleSystem.particleTexture = new BABYLON.Texture("https://www.babylonjs-playground.com/textures/flare.png", scene);
                particleSystem.emitter = enemy.position.clone(); 
                particleSystem.minEmitBox = new BABYLON.Vector3(-0.5, -0.5, -0.5);
                particleSystem.maxEmitBox = new BABYLON.Vector3(0.5, 0.5, 0.5);
                particleSystem.color1 = new BABYLON.Color4(1, 0, 0, 1); 
                particleSystem.color2 = new BABYLON.Color4(1, 1, 0, 1); 
                particleSystem.minSize = 0.1;
                particleSystem.maxSize = 0.3;
                particleSystem.minLifeTime = 0.2;
                particleSystem.maxLifeTime = 0.5;
                particleSystem.emitRate = 1000;
                particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
                particleSystem.direction1 = new BABYLON.Vector3(-1, 1, -1);
                particleSystem.direction2 = new BABYLON.Vector3(1, 1, 1);
                particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);
                particleSystem.start();

                BABYLON.Animation.CreateAndStartAnimation(
                    "scaleDown",
                    enemy,
                    "scaling",
                    30,
                    10,
                    enemy.scaling,
                    new BABYLON.Vector3(0, 0, 0),
                    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
                    null,
                    () => {
                        particleSystem.stop();
                        enemy.dispose();
                    }
                );
            }
        }
    };

    // Fonction pour détruire la salle 1 et créer la nouvelle salle rose
    const destroyRoomAndCreatePink = () => {
        // Détruire tous les murs
        wallFront.dispose();
        wallBack.dispose();
        wallLeft.dispose();
        wallRight.dispose();

        // Détruire le sol
        ground.dispose();
        targetCube.dispose();

        // Créer la nouvelle salle rose
        createPinkRoom();

        // Log pour vérifier la destruction et la création
        console.log("Salle 1 détruite et salle rose créée !");
    };

    // Fonction pour créer une salle rose
    const createPinkRoom = () => {
        // Nouveau sol rose
        ground = BABYLON.MeshBuilder.CreateGround("groundPink", { width: 60, height: 60 }, scene); 
        const pinkGroundMaterial = new BABYLON.StandardMaterial("pinkGroundMaterial", scene);
        pinkGroundMaterial.diffuseColor = new BABYLON.Color3(1, 0.75, 1);  // Rose
        ground.material = pinkGroundMaterial;
        ground.checkCollisions = true;

        // Murs roses
        const pinkWallMaterial = new BABYLON.StandardMaterial("pinkWallMaterial", scene);
        pinkWallMaterial.diffuseColor = new BABYLON.Color3(1, 0.75, 1);  // Rose

        const pinkWallFront = BABYLON.MeshBuilder.CreateBox("pinkWallFront", { width: taillePiece, height: wallHeight, depth: wallThickness }, scene);
        pinkWallFront.position = new BABYLON.Vector3(0, wallHeight / 2, taillePiece / 2); 
        pinkWallFront.material = pinkWallMaterial;
        pinkWallFront.checkCollisions = true;

        const pinkWallBack = BABYLON.MeshBuilder.CreateBox("pinkWallBack", { width: taillePiece, height: wallHeight, depth: wallThickness }, scene);  
        pinkWallBack.position = new BABYLON.Vector3(0, wallHeight / 2, -taillePiece / 2); 
        pinkWallBack.material = pinkWallMaterial;
        pinkWallBack.checkCollisions = true;

        const pinkWallLeft = BABYLON.MeshBuilder.CreateBox("pinkWallLeft", { width: wallThickness, height: wallHeight, depth: taillePiece }, scene);
        pinkWallLeft.position = new BABYLON.Vector3(-taillePiece / 2, wallHeight / 2, 0); 
        pinkWallLeft.material = pinkWallMaterial;
        pinkWallLeft.checkCollisions = true;

        const pinkWallRight = BABYLON.MeshBuilder.CreateBox("pinkWallRight", { width: wallThickness, height: wallHeight, depth: taillePiece }, scene);
        pinkWallRight.position = new BABYLON.Vector3(taillePiece / 2, wallHeight / 2, 0); 
        pinkWallRight.material = pinkWallMaterial;
        pinkWallRight.checkCollisions = true;

        console.log("Salle rose créée !");
    };

    // Écouteur d'événements pour les clics
    canvas.addEventListener("click", (event) => {
        const pickResult = scene.pick(scene.pointerX, scene.pointerY);
        if (pickResult && pickResult.pickedMesh === targetCube) {
            destroyRoomAndCreatePink();
        } else if (pickResult && pickResult.pickedMesh === enemy) {
            checkClickOnEnemy(event);
        }
    });

    scene.onBeforeRenderObservable.add(() => {
        if (!player) return; // S'assurer que le joueur est chargé

        const moveVector = new BABYLON.Vector3(0, 0, 0);

        if (keyboardMap["ArrowUp"] || keyboardMap["w"]) moveVector.z = 1;
        if (keyboardMap["ArrowDown"] || keyboardMap["s"]) moveVector.z = -1;
        if (keyboardMap["ArrowLeft"] || keyboardMap["a"]) moveVector.x = -1;
        if (keyboardMap["ArrowRight"] || keyboardMap["d"]) moveVector.x = 1;

        player.position.addInPlace(moveVector.scale(speed));

        if (isJumping) {
            player.position.y += jumpSpeed;
            jumpHeight += jumpSpeed;

            if (jumpHeight >= jumpHeightMax) {
                isJumping = false;
            }
        }
    });

    return scene;
};

const scene = createScene();
engine.runRenderLoop(() => scene.render());
window.addEventListener("resize", () => engine.resize());