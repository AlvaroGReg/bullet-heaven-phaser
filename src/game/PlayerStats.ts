import {
    AUTO_ATTACK_INTERVAL,
    PLAYER_SPEED,
    PROJECTILE_LIFETIME,
    PROJECTILE_PIERCING,
    PROJECTILE_SPEED,
} from './constants';

export class PlayerStats {
    public damage = 1;

    public attackInterval = AUTO_ATTACK_INTERVAL;

    public projectileSpeed = PROJECTILE_SPEED;

    public projectileLifetime = PROJECTILE_LIFETIME;

    public projectilePiercing = PROJECTILE_PIERCING;

    public movementSpeed = PLAYER_SPEED;

    public experienceMultiplier = 1;
}
