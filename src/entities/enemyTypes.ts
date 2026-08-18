export type EnemyKind = 'normal' | 'fast' | 'heavy' | 'elite' | 'boss' | 'ranged';

export type EnemyDefinition = {
    color: number;
    damage: number;
    goldDropChance: number;
    experienceMultiplier: number;
    health: number;
    grantsFullLevel?: boolean;
    radius: number;
    speed: number;
    ranged?: {
        attackInterval: number;
        attackRange: number;
        projectileSpeed: number;
    };
};

export const ENEMY_DEFINITIONS: Record<EnemyKind, EnemyDefinition> = {
    normal: {
        color: 0xf07178,
        damage: 1,
        goldDropChance: 0.08,
        experienceMultiplier: 1,
        health: 6,
        radius: 20,
        speed: 120,
    },
    fast: {
        color: 0xfbbf24,
        damage: 0.5,
        goldDropChance: 0.06,
        experienceMultiplier: 1.2,
        health: 3,
        radius: 16,
        speed: 200,
    },
    heavy: {
        color: 0xa78bfa,
        damage: 2,
        goldDropChance: 0.18,
        experienceMultiplier: 2,
        health: 18,
        radius: 30,
        speed: 75,
    },
    elite: {
        color: 0x38bdf8,
        damage: 2.5,
        goldDropChance: 0.28,
        experienceMultiplier: 3,
        health: 15,
        radius: 20,
        speed: 170,
    },
    boss: {
        color: 0xef4444,
        damage: 4,
        goldDropChance: 1,
        experienceMultiplier: 1,
        grantsFullLevel: true,
        health: 60,
        radius: 48,
        speed: 220,
    },
    ranged: {
        color: 0xf97316,
        damage: 0.75,
        goldDropChance: 0.1,
        experienceMultiplier: 1.2,
        health: 6,
        radius: 20,
        speed: 110,
        ranged: {
            attackInterval: 1400,
            attackRange: 420,
            projectileSpeed: 320,
        },
    },
};
