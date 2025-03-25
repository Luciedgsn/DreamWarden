import { Scene1 } from './scene1.js';

export class SceneWelcome {
    constructor(engine, canvas) {
        this.engine = engine;
        this.canvas = canvas;
        this.scene = new BABYLON.Scene(engine);
        this.gameScene = null; // Stocker la scène de jeu

        // Créer une caméra
        const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), this.scene);
        camera.setTarget(BABYLON.Vector3.Zero());
        camera.attachControl(canvas, true);

        // Créer une lumière
        const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), this.scene);
        light.intensity = 0.7;

        // Changer le fond en blanc
        this.scene.clearColor = new BABYLON.Color3(1, 1, 1);

        // Créer une interface utilisateur
        const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

        // Ajouter l'image du titre
        const titleImage = new BABYLON.GUI.Image("title", "asset/title.png");
        titleImage.width = "70%"; // Augmenter la taille de l'image
        titleImage.height = "50%"; // Augmenter la taille de l'image
        titleImage.top = "-10%";
        titleImage.left = "2%";
        advancedTexture.addControl(titleImage);

        // Ajouter une animation pour l'effet de vague
        this.animateWave(titleImage);

        // Créer un texte pour l'instruction
        this.instructionText = new BABYLON.GUI.TextBlock();
        this.instructionText.text = "Chargement...";
        this.instructionText.color = "black"; // Changer la couleur du texte en noir
        this.instructionText.fontSize = 30;
        this.instructionText.top = "10%";
        advancedTexture.addControl(this.instructionText);

        // Lancer le rendu de l'écran d'accueil immédiatement
        this.renderScene();

        // Charger la scène de jeu en arrière-plan après un court délai
        setTimeout(() => this.loadGameScene(), 100); // Délai de 100ms pour s'assurer que l'écran d'accueil est affiché

        // Ajouter un écouteur pour la touche "Espace"
        window.addEventListener("keydown", (event) => {
            if (event.key === " " && this.gameScene) {
                this.startGame();
            }
        });
    }

    async loadGameScene() {
        // Charger la scène de jeu
        this.gameScene = new Scene1(this.engine, this.canvas);
        await this.gameScene.initScene();

        // Mettre à jour le texte d'instruction une fois le chargement terminé
        this.instructionText.text = "Appuyer sur Espace pour jouer";
        this.animateText(this.instructionText);
    }

    animateText(textBlock) {
        const animation = new BABYLON.Animation(
            "flash",
            "alpha",
            30, // Fréquence d'animation (plus lent)
            BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
        );

        const keys = [];
        keys.push({ frame: 0, value: 1 });
        keys.push({ frame: 30, value: 0 });
        keys.push({ frame: 60, value: 1 });

        animation.setKeys(keys);
        textBlock.animations = [];
        textBlock.animations.push(animation);
        this.scene.beginAnimation(textBlock, 0, 60, true);
    }

    animateWave(image) {
        const animation = new BABYLON.Animation(
            "wave",
            "top",
            30, // Fréquence d'animation
            BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
        );

        const keys = [];
        keys.push({ frame: 0, value: -10 });
        keys.push({ frame: 30, value: -15 });
        keys.push({ frame: 60, value: -10 });

        animation.setKeys(keys);
        image.animations = [];
        image.animations.push(animation);
        this.scene.beginAnimation(image, 0, 60, true);
    }

    startGame() {
        // Passer à la scène de jeu
        this.engine.stopRenderLoop();
        this.gameScene.renderScene();
    }

    renderScene() {
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
    }
}