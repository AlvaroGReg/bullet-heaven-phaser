import type { EnemyKind } from '../entities/enemyTypes';
import type { PlayerStats } from './PlayerStats';
import { metaProgress } from './MetaProgress';
import type { WeaponKind } from '../systems/WeaponSystem';

export type AchievementMetric =
    | 'damageTaken'
    | 'deaths'
    | 'finalBossBefore'
    | 'gameCompleted'
    | 'gameCompletedLowHealth'
    | 'killsWithoutDamage'
    | 'kills'
    | 'killsByEnemy'
    | 'killsByWeapon'
    | 'playTime'
    | 'stat'
    | 'survivalWithoutUpgrades'
    | 'survivalRun'
    | 'survivalTotal'
    | 'weaponsEquipped'
    | 'areaImpactKills'
    | 'coinsRun'
    | 'level';

export type AchievementDefinition = {
    enemyKind?: EnemyKind;
    deadlineSeconds?: number;
    healthThreshold?: number;
    id: string;
    metric: AchievementMetric;
    stat?: keyof PlayerStats;
    target: number;
    weapon?: WeaponKind;
};

export const JOURNAL_ENEMY_MILESTONES = [1, 10, 50, 100] as const;
export const JOURNAL_WEAPON_MILESTONES = [5, 25, 100] as const;

const JOURNAL_ENEMIES: readonly EnemyKind[] = ['normal', 'fast', 'heavy', 'elite', 'boss', 'ranged'];
const JOURNAL_WEAPONS: readonly WeaponKind[] = ['dagger', 'bow', 'crossbow', 'staff', 'cannon'];

export function getJournalEnemyAchievementId(enemy: EnemyKind, target: number): string {
    return `journal-enemy-${enemy}-${target}`;
}

export function getJournalWeaponAchievementId(weapon: WeaponKind, target: number): string {
    return `journal-weapon-${weapon}-${target}`;
}

