import type { EnemyKind } from '../entities/enemyTypes';

type EnemySpawnPhase = {
    armored: boolean;
    enemiesPerSpawn: number;
    startsAt: number;
    weights: Array<{ kind: EnemyKind; weight: number }>;
};

export type DifficultyLevel = {
    armor: {
        chanceGrowthPerMinute: number;
        initialChance: number;
        maxChance: number;
    };
    bosses: {
        finalHealthMultiplier: number;
        finalSpawnAt: number;
        firstSpawnAt: number;
    };
    elite: {
        spawnInterval: number;
        startsAt: number;
    };
    enemyGrowth: {
        healthPerMinute: number;
        speedPerMinute: number;
    };
    spawnInterval: {
        initial: number;
        minimum: number;
        reductionPerMinute: number;
    };
    spawnPhases: EnemySpawnPhase[];
};

const MINUTE = 60_000;

export const DIFFICULTY_LEVELS: Record<'level-1', DifficultyLevel> = {
    'level-1': {
        armor: {
            chanceGrowthPerMinute: 0.04,
            initialChance: 0.1,
            maxChance: 0.35,
        },
        bosses: {
            finalHealthMultiplier: 2.5,
            finalSpawnAt: 10 * MINUTE,
            firstSpawnAt: 5 * MINUTE,
        },
        elite: {
            spawnInterval: 2 * MINUTE,
            startsAt: 2 * MINUTE,
        },
        enemyGrowth: {
            healthPerMinute: 0.12,
            speedPerMinute: 0.04,
        },
        spawnInterval: {
            initial: 3_000,
            minimum: 800,
            reductionPerMinute: 400,
        },
        spawnPhases: [
            { armored: false, enemiesPerSpawn: 1, startsAt: 0, weights: [{ kind: 'normal', weight: 100 }] },
            {
                armored: false,
                enemiesPerSpawn: 1,
                startsAt: MINUTE,
                weights: [
                    { kind: 'normal', weight: 75 },
                    { kind: 'fast', weight: 25 },
                ],
            },
            {
                armored: false,
                enemiesPerSpawn: 2,
                startsAt: MINUTE * 1.5,
                weights: [
                    { kind: 'normal', weight: 75 },
                    { kind: 'fast', weight: 25 },
                ],
            },
            {
                armored: false,
                enemiesPerSpawn: 2,
                startsAt: 2 * MINUTE,
                weights: [
                    { kind: 'normal', weight: 60 },
                    { kind: 'fast', weight: 25 },
                    { kind: 'ranged', weight: 15 },
                ],
            },
            {
                armored: true,
                enemiesPerSpawn: 2,
                startsAt: 3 * MINUTE,
                weights: [
                    { kind: 'normal', weight: 55 },
                    { kind: 'fast', weight: 25 },
                    { kind: 'ranged', weight: 20 },
                ],
            },
            {
                armored: true,
                enemiesPerSpawn: 3,
                startsAt: MINUTE * 3.5,
                weights: [
                    { kind: 'normal', weight: 55 },
                    { kind: 'fast', weight: 25 },
                    { kind: 'ranged', weight: 20 },
                ],
            },
            {
                armored: true,
                enemiesPerSpawn: 3,
                startsAt: 5 * MINUTE,
                weights: [
                    { kind: 'normal', weight: 45 },
                    { kind: 'fast', weight: 25 },
                    { kind: 'ranged', weight: 20 },
                    { kind: 'elite', weight: 10 },
                ],
            },
            {
                armored: true,
                enemiesPerSpawn: 3,
                startsAt: 6 * MINUTE,
                weights: [
                    { kind: 'normal', weight: 35 },
                    { kind: 'fast', weight: 25 },
                    { kind: 'heavy', weight: 10 },
                    { kind: 'ranged', weight: 20 },
                    { kind: 'elite', weight: 10 },
                ],
            },
        ],
    },
};

export const ACTIVE_DIFFICULTY = DIFFICULTY_LEVELS['level-1'];
