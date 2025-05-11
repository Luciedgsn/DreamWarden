export class Lanterne {
    constructor(scene, position = new BABYLON.Vector3(0, 1, 0)) {
        this.scene = scene;
        this.position = position;
        this.isCollected = false; // Indique si la lanterne a été collectée
        this.dialogues = []; // Liste des dialogues de la lanterne

        // Ajoutez ceci dans SceneBase
        this.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

        // Créer la lanterne (cube bleu pour l'instant)
        this.mesh = BABYLON.MeshBuilder.CreateBox("lantern", { size: 1 }, this.scene);
        this.mesh.position = this.position;
        const lanternMaterial = new BABYLON.StandardMaterial("lanternMaterial", this.scene);
        lanternMaterial.diffuseColor = new BABYLON.Color3(0, 0, 1); // Couleur bleue
        this.mesh.material = lanternMaterial;

        // Ajouter une action pour détecter les clics
        this.mesh.actionManager = new BABYLON.ActionManager(this.scene);
        this.mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
            BABYLON.ActionManager.OnPickTrigger,
            () => this.collectLantern()
        ));
    }

    // Méthode pour collecter la lanterne
    collectLantern() {
        if (!this.isCollected) {
            console.log("Lanterne collectée !");
            this.isCollected = true;
            this.mesh.isVisible = false; // Masquer la lanterne dans la scène
            this.addLanternToUI(); // Ajouter l'icône de la lanterne à l'interface utilisateur
        }
    }

    // Méthode pour ajouter l'icône de la lanterne à l'interface utilisateur
    addLanternToUI() {
        // Utiliser l'interface utilisateur globale
        const lanternIcon = new BABYLON.GUI.Image("lanternIcon", "textures/lantern.png"); // Remplacez par une image réelle plus tard
        lanternIcon.width = "100px";
        lanternIcon.height = "100px";
        lanternIcon.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        lanternIcon.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        lanternIcon.left = "10px";
        lanternIcon.top = "-10px";

        // Ajouter l'icône à l'interface utilisateur globale
        this.scene.advancedTexture.addControl(lanternIcon);
    }

    // Méthode pour faire parler la lanterne
    speak(text) {
        if (!this.scene.advancedTexture) {
            console.error("L'interface utilisateur globale (advancedTexture) n'est pas définie !");
            return;
        }

        if (this.isSpeaking) return; // Empêche d'afficher plusieurs dialogues en même temps
        this.isSpeaking = true;

        const dialogueBox = new BABYLON.GUI.TextBlock();
        dialogueBox.text = text;
        dialogueBox.color = "white";
        dialogueBox.fontSize = 20;
        dialogueBox.background = "black";
        dialogueBox.width = "300px";
        dialogueBox.height = "50px";
        dialogueBox.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        dialogueBox.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        dialogueBox.top = "-150px";

        // Ajouter le dialogue à l'interface utilisateur globale
        this.scene.advancedTexture.addControl(dialogueBox);

        // Supprimer le dialogue après 3 secondes
        setTimeout(() => {
            this.scene.advancedTexture.removeControl(dialogueBox);
            this.isSpeaking = false; // Permet d'afficher un nouveau dialogue
        }, 3000);
    }
}