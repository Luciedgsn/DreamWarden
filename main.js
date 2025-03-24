window.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("renderCanvas");
    const engine = new BABYLON.Engine(canvas, true);

    const createScene = function () {
        const scene = new BABYLON.Scene(engine);

        // Ajout de la caméra
        const camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 2, Math.PI / 3, 10, BABYLON.Vector3.Zero(), scene);
        camera.attachControl(canvas, true);

        // Ajout de la lumière principale
        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
        light.intensity = 1;

        // Ajout d'une lumière directionnelle
        const dirLight = new BABYLON.DirectionalLight("dirLight", new BABYLON.Vector3(-1, -2, -1), scene);
        dirLight.intensity = 1;

        // Création du sol
        const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 10, height: 10 }, scene);
        const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
        groundMaterial.diffuseColor = new BABYLON.Color3(0.4, 0.8, 0.4);
        ground.material = groundMaterial;

        let model;
        let animationGroupRunning;

        const keysPressed = {}; // Pour gérer plusieurs touches en même temps
        const speed = 0.1;

        // Chargement du modèle
        BABYLON.SceneLoader.ImportMesh("", "asset/", "AnimPerso.glb", scene, function (meshes, particleSystems, skeletons, animationGroups) {
            model = meshes[0];

            // Vérifications
            console.log("Modèle chargé :", model);
            console.log("Animations disponibles :", animationGroups);

            // Ajustements pour s'assurer qu'il est bien visible
            model.position = new BABYLON.Vector3(0, 1, 0); // Position de départ
            model.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5); // Échelle normale
            model.visibility = 1; // Vérifie qu'il n'est pas invisible

            // Vérifier et initialiser la rotation en quaternion
            if (!model.rotationQuaternion) {
                model.rotationQuaternion = BABYLON.Quaternion.Identity();
            }

            // Chargement de l'animation de course si elle existe
            if (animationGroups.length > 5) {
                animationGroupRunning = animationGroups[5];
                animationGroupRunning.stop();
            }
        }, function (scene, message, exception) {
            console.error("Erreur lors du chargement du modèle :", message, exception);
        });

        // Gestion des touches enfoncées
        window.addEventListener("keydown", function (event) {
            keysPressed[event.key.toLowerCase()] = true;
        });

        window.addEventListener("keyup", function (event) {
            delete keysPressed[event.key.toLowerCase()];
            if (animationGroupRunning) {
                animationGroupRunning.stop();
            }
        });

        // Mise à jour du mouvement et de la caméra
        scene.onBeforeRenderObservable.add(() => {
            if (!model) return;

            let moveDirection = BABYLON.Vector3.Zero();
            let currentDirection = null;

            if (keysPressed["arrowup"] || keysPressed["z"]) {
                moveDirection.z -= 1;
                currentDirection = Math.PI;
            }
            if (keysPressed["arrowdown"] || keysPressed["s"]) {
                moveDirection.z += 1;
                currentDirection = 0;
            }
            if (keysPressed["arrowleft"] || keysPressed["q"]) {
                moveDirection.x -= 1;
                currentDirection = Math.PI / 2;
            }
            if (keysPressed["arrowright"] || keysPressed["d"]) {
                moveDirection.x += 1;
                currentDirection = -Math.PI / 2;
            }

            if (!moveDirection.equals(BABYLON.Vector3.Zero())) {
                model.position.addInPlace(moveDirection.normalize().scale(speed));

                if (currentDirection !== null) {
                    model.rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(currentDirection, 0, 0);
                }

                if (animationGroupRunning) {
                    animationGroupRunning.play(true);
                }
            }

            // Met à jour la caméra pour suivre le personnage
            camera.target = model.position;
        });

        return scene;
    };

    const scene = createScene();
    engine.runRenderLoop(() => scene.render());

    window.addEventListener("resize", () => engine.resize());
});
