import { PLAYER_INITIAL_STATS } from './constants';

export class PlayerStats {
    public damage = 1;

    public attackSpeedMultiplier = 1;

    public projectileSpeedBonus = 0;

    public projectileLifetimeBonus = 0;

    public projectilePiercing = 0;

    public movementSpeed = PLAYER_INITIAL_STATS.movementSpeed;

    public experienceMultiplier = 1;

    public maxHealth = PLAYER_INITIAL_STATS.maxHealth;

    public healthRegeneration = 0;

    public pickupRange = 0;
}
