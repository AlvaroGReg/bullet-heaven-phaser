import Phaser from 'phaser';
import { ENEMY_DEFINITIONS } from './enemyTypes';
import type { EnemyKind } from './enemyTypes';

export type Enemy = Phaser.GameObjects.Arc & {
    armored: boolean;
    damage: number;
    experienceMultiplier: number;
    grantsFullLevel: boolean;
    health: number;
    kind: EnemyKind;
    radius: number;
    ranged?: {
        attackInterval: number;
        attackRange: number;
        projectileSpeed: number;
    };
    nextAttackAt: number;
    speed: number;
};

export function createEnemy(scene: Phaser.Scene, x: number, y: number, kind: EnemyKind = 'normal', armored = false): Enemy {
    const definition = ENEMY_DEFINITIONS[kind];
    const canBeArmored = kind === 'normal' || kind === 'heavy' || kind === 'elite';
    const enemy = scene.add.circle(x, y, definition.radius, definition.color) as Enemy;
    enemy.armored = armored && canBeArmored;
    enemy.damage = definition.damage;
    enemy.experienceMultiplier = definition.experienceMultiplier * (enemy.armored ? 1.2 : 1);
    enemy.grantsFullLevel = definition.grantsFullLevel ?? false;
    enemy.health = definition.health;
    enemy.kind = kind;
    enemy.radius = definition.radius;
    enemy.ranged = definition.ranged;
    enemy.nextAttackAt = 0;
    enemy.speed = definition.speed;
    enemy.setStrokeStyle(enemy.armored ? 4 : 3, enemy.armored ? 0x94a3b8 : 0xffffff);
    scene.physics.add.existing(enemy);

    const body = enemy.body as Phaser.Physics.Arcade.Body;
    body.setCircle(definition.radius);
    body.setCollideWorldBounds(true);

    return enemy;
}
