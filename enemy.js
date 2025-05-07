// enemy.js

export class Enemy {
    constructor(scene, position = new BABYLON.Vector3(0, 1, 0), size = 2) {
        this.scene = scene;
        this.position = position;
        this.size = size;

        // Créer un cube rouge
        this.enemy = BABYLON.MeshBuilder.CreateBox("redCube", { size: this.size }, this.scene);
        this.enemy.position = this.position;
        const redMaterial = new BABYLON.StandardMaterial("redMat", this.scene);
        redMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);
        this.enemy.material = redMaterial;

        // Détecter les clics sur le cube rouge
        this.clickCount = 0;
        this.enemy.actionManager = new BABYLON.ActionManager(this.scene);
        this.enemy.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
            BABYLON.ActionManager.OnPickTrigger,
            () => {
                this.clickCount++;
                console.log(`Clic numéro: ${this.clickCount}`);

                // Ouvrir une porte dans le mur de droite après 3 clics
                if (this.clickCount === 3) {
                    console.log("Trois clics effectués. Ouverture de la porte...");
                    this.openDoor();
                }
            }
        ));
    }

    loadScene2() {
        // Supprimer la scène actuelle et libérer la mémoire
        this.scene.dispose();

        // Créer la nouvelle scène 2
        const scene2 = new Scene2(this.engine, this.canvas);

        // Lancer la boucle de rendu de la scène 2
        scene2.renderScene();
        scene2.resizeScene();
    }

    createWall(name, width, height, position, rotation) {
        const wall = BABYLON.MeshBuilder.CreatePlane(name, { width, height }, this.scene);
        wall.position = position;
        wall.rotation = rotation;
        return wall;
    }

    moveEnemy(x, y, z) {
        this.enemy.position.x += x;
        this.enemy.position.y += y;
        this.enemy.position.z += z;
    }
}
