// personnage.js

export class Personnage {
    constructor(scene, position = new BABYLON.Vector3(0, 1, 0)) {
        this.scene = scene;
        this.position = position;

        // Charger le modèle 3D du personnage à partir du fichier .glb
        BABYLON.SceneLoader.ImportMesh("", "models/", "personnage.glb", this.scene, (meshes) => {
            // Vérifier si les maillages sont correctement importés
            if (meshes.length > 0) {
                this.mesh = meshes[0]; // Utiliser le premier maillage importé
                this.mesh.position = this.position; // Placer le personnage à la position définie
                console.log("Personnage chargé avec succès");

                // Appel de la méthode pour activer le mouvement
                this.enableMovement();
            } else {
                console.log("Erreur lors du chargement du personnage");
            }
        });
    }

    enableMovement() {
        // Gérer les entrées clavier
        this.scene.actionManager = new BABYLON.ActionManager(this.scene);
        
        // Définir la vitesse de déplacement
        const speed = 0.1;

        // Mouvement basé sur les flèches directionnelles
        this.scene.onBeforeRenderObservable.add(() => {
            if (this.mesh) {
                if (BABYLON.KeyboardEventTypes.OnKeyDown) {
                    // Gérer les touches
                    if (BABYLON.InputManager.isKeyPressed(BABYLON.Keys.Up)) {
                        this.mesh.position.z -= speed; // Déplacement en avant (flèche haut)
                    }
                    if (BABYLON.InputManager.isKeyPressed(BABYLON.Keys.Down)) {
                        this.mesh.position.z += speed; // Déplacement en arrière (flèche bas)
                    }
                    if (BABYLON.InputManager.isKeyPressed(BABYLON.Keys.Left)) {
                        this.mesh.position.x -= speed; // Déplacement à gauche (flèche gauche)
                    }
                    if (BABYLON.InputManager.isKeyPressed(BABYLON.Keys.Right)) {
                        this.mesh.position.x += speed; // Déplacement à droite (flèche droite)
                    }
                }
            }
        });
    }
}
