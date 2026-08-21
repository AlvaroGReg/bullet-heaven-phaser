import Phaser from 'phaser';
import { ENEMY_DEFINITIONS } from './enemyTypes';
import type { EnemyKind } from './enemyTypes';
import { ARMORED_ENEMY_TEXTURES, ENEMY_TEXTURES } from '../sprites/enemies';

export type Enemy = Phaser.Physics.Arcade.Sprite & {
    armored: boolean;
    damage: number;
    experienceMultiplier: number;
    goldDropChance: number;
    grantsFullLevel: boolean;
    health: number;
    isFinalBoss: boolean;
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

export function createEnemy(
    scene: Phaser.Scene,
    x: number,
    y: number,
    kind: EnemyKind = 'normal',
    armored = false,
    options: { healthMultiplier?: number; isFinalBoss?: boolean; speedMultiplier?: number } = {},
): Enemy {
    const definition = ENEMY_DEFINITIONS[kind];
    const canBeArmored = kind === 'normal' || kind === 'heavy' || kind === 'elite';
    const texture = armored && canBeArmored
        ? ARMORED_ENEMY_TEXTURES[kind]
        : ENEMY_TEXTURES[kind];
    const enemy = scene.physics.add.sprite(x, y, texture) as Enemy;
    enemy.armored = armored && canBeArmored;
    enemy.damage = definition.damage;
    enemy.experienceMultiplier = definition.experienceMultiplier * (enemy.armored ? 1.2 : 1);
    enemy.goldDropChance = definition.goldDropChance;
    enemy.grantsFullLevel = definition.grantsFullLevel ?? false;
    enemy.health = definition.health * (options.healthMultiplier ?? 1);
    enemy.isFinalBoss = options.isFinalBoss ?? false;
    enemy.kind = kind;
    enemy.radius = definition.radius;
    enemy.ranged = definition.ranged;
    enemy.nextAttackAt = 0;
    enemy.speed = definition.speed * (options.speedMultiplier ?? 1);
    const body = enemy.body as Phaser.Physics.Arcade.Body;
    body.setCircle(definition.radius);
    body.setCollideWorldBounds(true);

    return enemy;
}
