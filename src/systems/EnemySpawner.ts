import Phaser from 'phaser';
import { createEnemy } from '../entities/createEnemy';
import type { EnemyKind } from '../entities/enemyTypes';
import {
    ENEMY_SPAWN_INITIAL_INTERVAL,
    ENEMY_SPAWN_INTERVAL_REDUCTION,
    ENEMY_SPAWN_MIN_INTERVAL,
    ENEMY_SPAWN_PHASE_DURATION,
    MAP_HEIGHT,
    MAP_WIDTH,
} from '../game/constants';

export class EnemySpawner {
    private nextSpawnAt: number;

    public constructor(
        private readonly scene: Phaser.Scene,
        private readonly player: Phaser.GameObjects.Arc,
        private readonly enemies: Phaser.Physics.Arcade.Group,
    ) {
        this.nextSpawnAt = this.scene.time.now + ENEMY_SPAWN_INITIAL_INTERVAL;
    }

    public update(): void {
        if (this.scene.time.now < this.nextSpawnAt) {
            return;
        }

        this.spawnEnemy();

        const completedPhases = Math.floor(this.scene.time.now / ENEMY_SPAWN_PHASE_DURATION);
        const interval = Math.max(
            ENEMY_SPAWN_MIN_INTERVAL,
            ENEMY_SPAWN_INITIAL_INTERVAL - completedPhases * ENEMY_SPAWN_INTERVAL_REDUCTION,
        );
        this.nextSpawnAt = this.scene.time.now + interval;
    }

    private spawnEnemy(): void {
        const completedPhases = Math.floor(this.scene.time.now / ENEMY_SPAWN_PHASE_DURATION);
        const { armored, kind } = this.chooseEnemy(completedPhases);

        for (let attempt = 0; attempt < 10; attempt += 1) {
            const x = Phaser.Math.Between(20, MAP_WIDTH - 20);
            const y = Phaser.Math.Between(20, MAP_HEIGHT - 20);

            if (Phaser.Math.Distance.Between(x, y, this.player.x, this.player.y) >= 180) {
                this.enemies.add(createEnemy(this.scene, x, y, kind, armored));
                return;
            }
        }

        const x = this.player.x < MAP_WIDTH / 2 ? MAP_WIDTH - 20 : 20;
        const y = this.player.y < MAP_HEIGHT / 2 ? MAP_HEIGHT - 20 : 20;
        this.enemies.add(createEnemy(this.scene, x, y, kind, armored));
    }

    private chooseEnemy(completedPhases: number): { armored: boolean; kind: EnemyKind } {
        const options: Array<{ kind: EnemyKind; weight: number }> = [
            { kind: 'normal', weight: 60 },
            { kind: 'fast', weight: 20 },
            { kind: 'heavy', weight: 12 },
            { kind: 'ranged', weight: 8 },
        ];

        if (completedPhases >= 1) {
            options.push({ kind: 'elite', weight: 10 });
        }

        if (completedPhases >= 2) {
            options.push({ kind: 'boss', weight: 2 });
        }

        const totalWeight = options.reduce((total, option) => total + option.weight, 0);
        let roll = Math.random() * totalWeight;
        let kind: EnemyKind = 'normal';

        for (const option of options) {
            roll -= option.weight;

            if (roll < 0) {
                kind = option.kind;
                break;
            }
        }

        const canBeArmored = kind === 'normal' || kind === 'heavy' || kind === 'elite';
        const armored = canBeArmored && Math.random() < Math.min(0.1 + completedPhases * 0.04, 0.35);

        return { armored, kind };
    }
}
