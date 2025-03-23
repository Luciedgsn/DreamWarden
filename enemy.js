// enemy.js

export class Enemy {
    constructor(scene, position = new BABYLON.Vector3(0, 1, 0), size = 2) {
        this.scene = scene;
        this.position = position;
        this.size = size;

        this.enemy = BABYLON.MeshBuilder.CreateBox("enemy", { size: this.size }, this.scene);
        this.enemy.position = this.position;

        const enemyMaterial = new BABYLON.StandardMaterial("enemyMat", this.scene);
        enemyMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0); // Couleur rouge pour l'ennemi
        this.enemy.material = enemyMaterial;
    }

    moveEnemy(x, y, z) {
        this.enemy.position.x += x;
        this.enemy.position.y += y;
        this.enemy.position.z += z;
    }
}