export const ACHIEVEMENTS: readonly AchievementDefinition[] = [
    { id: 'survive-run-5', metric: 'survivalRun', target: 5 * 60 },
    { id: 'survive-run-15', metric: 'survivalRun', target: 15 * 60 },
    { id: 'survive-run-30', metric: 'survivalRun', target: 30 * 60 },
    { id: 'survive-total-30', metric: 'survivalTotal', target: 30 * 60 },
    { id: 'survive-total-120', metric: 'survivalTotal', target: 2 * 60 * 60 },
    { id: 'survive-total-600', metric: 'survivalTotal', target: 10 * 60 * 60 },
    { id: 'deaths-1', metric: 'deaths', target: 1 },
    { id: 'deaths-10', metric: 'deaths', target: 10 },
    { id: 'deaths-50', metric: 'deaths', target: 50 },
    { id: 'kills-100', metric: 'kills', target: 100 },
    { id: 'kills-1000', metric: 'kills', target: 1000 },
    { id: 'kills-10000', metric: 'kills', target: 10000 },
    { id: 'kills-normal-500', metric: 'killsByEnemy', enemyKind: 'normal', target: 500 },
    { id: 'kills-fast-250', metric: 'killsByEnemy', enemyKind: 'fast', target: 250 },
    { id: 'kills-heavy-150', metric: 'killsByEnemy', enemyKind: 'heavy', target: 150 },
    { id: 'kills-elite-100', metric: 'killsByEnemy', enemyKind: 'elite', target: 100 },
    { id: 'kills-boss-10', metric: 'killsByEnemy', enemyKind: 'boss', target: 10 },
    { id: 'kills-ranged-250', metric: 'killsByEnemy', enemyKind: 'ranged', target: 250 },
    ...JOURNAL_ENEMIES.flatMap((enemyKind) => JOURNAL_ENEMY_MILESTONES.map((target) => ({
        id: getJournalEnemyAchievementId(enemyKind, target),
        metric: 'killsByEnemy' as const,
        enemyKind,
        target,
    }))),
    { id: 'kills-dagger-200', metric: 'killsByWeapon', target: 200, weapon: 'dagger' },
    { id: 'kills-bow-500', metric: 'killsByWeapon', target: 500, weapon: 'bow' },
    { id: 'kills-crossbow-500', metric: 'killsByWeapon', target: 500, weapon: 'crossbow' },
    { id: 'kills-staff-500', metric: 'killsByWeapon', target: 500, weapon: 'staff' },
    { id: 'kills-cannon-250', metric: 'killsByWeapon', target: 250, weapon: 'cannon' },
    ...JOURNAL_WEAPONS.flatMap((weapon) => JOURNAL_WEAPON_MILESTONES.map((target) => ({
        id: getJournalWeaponAchievementId(weapon, target),
        metric: 'killsByWeapon' as const,
        target,
        weapon,
    }))),
    { id: 'damage-taken-100', metric: 'damageTaken', target: 100 },
    { id: 'damage-taken-1000', metric: 'damageTaken', target: 1000 },
    { id: 'damage-taken-10000', metric: 'damageTaken', target: 10000 },
    { id: 'stat-damage-10', metric: 'stat', stat: 'damage', target: 10 },
    { id: 'stat-health-25', metric: 'stat', stat: 'maxHealth', target: 25 },
    { id: 'stat-speed-400', metric: 'stat', stat: 'movementSpeed', target: 400 },
    { id: 'stat-pickup-200', metric: 'stat', stat: 'pickupRange', target: 200 },
    { id: 'complete-normal', metric: 'gameCompleted', target: 1 },
    { id: 'play-time-60', metric: 'playTime', target: 60 * 60 },
    { id: 'play-time-600', metric: 'playTime', target: 10 * 60 * 60 },
    { id: 'play-time-3000', metric: 'playTime', target: 50 * 60 * 60 },
    { id: 'kills-without-damage-25', metric: 'killsWithoutDamage', target: 25 },
    { id: 'kills-without-damage-100', metric: 'killsWithoutDamage', target: 100 },
    { id: 'survive-without-upgrades-120', metric: 'survivalWithoutUpgrades', target: 2 * 60 },
    { id: 'survive-without-upgrades-300', metric: 'survivalWithoutUpgrades', target: 5 * 60 },
    { id: 'level-10', metric: 'level', target: 10 },
    { id: 'level-25', metric: 'level', target: 25 },
    { id: 'level-50', metric: 'level', target: 50 },
    { id: 'weapons-equipped-2', metric: 'weaponsEquipped', target: 2 },
    { id: 'weapons-equipped-4', metric: 'weaponsEquipped', target: 4 },
    { id: 'area-impact-kills-3', metric: 'areaImpactKills', target: 3 },
    { id: 'area-impact-kills-5', metric: 'areaImpactKills', target: 5 },
    { id: 'coins-run-25', metric: 'coinsRun', target: 25 },
    { id: 'coins-run-100', metric: 'coinsRun', target: 100 },
    { id: 'final-boss-before-11', metric: 'finalBossBefore', deadlineSeconds: 11 * 60, target: 1 },
    { id: 'final-boss-before-1030', metric: 'finalBossBefore', deadlineSeconds: 10 * 60 + 30, target: 1 },
    { id: 'final-boss-before-1020', metric: 'finalBossBefore', deadlineSeconds: 10 * 60 + 20, target: 1 },
    { id: 'final-boss-before-1010', metric: 'finalBossBefore', deadlineSeconds: 10 * 60 + 10, target: 1 },
    { id: 'final-boss-before-1005', metric: 'finalBossBefore', deadlineSeconds: 10 * 60 + 5, target: 1 },
    { id: 'victory-under-2-health', metric: 'gameCompletedLowHealth', healthThreshold: 2, target: 1 },
    { id: 'victory-under-5-health', metric: 'gameCompletedLowHealth', healthThreshold: 5, target: 1 },
];

export class AchievementSystem {
    private elapsedMilliseconds = 0;

    private runSurvivalSeconds = 0;

    private killsSinceDamage = 0;

    private coinsCollected = 0;

    private upgradesSelected = false;

    public constructor() {
        ACHIEVEMENTS.filter((achievement) => (
            achievement.metric === 'survivalRun'
            || achievement.metric === 'survivalWithoutUpgrades'
            || achievement.metric === 'killsWithoutDamage'
            || achievement.metric === 'weaponsEquipped'
            || achievement.metric === 'coinsRun'
        )).forEach((achievement) => {
            if (!metaProgress.unlockedAchievements.includes(achievement.id)) {
                metaProgress.setAchievementProgress(achievement.id, 0);
            }
        });
    }

