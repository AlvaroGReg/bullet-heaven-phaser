import Phaser from 'phaser';

export function createEnemy(scene: Phaser.Scene, x: number, y: number): Phaser.GameObjects.Arc {
    const enemy = scene.add.circle(x, y, 20, 0xf07178);
    enemy.setStrokeStyle(3, 0xffc2c5);
    scene.physics.add.existing(enemy);

    const body = enemy.body as Phaser.Physics.Arcade.Body;
    body.setCircle(20);
    body.setCollideWorldBounds(true);

    return enemy;
}
