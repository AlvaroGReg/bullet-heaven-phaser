import Phaser from 'phaser';
import { createEnemy } from '../entities/createEnemy';
import type { Player } from '../entities/createPlayer';
import type { EnemyKind } from '../entities/enemyTypes';
import { ACTIVE_DIFFICULTY } from '../game/difficultyLevels';
import type { DifficultyLevel } from '../game/difficultyLevels';
import {
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
        this.nextSpawnAt = this.scene.time.now + ACTIVE_DIFFICULTY.spawnInterval.initial;
        this.nextEliteAt = this.scene.time.now + ACTIVE_DIFFICULTY.elite.startsAt;
    }

    public update(): void {
        this.spawnScheduledEnemies();

        if (this.scene.time.now < this.nextSpawnAt) {
            return;
        }

        const phase = this.getSpawnPhase();
        for (let index = 0; index < phase.enemiesPerSpawn; index += 1) {
            this.spawnEnemy();
        }

        const interval = this.finalBossSpawned
            ? Math.max(
                POST_FINAL_BOSS_SPAWN_MIN_INTERVAL,
                ACTIVE_DIFFICULTY.spawnInterval.minimum - Math.floor((this.scene.time.now - ACTIVE_DIFFICULTY.bosses.finalSpawnAt) / POST_FINAL_BOSS_PHASE_DURATION)
                    * POST_FINAL_BOSS_SPAWN_INTERVAL_REDUCTION,
            )
            : Math.max(
                ACTIVE_DIFFICULTY.spawnInterval.minimum,
                ACTIVE_DIFFICULTY.spawnInterval.initial - Math.floor(this.scene.time.now / 60_000)
                    * ACTIVE_DIFFICULTY.spawnInterval.reductionPerMinute,
            );
        this.nextSpawnAt = this.scene.time.now + interval;
    }

    private spawnScheduledEnemies(): void {
        while (this.scene.time.now >= this.nextEliteAt) {
            this.spawnEnemy('elite');
            this.nextEliteAt += ACTIVE_DIFFICULTY.elite.spawnInterval;
        }

        if (!this.firstBossSpawned && this.scene.time.now >= ACTIVE_DIFFICULTY.bosses.firstSpawnAt) {
            this.firstBossSpawned = true;
            this.spawnEnemy('boss');
        }

        if (!this.finalBossSpawned && this.scene.time.now >= ACTIVE_DIFFICULTY.bosses.finalSpawnAt) {
            this.finalBossSpawned = true;
            this.spawnEnemy('boss', false, { healthMultiplier: ACTIVE_DIFFICULTY.bosses.finalHealthMultiplier, isFinalBoss: true });
        }
    }

    private spawnEnemy(
        kind?: EnemyKind,
        armored?: boolean,
        options: { healthMultiplier?: number; isFinalBoss?: boolean } = {},
    ): void {
        const completedMinutes = Math.floor(this.scene.time.now / 60_000);
        const choice = kind ? { armored: armored ?? false, kind } : this.chooseEnemy(completedMinutes);
        const scaling = {
            healthMultiplier: (options.healthMultiplier ?? 1) * (1 + completedMinutes * ACTIVE_DIFFICULTY.enemyGrowth.healthPerMinute),
            isFinalBoss: options.isFinalBoss,
            speedMultiplier: 1 + completedMinutes * ACTIVE_DIFFICULTY.enemyGrowth.speedPerMinute,
        };

        for (let attempt = 0; attempt < 10; attempt += 1) {
            const x = Phaser.Math.Between(20, MAP_WIDTH - 20);
            const y = Phaser.Math.Between(20, MAP_HEIGHT - 20);

            if (Phaser.Math.Distance.Between(x, y, this.player.x, this.player.y) >= 180) {
                this.enemies.add(createEnemy(this.scene, x, y, choice.kind, choice.armored, scaling));
                return;
            }
        }

        const x = this.player.x < MAP_WIDTH / 2 ? MAP_WIDTH - 20 : 20;
        const y = this.player.y < MAP_HEIGHT / 2 ? MAP_HEIGHT - 20 : 20;
        this.enemies.add(createEnemy(this.scene, x, y, choice.kind, choice.armored, scaling));
    }

    private getSpawnPhase(): DifficultyLevel['spawnPhases'][number] {
        let phase = ACTIVE_DIFFICULTY.spawnPhases[0];

        for (const candidate of ACTIVE_DIFFICULTY.spawnPhases) {
            if (this.scene.time.now < candidate.startsAt) {
                break;
            }

            phase = candidate;
        }

        return phase;
    }

    private chooseEnemy(completedMinutes: number): { armored: boolean; kind: EnemyKind } {
        const phase = this.getSpawnPhase();
        const options = phase.weights;

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
        const armor = ACTIVE_DIFFICULTY.armor;
        const armored = phase.armored
            && canBeArmored
            && Math.random() < Math.min(
                armor.initialChance + completedMinutes * armor.chanceGrowthPerMinute,
                armor.maxChance,
            );

        return { armored, kind };
    }
}
