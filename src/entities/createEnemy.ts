import Phaser from 'phaser';
import { ENEMY_MAX_HEALTH } from '../game/constants';

export type Enemy = Phaser.GameObjects.Arc & {
    health: number;
};

export function createEnemy(scene: Phaser.Scene, x: number, y: number): Enemy {
    const enemy = scene.add.circle(x, y, 20, 0xf07178) as Enemy;
    enemy.setStrokeStyle(3, 0xffc2c5);
    enemy.health = ENEMY_MAX_HEALTH;
    scene.physics.add.existing(enemy);

    const body = enemy.body as Phaser.Physics.Arcade.Body;
    body.setCircle(20);
    body.setCollideWorldBounds(true);

    return enemy;
}
