/*window.createScene = () => {
    const scene = new BABYLON.Scene(engine);

    // Associez la lumière à la position du joueur
    scene.onBeforeRenderObservable.add(() => {
        if (player) {
            lanternLight.position = player.position.clone().add(new BABYLON.Vector3(0, 1.5, 0));
        }
    });

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

    return scene;
};
salleRose : 
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
    };*/