// Initialisation de la scène Babylon.js
const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

const createScene = () => {
    const scene = new BABYLON.Scene(engine);

    // Création d'une caméra fixe avec mouvements limités
    const camera = new BABYLON.FreeCamera("FixedCamera", new BABYLON.Vector3(0, 13, -16), scene);//permet de changer angle de la cam
    camera.setTarget(new BABYLON.Vector3(0, 2.5, 0)); // Focalisation sur le mur du fond
    camera.attachControl(canvas, false); // Désactivation du contrôle de la souris

    // Ajout d'une lumière
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);
    light.intensity = 0.7;

    // Matériau pour les murs
    const wallMaterial = new BABYLON.StandardMaterial("wallMat", scene);
    wallMaterial.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/brickwall.jpg", scene);
    wallMaterial.specularColor = new BABYLON.Color3(0, 0, 0); // Éviter les reflets brillants

    // Fonction pour créer un mur
    const createWall = (name, width, height, position, rotation) => {
        const wall = BABYLON.MeshBuilder.CreatePlane(name, { width, height }, scene);
        wall.position = position;
        wall.rotation = rotation;
        wall.material = wallMaterial;
        return wall;
    };

    // Création du sol
    const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 20, height: 20 }, scene);
    const groundMaterial = new BABYLON.StandardMaterial("groundMat", scene);
    groundMaterial.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/grass.jpg", scene);
    ground.material = groundMaterial;

    // Création des murs visibles
    createWall("backWall", 20, 20, new BABYLON.Vector3(0, 5, 10), new BABYLON.Vector3(0, 0, 0));
    createWall("leftWall", 20, 20, new BABYLON.Vector3(-10, 5, 0), new BABYLON.Vector3(0, -Math.PI / 2, 0));
    createWall("rightWall", 20, 20, new BABYLON.Vector3(10, 5, 0), new BABYLON.Vector3(0, Math.PI / 2, 0));


    // Ajout des contrôles pour déplacer la caméra en X et Y
    scene.onBeforeRenderObservable.add(() => {
        const speed = 0.1;
        if (scene.inputStates.left) camera.position.x -= speed;
        if (scene.inputStates.right) camera.position.x += speed;
        if (scene.inputStates.up) camera.position.y += speed;
        if (scene.inputStates.down) camera.position.y -= speed;
    });

    // Gestion des touches du clavier
    scene.inputStates = {};
    window.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") scene.inputStates.left = true;
        if (event.key === "ArrowRight") scene.inputStates.right = true;
        if (event.key === "ArrowUp") scene.inputStates.up = true;
        if (event.key === "ArrowDown") scene.inputStates.down = true;
    });

    window.addEventListener("keyup", (event) => {
        if (event.key === "ArrowLeft") scene.inputStates.left = false;
        if (event.key === "ArrowRight") scene.inputStates.right = false;
        if (event.key === "ArrowUp") scene.inputStates.up = false;
        if (event.key === "ArrowDown") scene.inputStates.down = false;
    });

    return scene;
};

// Création de la scène
const scene = createScene();

// Lancement de la boucle de rendu
engine.runRenderLoop(() => {
    scene.render();
});

// Ajustement de la scène lors du redimensionnement
window.addEventListener("resize", () => {
    engine.resize();
});