    public update(delta: number): void {
        this.elapsedMilliseconds += delta;
        const elapsedSeconds = Math.floor(this.elapsedMilliseconds / 1000);

        if (elapsedSeconds === 0) {
            return;
        }

        this.elapsedMilliseconds -= elapsedSeconds * 1000;
        this.runSurvivalSeconds += elapsedSeconds;
        this.record('survivalRun', this.runSurvivalSeconds, true);
        if (!this.upgradesSelected) {
            this.record('survivalWithoutUpgrades', this.runSurvivalSeconds, true);
        }
        this.record('survivalTotal', elapsedSeconds);
        this.record('playTime', elapsedSeconds);
    }

    public recordDeath(): void {
        this.record('deaths', 1);
    }

    public recordDamageTaken(amount: number): void {
        this.killsSinceDamage = 0;
        this.record('killsWithoutDamage', 0, true);
        this.record('damageTaken', amount);
    }

    public recordKill(enemyKind: EnemyKind, weapon: WeaponKind): void {
        this.record('kills', 1);
        this.killsSinceDamage += 1;
        this.record('killsWithoutDamage', this.killsSinceDamage, true);
        this.record('killsByEnemy', 1, false, { enemyKind });
        this.record('killsByWeapon', 1, false, { weapon });
    }

    public recordStats(stats: PlayerStats): void {
        ACHIEVEMENTS.filter((achievement) => achievement.metric === 'stat').forEach((achievement) => {
            this.setProgress(achievement, stats[achievement.stat!]);
        });
    }

    public recordAreaImpact(kills: number): void {
        ACHIEVEMENTS.filter((achievement) => achievement.metric === 'areaImpactKills').forEach((achievement) => {
            const currentBest = metaProgress.achievementProgress[achievement.id] ?? 0;
            this.setProgress(achievement, Math.max(currentBest, kills));
        });
    }

    public recordCoinCollected(amount: number): void {
        this.coinsCollected += amount;
        this.record('coinsRun', this.coinsCollected, true);
    }

    public recordLevel(level: number): void {
        this.record('level', level, true);
    }

    public recordUpgradeSelected(): void {
        this.upgradesSelected = true;
        this.record('survivalWithoutUpgrades', 0, true);
    }

    public recordWeaponsEquipped(count: number): void {
        this.record('weaponsEquipped', count, true);
    }

    public recordVictory(finalBossDefeatedAt: number, health: number): void {
        this.record('gameCompleted', 1);
        ACHIEVEMENTS.filter((achievement) => achievement.metric === 'finalBossBefore').forEach((achievement) => {
            if (finalBossDefeatedAt <= achievement.deadlineSeconds!) {
                this.setProgress(achievement, 1);
            }
        });
        ACHIEVEMENTS.filter((achievement) => achievement.metric === 'gameCompletedLowHealth').forEach((achievement) => {
            if (health < achievement.healthThreshold!) {
                this.setProgress(achievement, 1);
            }
        });
    }

    private record(metric: AchievementMetric, amount: number, replaceProgress = false, filters: Partial<AchievementDefinition> = {}): void {
        ACHIEVEMENTS.filter((achievement) => (
            achievement.metric === metric
            && (!filters.enemyKind || achievement.enemyKind === filters.enemyKind)
            && (!filters.weapon || achievement.weapon === filters.weapon)
        )).forEach((achievement) => {
            const progress = replaceProgress ? amount : (metaProgress.achievementProgress[achievement.id] ?? 0) + amount;
            this.setProgress(achievement, progress);
        });
    }

    private setProgress(achievement: AchievementDefinition, progress: number): void {
        if (metaProgress.unlockedAchievements.includes(achievement.id)) {
            return;
        }

        metaProgress.setAchievementProgress(achievement.id, Math.min(progress, achievement.target));
        if (progress >= achievement.target) {
            metaProgress.unlockAchievement(achievement.id);
        }
    }
}
