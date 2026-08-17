export const MAP_WIDTH = 2560;
export const MAP_HEIGHT = 1600;
export const ENEMY_SPEED = 120;

type PlayerInitialStats = {
    maxHealth: number;
    movementSpeed: number;
};

// These are the only base attributes defined by the player.
export const PLAYER_INITIAL_STATS: PlayerInitialStats = {
    maxHealth: 5,
    movementSpeed: 180,
};

export const ENEMY_MAX_HEALTH = 6;
export const ENEMY_DAMAGE_COOLDOWN = 700;
export const ENEMY_SPAWN_PHASE_DURATION = 60_000;
export const ELITE_SPAWN_START_TIME = 2 * ENEMY_SPAWN_PHASE_DURATION;
export const ELITE_SPAWN_INTERVAL = 75_000;
export const ENEMY_HEALTH_GROWTH_PER_PHASE = 0.12;
export const ENEMY_SPEED_GROWTH_PER_PHASE = 0.04;
export const FIRST_BOSS_TIME = 5 * 60_000;
export const FINAL_BOSS_TIME = 10 * 60_000;
export const POST_FINAL_BOSS_PHASE_DURATION = 30_000;
export const POST_FINAL_BOSS_SPAWN_INTERVAL_REDUCTION = 75;
export const POST_FINAL_BOSS_SPAWN_MIN_INTERVAL = 300;
export const ENEMY_SPAWN_INITIAL_INTERVAL = 3_000;
export const ENEMY_SPAWN_INTERVAL_REDUCTION = 400;
export const ENEMY_SPAWN_MIN_INTERVAL = 800;
export const EXPERIENCE_PER_GEM = 1;
export const EXPERIENCE_TO_LEVEL = 5;
export const EXPERIENCE_LEVEL_GROWTH = 1.25;
export const CONTROLLER_DEAD_ZONE = 0.2;
export const UPGRADE_RARITIES = [
    { id: 'common', color: '#f8fafc', value: 1, initialWeight: 92, levelWeightIncrease: -2, typeWeightIncrease: -4 },
    { id: 'uncommon', color: '#4ade80', value: 2, initialWeight: 7, levelWeightIncrease: 1, typeWeightIncrease: 2 },
    { id: 'rare', color: '#60a5fa', value: 3, initialWeight: 0.8, levelWeightIncrease: 0.35, typeWeightIncrease: 0.8 },
    { id: 'epic', color: '#c084fc', value: 5, initialWeight: 0.15, levelWeightIncrease: 0.1, typeWeightIncrease: 0.25 },
    { id: 'legendary', color: '#fbbf24', value: 7, initialWeight: 0.04, levelWeightIncrease: 0.035, typeWeightIncrease: 0.1 },
    { id: 'mythic', color: '#f87171', value: 10, initialWeight: 0.01, levelWeightIncrease: 0.01, typeWeightIncrease: 0.03 },
] as const;
