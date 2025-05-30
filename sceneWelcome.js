import { Scene1 } from './scene1.js';
import { Scene2 } from './scene2.js';
import { Scene3 } from './scene3.js';
 
export class SceneWelcome {
    constructor(engine, canvas) {
        this.engine = engine;
        this.canvas = canvas;
        this.scene = new BABYLON.Scene(engine);
        this.gameScene = null; 
 
        const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), this.scene);
        camera.setTarget(BABYLON.Vector3.Zero());
        camera.attachControl(canvas, true);
 
       
        const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), this.scene);
        light.intensity = 0.7;
 
       
        this.scene.clearColor = new BABYLON.Color3(1, 1, 1);
 
        
        this.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
 
       
        const backgroundImage = new BABYLON.GUI.Image("background", "asset/FondAccueil.png");
        backgroundImage.width = "100%";
        backgroundImage.height = "100%";
        this.advancedTexture.addControl(backgroundImage);
        this.backgroundImage = backgroundImage; 
 
        
        this.playButton = BABYLON.GUI.Button.CreateSimpleButton("playButton", "Chargement...");
        this.playButton.width = "200px";
        this.playButton.height = "40px";
        this.playButton.color = "white";
        this.playButton.background = "#444"; 
        this.playButton.isEnabled = false; 
        this.playButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        this.playButton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        this.playButton.top = "-80px";
        this.advancedTexture.addControl(this.playButton);
 
        
        this.commandsButton = BABYLON.GUI.Button.CreateSimpleButton("commandsButton", "Commandes");
        this.commandsButton.width = "200px";
        this.commandsButton.height = "40px";
        this.commandsButton.color = "white";
        this.commandsButton.background = "#333"; 
        this.commandsButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        this.commandsButton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        this.commandsButton.top = "-30px";
        this.advancedTexture.addControl(this.commandsButton);
 
       
        this.commandsButton.onPointerClickObservable.add(() => {
            this.showCommands();
        });
 
        
        this.renderScene();
 
        
        setTimeout(() => this.loadGameScene(), 100); 
 
       
        this.playButton.onPointerClickObservable.add(() => {
            if (this.playButton.isEnabled) {
                this.startGame();
            }
        });
 
       
        window.addEventListener("keydown", (event) => {
            if (event.key === " " && this.playButton.isEnabled) {
                this.startGame();
            }
        });
    }
 
    async loadGameScene() {
        
        this.gameScene = new Scene1(this.engine, this.canvas);
        await this.gameScene.initScene();
 
        
        this.playButton.textBlock.text = "Jouer";
        this.playButton.background = "#001f3f"; 
        this.playButton.isEnabled = true;
    }
 
    showCommands() {
        // Masquer les boutons "Jouer" et "Commandes"
        this.playButton.isVisible = false;
        this.commandsButton.isVisible = false;
 
        // Remplacer l'image de fond par celle des commandes
        this.backgroundImage.source = "asset/FondAccueilCommandes.png";
 
      
        this.commandsTitle = new BABYLON.GUI.TextBlock();
        this.commandsTitle.text = "Commandes";
        this.commandsTitle.color = "white";
        this.commandsTitle.fontSize = 50;
        this.commandsTitle.top = "-40%";
        this.advancedTexture.addControl(this.commandsTitle);
 
        // Liste des commandes
        this.commandsText = new BABYLON.GUI.TextBlock();
        this.commandsText.text = "- Déplacement : ZQSD ou flèches\n\n- Tir : clic gauche\n\n - Sprint : touche maj";
        this.commandsText.color = "white";
        this.commandsText.fontSize = 20;
        this.commandsText.top = "-10%";
        this.advancedTexture.addControl(this.commandsText);
 
        // Ajouter un bouton "Retour"
        this.backButton = BABYLON.GUI.Button.CreateSimpleButton("backButton", "Retour");
        this.backButton.width = "200px";
        this.backButton.height = "40px";
        this.backButton.color = "white";
        this.backButton.background = "#444"; 
        this.backButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        this.backButton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        this.backButton.top = "-30px";
        this.advancedTexture.addControl(this.backButton);
 
        // Ajouter un événement pour revenir à l'écran d'accueil
        this.backButton.onPointerClickObservable.add(() => {
            this.hideCommands();
        });
    }
 
    hideCommands() {
        
        this.commandsTitle.dispose();
        this.commandsText.dispose();
        this.backButton.dispose();
 
        
        this.playButton.isVisible = true; 
        this.commandsButton.isVisible = true;
 
        
        this.backgroundImage.source = "asset/FondAccueil.png";
    }
 
    playCinematic() {
        const cinematicScene = new BABYLON.Scene(this.engine);

        // Caméra et lumière basiques
        const camera = new BABYLON.FreeCamera("cinematicCamera", new BABYLON.Vector3(0, 0, -10), cinematicScene);
        camera.setTarget(BABYLON.Vector3.Zero());
        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), cinematicScene);

        // Plan pour afficher les images
        const plane = BABYLON.MeshBuilder.CreatePlane("imagePlane", { width: 16, height: 9 }, cinematicScene);
        plane.position.z = 0;

        const material = new BABYLON.StandardMaterial("imageMat", cinematicScene);
        material.diffuseTexture = null;
        material.emissiveColor = new BABYLON.Color3(1, 1, 1);
        material.backFaceCulling = false;
        plane.material = material;

        // GUI pour les dialogues
        const guiTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("CinematicUI", true, cinematicScene);
        const textBlock = new BABYLON.GUI.TextBlock();
        textBlock.text = "";
        textBlock.color = "white";
        textBlock.fontSize = 28;
        textBlock.textWrapping = true;
        textBlock.height = "160px";
        textBlock.paddingBottom = "30px";
        textBlock.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        textBlock.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        guiTexture.addControl(textBlock);

        // Images et dialogues associés
        const steps = [
            {
                file: "asset/image1.png",
                dialogues: [
                    "??? : Hé toi !",
                    "Hein qui me parle ? Et où suis-je ?",
                    "??? : Bah moi, qui ça peut être d'autre ici ?",
                    "Excusez-moi mais je ne vous vois pas..."
                ],
                duration: 13000
            },
            {
                file: "asset/image2.png",
                dialogues: [
                    "??? C'est censé être ça notre sauveur ? Et bah...",
                    "??? : Je suis sur la table, bloquée dans cette cage.",
                    "Vous êtes une lanterne ? Qui me parle ???",
                    "Lanterne : Et oui mon coco, on est dans le monde des rêves, tout est possible !",
                    "Lanterne : Enfin plus pour longtemps...",
                    "Lanterne : Les cauchemars sont de retour",
                    "Lanterne : Ils nous volent l'énergie des rêves des enfants",
                    "Lanterne : Et sans cela, ce monde va s'éteindre...",
                    "Alors c'est horrible, mais j'ai rien à voir avec tout ça."
                ],
                duration: 29000
            },
            {
                file: "asset/image1.png",
                dialogues: [
                    "Lanterne : Super, il est investi notre prochain DreamWarden...",
                    "DreamWarden ??? Pardon ?",
                    "Lanterne : Surpriiise, tu es le dernier descendant de la lignée des DreamWardens !",
                    "Lanterne : Tu es le seul à pouvoir nous sauver !",
                    "Lanterne : Mais pour ça, viens m'aider à sortir de cette cage !",
                    "Et pourquoi je ferais ça ?",
                    "Lanterne : Tu veux rentrer chez toi ? Alors viens."
                ],
                duration: 23000
            }
        ];

        let stepIndex = 0;
        let dialogueIndex = 0;
        let isCinematicSkipped = false; // Variable de contrôle pour gérer l'interruption
        let stepTimeout = null; // Variable pour stocker le timeout des étapes
        let dialogueTimeout = null; // Variable pour stocker le timeout des dialogues

        const showNextDialogue = (step) => {
            if (isCinematicSkipped) return; // Arrêter les dialogues si la cinématique est interrompue

            if (dialogueIndex < step.dialogues.length) {
                textBlock.text = step.dialogues[dialogueIndex];
                dialogueIndex++;
                dialogueTimeout = setTimeout(() => showNextDialogue(step), 3000); // Affiche chaque phrase toutes les 3 secondes
            } else if (stepIndex >= steps.length - 1) {
                // Si c'est le dernier dialogue de la dernière image, passer à scene1
                guiTexture.dispose(); // Nettoie le GUI
                cinematicScene.dispose(); // Détruit la scène actuelle
                this.startScene1(); // Passe à la scène suivante
                window.removeEventListener("keydown", handleKeyDown); // Supprime l'écouteur d'événements
            }
        };

        const showNextStep = () => {
            if (isCinematicSkipped) return; // Arrêter les étapes si la cinématique est interrompue

            if (stepIndex >= steps.length) {
                return; // Toutes les étapes sont terminées
            }

            const step = steps[stepIndex];
            const texture = new BABYLON.Texture(step.file, cinematicScene, false, false, BABYLON.Texture.BILINEAR_SAMPLINGMODE, () => {
                material.diffuseTexture = texture;
                texture.vScale = -1; // Corrige l'image retournée

                dialogueIndex = 0; // Réinitialise l'index des dialogues pour chaque image
                showNextDialogue(step); // Affiche les dialogues associés à l'image

                stepTimeout = setTimeout(() => {
                    stepIndex++;
                    showNextStep();
                }, step.duration);
            });
        };

        showNextStep();

        // Ajout d'un événement pour passer à scene1 en appuyant sur Espace
        const handleKeyDown = (event) => {
            if (event.key === " ") { // Vérifie si la touche Espace est pressée
                isCinematicSkipped = true; // Marque la cinématique comme interrompue
                clearTimeout(stepTimeout); // Annule le timeout des étapes
                clearTimeout(dialogueTimeout); // Annule le timeout des dialogues

                // Nettoyer les ressources de la cinématique
                guiTexture.dispose(); // Supprime l'interface utilisateur
                cinematicScene.dispose(); // Supprime la scène de la cinématique

                // Passer à scene1
                this.startScene1(); // Appelle la méthode pour lancer scene1

                // Supprimer l'écouteur d'événements
                window.removeEventListener("keydown", handleKeyDown);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        this.engine.runRenderLoop(() => {
            cinematicScene.render();
        });
    }

    startGame() {
        this.playCinematic(); // Joue la cinématique avant de lancer la scène 1
    }

    startScene1() {
        console.log("Transition vers scene1 démarrée...");

        // Arrêter la boucle de rendu de la cinématique
        this.engine.stopRenderLoop();

        // Nettoyer les ressources de la cinématique
        if (this.cinematicScene) {
            this.cinematicScene.dispose();
            console.log("Ressources de la cinématique nettoyées.");
        }

        // Instancier et initialiser scene1
        try {
            const scene1 = new Scene1(this.engine, this.canvas); // Instancie la scène 1
            scene1.initScene(); // Initialise la scène 1
            scene1.renderScene(); // Lance la boucle de rendu pour la scène 1
            console.log("Scene1 initialisée et rendue.");
        } catch (error) {
            console.error("Erreur lors de la transition vers scene1 :", error);
        }
    }

    renderScene() {
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
    }

    messageIntro() {
        const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

        const textBlock = new BABYLON.GUI.TextBlock();
        textBlock.text = "";
        textBlock.color = "white";
        textBlock.fontSize = 24;
        textBlock.height = "100px";

       
        textBlock.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
       
        textBlock.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        
        textBlock.paddingBottom = "20px";

        
        textBlock.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;

        advancedTexture.addControl(textBlock);

        const messages = [
           
        ];

        let index = 0;

        
        textBlock.text = messages[index];

        
        const intervalId = setInterval(() => {
            index++;
            if (index >= messages.length) {
                clearInterval(intervalId); 
                textBlock.text = ""; 
                return;
            }
            textBlock.text = messages[index];
        }, 3000);
    }
    
}
