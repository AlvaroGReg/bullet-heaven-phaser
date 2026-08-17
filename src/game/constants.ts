export const MAP_WIDTH = 2560;
export const MAP_HEIGHT = 1600;
export const PLAYER_SPEED = 280;
export const ENEMY_SPEED = 120;
export const PROJECTILE_SPEED = 540;
export const PROJECTILE_LIFETIME = 1200;
export const PROJECTILE_PIERCING = 0;
export const AUTO_ATTACK_INTERVAL = 500;
export const PLAYER_MAX_HEALTH = 5;
export const ENEMY_MAX_HEALTH = 6;
export const ENEMY_DAMAGE_COOLDOWN = 700;
export const ENEMY_SPAWN_PHASE_DURATION = 60_000;
export const ENEMY_SPAWN_INITIAL_INTERVAL = 3_000;
export const ENEMY_SPAWN_INTERVAL_REDUCTION = 400;
export const ENEMY_SPAWN_MIN_INTERVAL = 800;
export const EXPERIENCE_PER_GEM = 1;
export const EXPERIENCE_TO_LEVEL = 5;
export const EXPERIENCE_LEVEL_GROWTH = 1.25;
export const CONTROLLER_DEAD_ZONE = 0.2;
export const UPGRADE_RARITIES = [
    { name: 'Comun', color: '#f8fafc', value: 1, initialWeight: 92, levelWeightIncrease: -2, typeWeightIncrease: -4 },
    { name: 'Poco comun', color: '#4ade80', value: 2, initialWeight: 7, levelWeightIncrease: 1, typeWeightIncrease: 2 },
    { name: 'Rara', color: '#60a5fa', value: 3, initialWeight: 0.8, levelWeightIncrease: 0.35, typeWeightIncrease: 0.8 },
    { name: 'Epica', color: '#c084fc', value: 5, initialWeight: 0.15, levelWeightIncrease: 0.1, typeWeightIncrease: 0.25 },
    { name: 'Legendaria', color: '#fbbf24', value: 7, initialWeight: 0.04, levelWeightIncrease: 0.035, typeWeightIncrease: 0.1 },
    { name: 'Mitica', color: '#f87171', value: 10, initialWeight: 0.01, levelWeightIncrease: 0.01, typeWeightIncrease: 0.03 },
] as const;
