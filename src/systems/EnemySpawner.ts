import Phaser from 'phaser';
import { createEnemy } from '../entities/createEnemy';
import type { Player } from '../entities/createPlayer';
import type { EnemyKind } from '../entities/enemyTypes';
import {
    ELITE_SPAWN_INTERVAL,
    ENEMY_SPAWN_INITIAL_INTERVAL,
    ENEMY_SPAWN_INTERVAL_REDUCTION,
    ENEMY_SPAWN_MIN_INTERVAL,
    ENEMY_SPAWN_PHASE_DURATION,
    FINAL_BOSS_TIME,
    FIRST_BOSS_TIME,
    MAP_HEIGHT,
    MAP_WIDTH,
    POST_FINAL_BOSS_PHASE_DURATION,
    POST_FINAL_BOSS_SPAWN_INTERVAL_REDUCTION,
    POST_FINAL_BOSS_SPAWN_MIN_INTERVAL,
} from '../game/constants';

export class EnemySpawner {
    private nextSpawnAt: number;

    private nextEliteAt: number;

    private firstBossSpawned = false;

    private finalBossSpawned = false;

    public constructor(
        private readonly scene: Phaser.Scene,
        private readonly player: Player,
        private readonly enemies: Phaser.Physics.Arcade.Group,
    ) {
        this.nextSpawnAt = this.scene.time.now + ENEMY_SPAWN_INITIAL_INTERVAL;
        this.nextEliteAt = this.scene.time.now + ELITE_SPAWN_INTERVAL;
    }

    public update(): void {
        this.spawnScheduledEnemies();

        if (this.scene.time.now < this.nextSpawnAt) {
            return;
        }

        this.spawnEnemy();

        const interval = this.finalBossSpawned
            ? Math.max(
                POST_FINAL_BOSS_SPAWN_MIN_INTERVAL,
                ENEMY_SPAWN_MIN_INTERVAL - Math.floor((this.scene.time.now - FINAL_BOSS_TIME) / POST_FINAL_BOSS_PHASE_DURATION)
                    * POST_FINAL_BOSS_SPAWN_INTERVAL_REDUCTION,
            )
            : Math.max(
                ENEMY_SPAWN_MIN_INTERVAL,
                ENEMY_SPAWN_INITIAL_INTERVAL - Math.floor(this.scene.time.now / ENEMY_SPAWN_PHASE_DURATION)
                    * ENEMY_SPAWN_INTERVAL_REDUCTION,
            );
        this.nextSpawnAt = this.scene.time.now + interval;
    }

    private spawnScheduledEnemies(): void {
        while (this.scene.time.now >= this.nextEliteAt) {
            this.spawnEnemy('elite');
            this.nextEliteAt += ELITE_SPAWN_INTERVAL;
        }

        if (!this.firstBossSpawned && this.scene.time.now >= FIRST_BOSS_TIME) {
            this.firstBossSpawned = true;
            this.spawnEnemy('boss');
        }

        if (!this.finalBossSpawned && this.scene.time.now >= FINAL_BOSS_TIME) {
            this.finalBossSpawned = true;
            this.spawnEnemy('boss', false, { healthMultiplier: 2.5, isFinalBoss: true });
        }
    }

    private spawnEnemy(kind?: EnemyKind, armored?: boolean, options?: { healthMultiplier?: number; isFinalBoss?: boolean }): void {
        const completedPhases = Math.floor(this.scene.time.now / ENEMY_SPAWN_PHASE_DURATION);
        const choice = kind ? { armored: armored ?? false, kind } : this.chooseEnemy(completedPhases);

        for (let attempt = 0; attempt < 10; attempt += 1) {
            const x = Phaser.Math.Between(20, MAP_WIDTH - 20);
            const y = Phaser.Math.Between(20, MAP_HEIGHT - 20);

            if (Phaser.Math.Distance.Between(x, y, this.player.x, this.player.y) >= 180) {
                this.enemies.add(createEnemy(this.scene, x, y, choice.kind, choice.armored, options));
                return;
            }
        }

        const x = this.player.x < MAP_WIDTH / 2 ? MAP_WIDTH - 20 : 20;
        const y = this.player.y < MAP_HEIGHT / 2 ? MAP_HEIGHT - 20 : 20;
        this.enemies.add(createEnemy(this.scene, x, y, choice.kind, choice.armored, options));
    }

    private chooseEnemy(completedPhases: number): { armored: boolean; kind: EnemyKind } {
        const options: Array<{ kind: EnemyKind; weight: number }> = [
            { kind: 'normal', weight: 60 },
            { kind: 'fast', weight: 20 },
            { kind: 'heavy', weight: 12 },
            { kind: 'ranged', weight: 8 },
        ];

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
