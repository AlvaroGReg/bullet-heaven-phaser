import type { PlayerStats } from '../game/PlayerStats';
import { UPGRADE_RARITIES } from '../game/constants';
import { i18n } from '../i18n';
import type { WeaponKind, WeaponSystem } from './WeaponSystem';

export type UpgradeRarity = (typeof UPGRADE_RARITIES)[number];

export type UpgradeType =
    | 'experience'
    | 'damage'
    | 'attackSpeed'
    | 'projectileSpeed'
    | 'projectileLifetime'
    | 'piercing'
    | 'movementSpeed'
    | 'health'
    | 'regeneration'
    | 'pickupRange'
    | 'weapon';

export type Upgrade = {
    name: string;
    rarity: UpgradeRarity;
    type: UpgradeType;
    description: string;
    apply: () => void;
};

export class UpgradeSystem {
    private readonly upgradeCounts: Record<UpgradeType, number> = {
        experience: 0,
        damage: 0,
        attackSpeed: 0,
        projectileSpeed: 0,
        projectileLifetime: 0,
        piercing: 0,
        movementSpeed: 0,
        health: 0,
        regeneration: 0,
        pickupRange: 0,
        weapon: 0,
    };

    public constructor(
        private readonly stats: PlayerStats,
        private readonly increaseMaxHealth: (amount: number) => void,
        private readonly weapons: WeaponSystem,
    ) {}

    public createChoices(count: number, level: number): Upgrade[] {
        const choices: Upgrade[] = [];
        const availableTypes = [
            () => this.createExperienceUpgrade(level),
            () => this.createDamageUpgrade(level),
            () => this.createAttackSpeedUpgrade(level),
            () => this.createProjectileSpeedUpgrade(level),
            () => this.createProjectileLifetimeUpgrade(level),
            () => this.createPiercingUpgrade(level),
            () => this.createMovementSpeedUpgrade(level),
            () => this.createHealthUpgrade(level),
            () => this.createRegenerationUpgrade(level),
            () => this.createPickupRangeUpgrade(level),
        ];

        if (this.weapons.hasFreeSlot && this.weapons.availableWeapons.length > 0) {
            availableTypes.push(() => this.createWeaponUpgrade());
        }

        while (choices.length < count && availableTypes.length > 0) {
            const index = Math.floor(Math.random() * availableTypes.length);
            const createUpgrade = availableTypes.splice(index, 1)[0];
            choices.push(createUpgrade());
        }

        return choices;
    }

    private createExperienceUpgrade(level: number): Upgrade {
        return this.createUpgrade('experience', 'upgrade.experience.name', level, (value) => i18n.t('upgrade.experience.description', { value: value * 10 }), (value) => {
            this.stats.experienceMultiplier += value * 0.1;
        });
    }

    private createDamageUpgrade(level: number): Upgrade {
        return this.createUpgrade('damage', 'upgrade.damage.name', level, (value) => i18n.t('upgrade.damage.description', { value }), (value) => {
            this.stats.damage += value;
        });
    }

    private createAttackSpeedUpgrade(level: number): Upgrade {
        return this.createUpgrade('attackSpeed', 'upgrade.attackSpeed.name', level, (value) => i18n.t('upgrade.attackSpeed.description', { value: value * 5 }), (value) => {
            this.stats.attackSpeedMultiplier += value * 0.05;
        });
    }

    private createProjectileSpeedUpgrade(level: number): Upgrade {
        return this.createUpgrade('projectileSpeed', 'upgrade.projectileSpeed.name', level, (value) => i18n.t('upgrade.projectileSpeed.description', { value: value * 40 }), (value) => {
            this.stats.projectileSpeedBonus += value * 40;
        });
    }

    private createProjectileLifetimeUpgrade(level: number): Upgrade {
        return this.createUpgrade('projectileLifetime', 'upgrade.projectileLifetime.name', level, (value) => i18n.t('upgrade.projectileLifetime.description', { value: value * 100 }), (value) => {
            this.stats.projectileLifetimeBonus += value * 100;
        });
    }

    private createPiercingUpgrade(level: number): Upgrade {
        return this.createUpgrade('piercing', 'upgrade.piercing.name', level, (value) => i18n.t('upgrade.piercing.description', { value: Math.ceil(value / 2) }), (value) => {
            this.stats.projectilePiercing += Math.ceil(value / 2);
        });
    }

    private createMovementSpeedUpgrade(level: number): Upgrade {
        return this.createUpgrade('movementSpeed', 'upgrade.movementSpeed.name', level, (value) => i18n.t('upgrade.movementSpeed.description', { value: value * 12 }), (value) => {
            this.stats.movementSpeed += value * 12;
        });
    }

    private createHealthUpgrade(level: number): Upgrade {
        return this.createUpgrade('health', 'upgrade.health.name', level, (value) => i18n.t('upgrade.health.description', { value }), (value) => {
            this.increaseMaxHealth(value);
        });
    }

    private createRegenerationUpgrade(level: number): Upgrade {
        return this.createUpgrade('regeneration', 'upgrade.regeneration.name', level, (value) => i18n.t('upgrade.regeneration.description', { value: (value * 0.1).toFixed(1) }), (value) => {
            this.stats.healthRegeneration += value * 0.1;
        });
    }

    private createPickupRangeUpgrade(level: number): Upgrade {
        return this.createUpgrade('pickupRange', 'upgrade.pickupRange.name', level, (value) => i18n.t('upgrade.pickupRange.description', { value: value * 20 }), (value) => {
            this.stats.pickupRange += value * 20;
        });
    }

    private createWeaponUpgrade(): Upgrade {
        const availableWeapons = this.weapons.availableWeapons;
        const weapon = availableWeapons[Math.floor(Math.random() * availableWeapons.length)];

        return this.createFixedUpgrade(
            'weapon',
            this.getWeaponName(weapon),
            'epic',
            i18n.t('upgrade.weapon.description'),
            () => this.weapons.equipWeapon(weapon),
        );
    }

    private createUpgrade(
        type: UpgradeType,
        nameKey: string,
        level: number,
        getDescription: (value: number) => string,
        apply: (value: number) => void,
    ): Upgrade {
        const rarity = this.chooseRarity(type, level);

        return {
            name: i18n.t(nameKey),
            rarity,
            type,
            description: getDescription(rarity.value),
            apply: () => {
                apply(rarity.value);
                this.upgradeCounts[type] += 1;
            },
        };
    }

    private createFixedUpgrade(
        type: UpgradeType,
        name: string,
        rarityId: string,
        description: string,
        apply: () => boolean,
    ): Upgrade {
        const rarity = UPGRADE_RARITIES.find((candidate) => candidate.id === rarityId)!;

        return {
            name,
            rarity,
            type,
            description,
            apply: () => {
                if (apply()) {
                    this.upgradeCounts[type] += 1;
                }
            },
        };
    }

    private getWeaponName(weapon: WeaponKind): string {
        return i18n.t(`weapon.${weapon}`);
    }

    private chooseRarity(type: UpgradeType, level: number): UpgradeRarity {
        const weights = UPGRADE_RARITIES.map((rarity) => Math.max(
            0.01,
            rarity.initialWeight
                + (level - 1) * rarity.levelWeightIncrease
                + this.upgradeCounts[type] * rarity.typeWeightIncrease,
        ));
        const roll = Math.random() * weights.reduce((total, weight) => total + weight, 0);
        let threshold = 0;

        for (const [index, rarity] of UPGRADE_RARITIES.entries()) {
            threshold += weights[index];

            if (roll < threshold) {
                return rarity;
            }
        }

        return UPGRADE_RARITIES[0];
    }
}
