import type { PlayerStats } from '../game/PlayerStats';

export type UpgradeRarity = {
    name: string;
    color: string;
    value: number;
    weight: number;
};

export type Upgrade = {
    name: string;
    rarity: UpgradeRarity;
    description: string;
    apply: () => void;
};

const RARITIES: UpgradeRarity[] = [
    { name: 'Comun', color: '#f8fafc', value: 1, weight: 50 },
    { name: 'Poco comun', color: '#4ade80', value: 2, weight: 25 },
    { name: 'Rara', color: '#60a5fa', value: 3, weight: 14 },
    { name: 'Epica', color: '#c084fc', value: 5, weight: 7 },
    { name: 'Legendaria', color: '#fbbf24', value: 7, weight: 3 },
    { name: 'Mitica', color: '#f87171', value: 10, weight: 1 },
];

export class UpgradeSystem {
    public constructor(private readonly stats: PlayerStats) {}

    public createChoices(count: number): Upgrade[] {
        const choices: Upgrade[] = [];
        const availableTypes = [
            () => this.createExperienceUpgrade(),
            () => this.createDamageUpgrade(),
            () => this.createAttackSpeedUpgrade(),
            () => this.createProjectileSpeedUpgrade(),
            () => this.createProjectileLifetimeUpgrade(),
            () => this.createPiercingUpgrade(),
            () => this.createMovementSpeedUpgrade(),
        ];

        while (choices.length < count && availableTypes.length > 0) {
            const index = Math.floor(Math.random() * availableTypes.length);
            const createUpgrade = availableTypes.splice(index, 1)[0];
            choices.push(createUpgrade());
        }

        return choices;
    }

    private createExperienceUpgrade(): Upgrade {
        return this.createUpgrade('Experiencia', (value) => `+${value * 10}% EXP de gemas`, (value) => {
            this.stats.experienceMultiplier += value * 0.1;
        });
    }

    private createDamageUpgrade(): Upgrade {
        return this.createUpgrade('Dano', (value) => `+${value} dano`, (value) => {
            this.stats.damage += value;
        });
    }

    private createAttackSpeedUpgrade(): Upgrade {
        return this.createUpgrade('Cadencia', (value) => `+${value * 5}% cadencia`, (value) => {
            this.stats.attackInterval = Math.max(100, this.stats.attackInterval * (1 - value * 0.05));
        });
    }

    private createProjectileSpeedUpgrade(): Upgrade {
        return this.createUpgrade('Velocidad de proyectil', (value) => `+${value * 40} velocidad`, (value) => {
            this.stats.projectileSpeed += value * 40;
        });
    }

    private createProjectileLifetimeUpgrade(): Upgrade {
        return this.createUpgrade('Vida de proyectil', (value) => `+${value * 100} ms`, (value) => {
            this.stats.projectileLifetime += value * 100;
        });
    }

    private createPiercingUpgrade(): Upgrade {
        return this.createUpgrade('Perforacion', (value) => `+${Math.ceil(value / 2)} enemigos`, (value) => {
            this.stats.projectilePiercing += Math.ceil(value / 2);
        });
    }

    private createMovementSpeedUpgrade(): Upgrade {
        return this.createUpgrade('Velocidad de movimiento', (value) => `+${value * 12} velocidad`, (value) => {
            this.stats.movementSpeed += value * 12;
        });
    }

    private createUpgrade(
        name: string,
        getDescription: (value: number) => string,
        apply: (value: number) => void,
    ): Upgrade {
        const rarity = this.chooseRarity();

        return {
            name,
            rarity,
            description: getDescription(rarity.value),
            apply: () => apply(rarity.value),
        };
    }

    private chooseRarity(): UpgradeRarity {
        const roll = Math.random() * RARITIES.reduce((total, rarity) => total + rarity.weight, 0);
        let threshold = 0;

        for (const rarity of RARITIES) {
            threshold += rarity.weight;

            if (roll < threshold) {
                return rarity;
            }
        }

        return RARITIES[0];
    }
}
