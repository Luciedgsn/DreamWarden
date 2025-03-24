// personnage.js

export class Personnage {
    constructor(scene, position = new BABYLON.Vector3(0, 1, 0)) {
        this.scene = scene;
        this.position = position;
        this.animations = {}; // Pour stocker les animations
        this.animationGroupRunning = null; // Animation de course
        this.animationGroupSprinting = null; // Animation de sprint
        this.isRunning = false; // Indicateur pour savoir si l'animation de course est en cours
        this.isSprinting = false; // Indicateur pour savoir si l'animation de sprint est en cours

        // Charger le modèle 3D du personnage à partir du fichier .glb
        BABYLON.SceneLoader.ImportMesh("", "asset/", "AnimPerso.glb", this.scene, (meshes, particleSystems, skeletons, animationGroups) => {
            // Vérifier si les maillages sont correctement importés
            if (meshes.length > 0) {
                this.mesh = meshes[0]; // Utiliser le premier maillage importé
                this.mesh.position = this.position; // Placer le personnage à la position définie
                this.mesh.checkCollisions = true; // Activer les collisions pour le personnage
                console.log("Personnage chargé avec succès");

                // Assigner les animations de course et de sprint
                this.animationGroupRunning = animationGroups[5];
                this.animationGroupSprinting = animationGroups[0];
                this.animationGroupRunning.stop(); // Commence par arrêter l'animation au début
                this.animationGroupSprinting.stop(); // Commence par arrêter l'animation au début

                // Stocker les animations
                animationGroups.forEach((animationGroup, index) => {
                    this.animations[index] = animationGroup;
                });

                // Démarrer avec l'animation IDLE (index [3])
                this.playAnimation(3);

                // Appel de la méthode pour activer le mouvement
                this.enableMovement();
            } else {
                console.log("Erreur lors du chargement du personnage");
            }
        }, null, (scene, message, exception) => {
            console.error("Erreur lors du chargement du modèle :", message, exception);
        });
    }

    playAnimation(index) {
        // Arrêter toutes les animations
        for (const key in this.animations) {
            this.animations[key].stop();
        }

        // Jouer l'animation spécifiée
        if (this.animations[index]) {
            this.animations[index].play(true);
        }
    }

    enableMovement() {
        const speed = 0.06;
        const sprintMultiplier = 5; // Multiplicateur de vitesse pour le sprint
        let moveDirection = BABYLON.Vector3.Zero(); // Vecteur de mouvement initial
        let currentDirection = 0; // Direction actuelle (en radians)
        let isShiftPressed = false; // Indicateur pour savoir si la touche Maj est enfoncée

        // Ajouter un écouteur pour les touches du clavier
        window.addEventListener("keydown", (event) => {
            if (event.key === "ArrowUp" || event.key === "z") {
                moveDirection = new BABYLON.Vector3(0, 0, 1); // Avancer
                currentDirection = Math.PI; // Orientation vers l'avant
            } else if (event.key === "ArrowDown" || event.key === "s") {
                moveDirection = new BABYLON.Vector3(0, 0, -1); // Reculer
                currentDirection = 0; // Orientation vers l'arrière
            } else if (event.key === "ArrowLeft" || event.key === "q") {
                moveDirection = new BABYLON.Vector3(-1, 0, 0); // Aller à gauche
                currentDirection = Math.PI / 2; // Orientation vers la gauche
            } else if (event.key === "ArrowRight" || event.key === "d") {
                moveDirection = new BABYLON.Vector3(1, 0, 0); // Aller à droite
                currentDirection = -Math.PI / 2; // Orientation vers la droite
            } else if (event.key === "Shift") {
                isShiftPressed = true; // La touche Maj est enfoncée
            }

            // Jouer l'animation de course ou de sprint si une touche de direction est enfoncée
            if (!moveDirection.equals(BABYLON.Vector3.Zero())) {
                if (isShiftPressed && !this.isSprinting) {
                    this.playAnimation(0); // Jouer l'animation de sprint
                    this.isSprinting = true;
                    this.isRunning = false;
                } else if (!isShiftPressed && !this.isRunning) {
                    this.playAnimation(5); // Jouer l'animation de course
                    this.isRunning = true;
                    this.isSprinting = false;
                }
            }
        });

        // Lorsqu'une touche est relâchée, arrêter le mouvement ou le sprint
        window.addEventListener("keyup", (event) => {
            if (event.key === "ArrowUp" || event.key === "z" ||
                event.key === "ArrowDown" || event.key === "s" ||
                event.key === "ArrowLeft" || event.key === "q" ||
                event.key === "ArrowRight" || event.key === "d") {
                moveDirection = BABYLON.Vector3.Zero(); // Arrêter le mouvement
                console.log("Arrêt de l'animation de course, retour à l'animation IDLE");
                this.playAnimation(3); // Jouer l'animation IDLE (index [3])
                this.isRunning = false;
                this.isSprinting = false;
            } else if (event.key === "Shift") {
                isShiftPressed = false; // La touche Maj est relâchée
            }
        });

        // Boucle de mise à jour du mouvement du modèle
        this.scene.onBeforeRenderObservable.add(() => {
            if (this.mesh && !moveDirection.equals(BABYLON.Vector3.Zero())) {
                const actualSpeed = isShiftPressed ? speed * sprintMultiplier : speed;
                this.mesh.moveWithCollisions(moveDirection.scale(actualSpeed)); // Appliquer le déplacement avec collisions

                // Appliquer la rotation du personnage pour l'orienter dans la bonne direction
                this.mesh.rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(currentDirection, 0, 0);

                if (this.animationGroupRunning && this.isRunning) {
                    this.animationGroupRunning.play(true); // Jouer l'animation de course
                }

                if (this.animationGroupSprinting && this.isSprinting) {
                    this.animationGroupSprinting.play(true); // Jouer l'animation de sprint
                }
            }

            // Mettre à jour la position de la caméra pour suivre le personnage
            this.updateCamera();
        });
    }

    updateCamera() {
        const cameraOffset = new BABYLON.Vector3(0, 10, -10);
        this.scene.activeCamera.position = this.mesh.position.add(cameraOffset);
        this.scene.activeCamera.setTarget(this.mesh.position);
    }
}
