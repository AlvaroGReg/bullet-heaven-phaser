import Phaser from 'phaser';

export function createPlayer(scene: Phaser.Scene, x: number, y: number): Phaser.GameObjects.Arc {
    const player = scene.add.circle(x, y, 18, 0x6ee7b7);
    player.setStrokeStyle(3, 0xd9fff0);
    scene.physics.add.existing(player);

    const body = player.body as Phaser.Physics.Arcade.Body;
    body.setCircle(18);
    body.setCollideWorldBounds(true);

    return player;
}
