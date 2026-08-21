import type { WeaponKind } from '../systems/WeaponSystem';
import type { PlayerStats } from './PlayerStats';

export type MetaUpgradeCategory = 'baseStats' | 'weapons';

type MetaStat = 'damage' | 'maxHealth' | 'movementSpeed' | 'pickupRange';

export type MetaUpgrade = {
    category: MetaUpgradeCategory;
    descriptionKey: string;
    effect?: {
        amount: number;
        stat: MetaStat;
    };
    goldCosts: readonly number[];
    id: string;
    nameKey: string;
    weapon?: WeaponKind;
};

const STORAGE_KEY = 'bullet-heaven.meta-progress';

export const META_UPGRADES: readonly MetaUpgrade[] = [
    {
        category: 'baseStats',
        id: 'damage',
        nameKey: 'meta.damage.name',
        descriptionKey: 'meta.damage.description',
        effect: { stat: 'damage', amount: 0.2 },
        goldCosts: [3, 5, 8, 12, 17],
    },
    {
        category: 'baseStats',
        id: 'vitality',
        nameKey: 'meta.vitality.name',
        descriptionKey: 'meta.vitality.description',
        effect: { stat: 'maxHealth', amount: 1 },
        goldCosts: [3, 5, 8, 12, 17],
    },
    {
        category: 'baseStats',
        id: 'movement-speed',
        nameKey: 'meta.movementSpeed.name',
        descriptionKey: 'meta.movementSpeed.description',
        effect: { stat: 'movementSpeed', amount: 10 },
        goldCosts: [3, 5, 8, 12, 17],
    },
    {
        category: 'baseStats',
        id: 'pickup-range',
        nameKey: 'meta.pickupRange.name',
        descriptionKey: 'meta.pickupRange.description',
        effect: { stat: 'pickupRange', amount: 20 },
        goldCosts: [2, 4, 6, 9, 13],
    },
    { category: 'weapons', id: 'weapon-bow', nameKey: 'weapon.bow', descriptionKey: 'meta.weapon.description', goldCosts: [12], weapon: 'bow' },
    { category: 'weapons', id: 'weapon-crossbow', nameKey: 'weapon.crossbow', descriptionKey: 'meta.weapon.description', goldCosts: [18], weapon: 'crossbow' },
    { category: 'weapons', id: 'weapon-staff', nameKey: 'weapon.staff', descriptionKey: 'meta.weapon.description', goldCosts: [24], weapon: 'staff' },
    { category: 'weapons', id: 'weapon-cannon', nameKey: 'weapon.cannon', descriptionKey: 'meta.weapon.description', goldCosts: [32], weapon: 'cannon' },
];

type StoredProgress = {
    achievementProgress: Record<string, number>;
    gold: number;
    unlockedAchievements: string[];
    upgradeLevels: Record<string, number>;
};

export class MetaProgress {
    private progress = this.read();

    private gold = this.progress.gold;

    public get currentGold(): number {
        return this.gold;
    }

    public get achievementProgress(): Readonly<Record<string, number>> {
        return this.progress.achievementProgress;
    }

    public get unlockedAchievements(): readonly string[] {
        return this.progress.unlockedAchievements;
    }

    public addGold(amount: number): void {
        this.gold += amount;
        this.progress.gold = this.gold;
        this.store();
    }

    public getUnlockedWeapons(): WeaponKind[] {
        return ['dagger', ...META_UPGRADES.flatMap((upgrade) => (
            upgrade.weapon && this.isPurchased(upgrade.id) ? [upgrade.weapon] : []
        ))];
    }

    public getLevel(upgrade: MetaUpgrade): number {
        const savedLevel = this.progress.upgradeLevels[upgrade.id] ?? 0;
        return Math.min(Math.max(0, Math.floor(savedLevel)), upgrade.goldCosts.length);
    }

    public isPurchased(id: string): boolean {
        const upgrade = META_UPGRADES.find((candidate) => candidate.id === id);
        return upgrade !== undefined && this.getLevel(upgrade) === upgrade.goldCosts.length;
    }

    public getNextCost(upgrade: MetaUpgrade): number | undefined {
        return upgrade.goldCosts[this.getLevel(upgrade)];
    }

    public buy(upgrade: MetaUpgrade): boolean {
        const cost = this.getNextCost(upgrade);

        if (cost === undefined || this.gold < cost) {
            return false;
        }

        this.gold -= cost;
        this.progress.gold = this.gold;
        this.progress.upgradeLevels[upgrade.id] = this.getLevel(upgrade) + 1;
        this.store();
        return true;
    }

    public applyStatBonuses(stats: PlayerStats): void {
        META_UPGRADES.filter((upgrade) => upgrade.effect).forEach((upgrade) => {
            const effect = upgrade.effect!;
            stats[effect.stat] += effect.amount * this.getLevel(upgrade);
        });
    }

    public setAchievementProgress(id: string, progress: number): void {
        this.progress.achievementProgress[id] = progress;
        this.store();
    }

    public unlockAchievement(id: string): void {
        if (!this.progress.unlockedAchievements.includes(id)) {
            this.progress.unlockedAchievements.push(id);
            this.store();
        }
    }

    private read(): StoredProgress {
        try {
            const savedProgress = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as Partial<StoredProgress>;
            const savedLevels = savedProgress.upgradeLevels;
            const upgradeLevels = savedLevels && typeof savedLevels === 'object' && !Array.isArray(savedLevels)
                ? Object.fromEntries(Object.entries(savedLevels)
                    .filter(([, level]) => Number.isFinite(level) && level >= 0)
                    .map(([id, level]) => [id, Math.floor(level)]))
                : {};
            return {
                achievementProgress: savedProgress.achievementProgress ?? {},
                gold: Number.isFinite(savedProgress.gold) ? Math.max(0, savedProgress.gold!) : 0,
                unlockedAchievements: savedProgress.unlockedAchievements ?? [],
                upgradeLevels,
            };
        } catch {
            return { achievementProgress: {}, gold: 0, unlockedAchievements: [], upgradeLevels: {} };
        }
    }

    private store(): void {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.progress));
        } catch {
            // Gold remains available for this browser session when storage is unavailable.
        }
    }
}

export const metaProgress = new MetaProgress();
