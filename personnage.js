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
        this.canCastSpell = true; // Indicateur pour savoir si le joueur peut lancer un sort
        this.spellCooldown = 700; // Délai entre deux sorts en millisecondes
 
   
 
        // Charger le modèle 3D du personnage à partir du fichier .glb
        BABYLON.SceneLoader.ImportMesh("", "asset/", "AnimPerso2.glb", this.scene, (meshes, particleSystems, skeletons, animationGroups) => {
            if (meshes.length > 0) {
                this.mesh = meshes[0]; // Utiliser le premier maillage importé
                this.mesh.position = this.position; // Placer le personnage à la position définie
                this.mesh.checkCollisions = true; // Activer les collisions pour le personnage
                console.log("Personnage chargé avec succès");
 
                // Assigner les animations idle, running, et walking
                this.animations[0] = animationGroups[0]; // Idle
                this.animations[1] = animationGroups[1]; // Running
                this.animations[2] = animationGroups[2]; // Walking
 
                // Arrêter toutes les animations au début
                Object.values(this.animations).forEach(animation => animation.stop());
 
                // Démarrer avec l'animation IDLE
                this.playAnimation(0);
 
                // Activer le mouvement
                this.enableMovement();
 
                // Activer le tir de boules de feu
                this.enableFireballShooting();
            } else {
                console.error("Erreur : Aucun maillage trouvé dans le modèle.");
            }
        }, null, (scene, message, exception) => {
            console.error("Erreur lors du chargement du modèle :", message, exception);
        });
 
        this.scene.activeCamera.attachControl(this.scene.getEngine().getRenderingCanvas(), false);
    }
 
    playAnimation(index) {
        // Arrêter toutes les animations en cours
        Object.values(this.animations).forEach(animation => animation.stop());
 
        // Vérifier si l'animation demandée existe
        if (this.animations[index]) {
            this.animations[index].start(true); // Jouer l'animation en boucle
            console.log(`Animation ${index} démarrée.`);
        } else {
            console.error(`Animation ${index} non trouvée.`);
        }
    }
 
    enableMovement() {
        const speedWalking = 0.07; // Vitesse de marche
        const speedRunning = 0.16; // Vitesse de sprint
        const keysPressed = {}; // Tableau pour suivre les touches enfoncées
        let isShiftPressed = false; // Indicateur pour le sprint
 
        // Désactiver les contrôles par défaut de la caméra
        this.scene.activeCamera.attachControl(this.scene.getEngine().getRenderingCanvas(), false);
 
        // Ajouter un écouteur pour les touches enfoncées
        window.addEventListener("keydown", (event) => {
            keysPressed[event.key] = true; // Marquer la touche comme enfoncée
 
            if (event.key === "Shift") {
                isShiftPressed = true; // Activer le sprint
            }
        });
 
        // Ajouter un écouteur pour les touches relâchées
        window.addEventListener("keyup", (event) => {
            keysPressed[event.key] = false; // Marquer la touche comme relâchée
 
            if (event.key === "Shift") {
                isShiftPressed = false; // Désactiver le sprint
            }
        });
 
        // Boucle de mise à jour du mouvement
        this.scene.onBeforeRenderObservable.add(() => {
            let moveDirection = BABYLON.Vector3.Zero(); // Initialiser le vecteur de mouvement
            let angle = null; // Angle de rotation du personnage
 
            // Vérifier les combinaisons de touches pour les diagonales
            if ((keysPressed["ArrowUp"] || keysPressed["z"]) && (keysPressed["ArrowRight"] || keysPressed["d"])) {
                // Haut-droite
                moveDirection = new BABYLON.Vector3(1, 0, 1); // Diagonale haut-droite
                angle = -(3 * Math.PI) / 4; // 45 degrés
            } else if ((keysPressed["ArrowUp"] || keysPressed["z"]) && (keysPressed["ArrowLeft"] || keysPressed["q"])) {
                // Haut-gauche
                moveDirection = new BABYLON.Vector3(-1, 0, 1); // Diagonale haut-gauche
                angle = (3 * Math.PI) / 4; // 135 degrés
            } else if ((keysPressed["ArrowDown"] || keysPressed["s"]) && (keysPressed["ArrowLeft"] || keysPressed["q"])) {
                // Bas-gauche
                moveDirection = new BABYLON.Vector3(-1, 0, -1); // Diagonale bas-gauche
                angle = Math.PI / 4; // -135 degrés
            } else if ((keysPressed["ArrowDown"] || keysPressed["s"]) && (keysPressed["ArrowRight"] || keysPressed["d"])) {
                // Bas-droite
                moveDirection = new BABYLON.Vector3(1, 0, -1); // Diagonale bas-droite
                angle = -Math.PI / 4; // -45 degrés
            } else if (keysPressed["ArrowUp"] || keysPressed["z"]) {
                // Haut
                moveDirection = new BABYLON.Vector3(0, 0, 1); // Avancer
                angle = Math.PI; // 180 degrés
            } else if (keysPressed["ArrowDown"] || keysPressed["s"]) {
                // Bas
                moveDirection = new BABYLON.Vector3(0, 0, -1); // Reculer
                angle = 0; // 0 degré
            } else if (keysPressed["ArrowLeft"] || keysPressed["q"]) {
                // Gauche
                moveDirection = new BABYLON.Vector3(-1, 0, 0); // Aller à gauche
                angle = Math.PI / 2; // 90 degrés
            } else if (keysPressed["ArrowRight"] || keysPressed["d"]) {
                // Droite
                moveDirection = new BABYLON.Vector3(1, 0, 0); // Aller à droite
                angle = -Math.PI / 2; // -90 degrés
            }
 
            // Si une direction valide est détectée
            if (!moveDirection.equals(BABYLON.Vector3.Zero())) {
                // Normaliser le vecteur de mouvement
                moveDirection = moveDirection.normalize();
 
                // Appliquer la vitesse en fonction du sprint
                const speed = isShiftPressed ? speedRunning : speedWalking;
                moveDirection = moveDirection.scale(speed);
 
                // Déplacer le personnage
                if (this.mesh) {
                    this.mesh.moveWithCollisions(moveDirection);
 
                    // Appliquer la rotation du personnage pour l'orienter dans la direction du mouvement
                    if (angle !== null) {
                        this.mesh.rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(angle, 0, 0); // Appliquer la rotation
                    }
 
                    // Jouer l'animation appropriée
                    if (isShiftPressed && !this.isSprinting) {
                        this.playAnimation(1); // Animation de sprint
                        this.isSprinting = true;
                        this.isRunning = false;
                    } else if (!isShiftPressed && !this.isRunning) {
                        this.playAnimation(2); // Animation de marche
                        this.isRunning = true;
                        this.isSprinting = false;
                    }
                }
            } else {
                // Si aucune direction valide, jouer l'animation IDLE
                if (this.isRunning || this.isSprinting) {
                    this.playAnimation(0); // Animation IDLE
                    this.isRunning = false;
                    this.isSprinting = false;
                }
            }
 
            // Mettre à jour la position de la caméra
            this.updateCamera();
        });
    }
 
    updateCamera() {
        const cameraOffset = new BABYLON.Vector3(0, 10, -10); // Décalage de la caméra par rapport au personnage
        this.scene.activeCamera.position = this.mesh.position.add(cameraOffset);
        this.scene.activeCamera.setTarget(this.mesh.position); // La caméra regarde toujours le personnage
    }
 
    enableFireballShooting() {
        // Écouter les clics de souris
        this.scene.onPointerDown = (evt, pickResult) => {
            // Vérifier si le clic gauche de la souris est utilisé
            if (evt.button === 0) { // 0 = clic gauche
                this.castFireball();
            }
        };
    }
 
    castFireball() {
        if (!this.canCastSpell) {
            console.log("Sort en recharge...");
            return; // Ne rien faire si le joueur ne peut pas encore lancer un sort
        }
 
        console.log("Lancement d'un sort magique !");
        
        // Créer une sphère pour représenter le sort
        const fireball = BABYLON.MeshBuilder.CreateSphere("fireball", { diameter: 0.5 }, this.scene);
        fireball.position = this.mesh.position.clone(); // Positionner la boule de feu au niveau du personnage
        fireball.position.y += 1; // Légèrement au-dessus du sol
 
        // Appliquer un matériau à la boule de feu
        const fireballMaterial = new BABYLON.StandardMaterial("fireballMaterial", this.scene);
        fireballMaterial.emissiveColor = new BABYLON.Color3(1, 0.5, 0); // Couleur orange
        fireball.material = fireballMaterial;
 
        // Calculer la direction du sort
        const pickInfo = this.scene.pick(this.scene.pointerX, this.scene.pointerY); // Obtenir la position de la souris
        let targetPoint;
        if (pickInfo.hit) {
            // Si un objet est touché, viser cet objet
            targetPoint = pickInfo.pickedPoint;
        } else {
            // Sinon, viser tout droit devant
            const forwardRay = this.scene.activeCamera.getForwardRay();
            targetPoint = forwardRay.origin.add(forwardRay.direction.scale(20)); // Point à 20 unités devant
        }
 
        // Calculer la direction vers la cible
        const direction = targetPoint.subtract(fireball.position).normalize();
 
        // Déplacer la boule de feu
        const speed = 0.5; // Vitesse de la boule de feu
        const maxDistance = 20; // Distance maximale avant de supprimer la boule de feu
        let distanceTravelled = 0;
 
        const fireballObserver = this.scene.onBeforeRenderObservable.add(() => {
            const deltaMove = direction.scale(speed);
            fireball.position.addInPlace(deltaMove); // Déplacer la boule de feu
            distanceTravelled += deltaMove.length();
 
            // Vérifier les collisions avec les ennemis
            this.scene.meshes.forEach(mesh => {
                if (mesh.name.startsWith("enemy") && fireball.intersectsMesh(mesh, false)) {
                    console.log(`Collision détectée avec ${mesh.name}`);
                    this.explodeFireball(fireball); // Explosion à l'impact
                    this.scene.onBeforeRenderObservable.remove(fireballObserver); // Arrêter l'observable
                }
            });
 
            // Supprimer la boule de feu si elle dépasse la distance maximale
            if (distanceTravelled >= maxDistance) {
                fireball.dispose();
                this.scene.onBeforeRenderObservable.remove(fireballObserver); // Arrêter l'observable
            }
        });
 
        // Définir un délai avant de pouvoir lancer un autre sort
        this.canCastSpell = false;
        setTimeout(() => {
            this.canCastSpell = true;
            console.log("Sort prêt à être relancé !");
        }, this.spellCooldown);
    }
 
    explodeFireball(fireball) {
        console.log("Explosion de la boule de feu !");
        fireball.dispose(); // Supprimer la boule de feu
    }
}