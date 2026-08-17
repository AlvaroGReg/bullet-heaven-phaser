export type MetaUpgradeCategory = 'baseStats' | 'characters' | 'weapons' | 'ingameUpgrades';

export type MetaUpgrade = {
    category: MetaUpgradeCategory;
    id: string;
    nameKey: string;
    descriptionKey: string;
    achievementKey: string;
    goldCost: number;
};

const STORAGE_KEY = 'bullet-heaven.meta-progress';

export const META_UPGRADES: readonly MetaUpgrade[] = [
    { category: 'baseStats', id: 'vitality', nameKey: 'meta.vitality.name', descriptionKey: 'meta.vitality.description', achievementKey: 'achievement.survivor', goldCost: 50 },
    { category: 'characters', id: 'character-ranger', nameKey: 'character.ranger', descriptionKey: 'meta.character.description', achievementKey: 'achievement.explorer', goldCost: 100 },
    { category: 'weapons', id: 'weapon-bow', nameKey: 'weapon.bow', descriptionKey: 'meta.weapon.description', achievementKey: 'achievement.hunter', goldCost: 75 },
    { category: 'weapons', id: 'weapon-crossbow', nameKey: 'weapon.crossbow', descriptionKey: 'meta.weapon.description', achievementKey: 'achievement.hunter', goldCost: 100 },
    { category: 'weapons', id: 'weapon-staff', nameKey: 'weapon.staff', descriptionKey: 'meta.weapon.description', achievementKey: 'achievement.hunter', goldCost: 125 },
    { category: 'weapons', id: 'weapon-cannon', nameKey: 'weapon.cannon', descriptionKey: 'meta.weapon.description', achievementKey: 'achievement.hunter', goldCost: 150 },
    { category: 'ingameUpgrades', id: 'camera-range', nameKey: 'meta.cameraRange.name', descriptionKey: 'meta.cameraRange.description', achievementKey: 'achievement.scout', goldCost: 60 },
    { category: 'ingameUpgrades', id: 'auto-aim', nameKey: 'meta.autoAim.name', descriptionKey: 'meta.autoAim.description', achievementKey: 'achievement.sharpshooter', goldCost: 80 },
    { category: 'ingameUpgrades', id: 'auto-fire', nameKey: 'meta.autoFire.name', descriptionKey: 'meta.autoFire.description', achievementKey: 'achievement.veteran', goldCost: 80 },
];

type StoredProgress = {
    gold: number;
};

export class MetaProgress {
    private gold = this.read().gold;

    public get currentGold(): number {
        return this.gold;
    }

    public addGold(amount: number): void {
        this.gold += amount;
        this.store();
    }

    private read(): StoredProgress {
        try {
            const savedProgress = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as Partial<StoredProgress>;
            return { gold: Number.isFinite(savedProgress.gold) ? Math.max(0, savedProgress.gold!) : 0 };
        } catch {
            return { gold: 0 };
        }
    }

    private store(): void {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ gold: this.gold }));
        } catch {
            // Gold remains available for this browser session when storage is unavailable.
        }
    }
}

export const metaProgress = new MetaProgress();
