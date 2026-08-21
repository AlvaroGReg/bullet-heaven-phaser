import Phaser from 'phaser';
import { ENEMY_DEFINITIONS } from '../entities/enemyTypes';
import type { EnemyKind } from '../entities/enemyTypes';
import { isDeveloperRoute } from '../game/devMode';
import {
    getJournalEnemyAchievementId,
    getJournalWeaponAchievementId,
    JOURNAL_ENEMY_MILESTONES,
    JOURNAL_WEAPON_MILESTONES,
} from '../game/Achievements';
import { metaProgress } from '../game/MetaProgress';
import { i18n } from '../i18n';
import { ENEMY_TEXTURES } from '../sprites/enemies';
import { DAGGER_TEXTURE } from '../sprites/rogue';
import { WEAPON_TEXTURES } from '../sprites/weapons';
import { WEAPON_DEFINITIONS } from '../systems/WeaponSystem';
import type { WeaponKind } from '../systems/WeaponSystem';
import { createButton, createPanelBorder, createRuleMark, GRIM, grimHeadingStyle, grimTextStyle } from './grimTheme';

export type JournalTab = 'cheats' | 'monsters' | 'weapons';

export type JournalDeveloperControls = {
    gameSpeed: number;
    invulnerable: boolean;
    onGameSpeedChange: (speed: number) => void;
    onInvulnerabilityChange: (invulnerable: boolean) => void;
};

type JournalCallbacks = {
    developerControls?: JournalDeveloperControls;
    onClose: () => void;
    onTabChange: (tab: JournalTab) => void;
};

type AddObject = (gameObject: Phaser.GameObjects.GameObject) => void;

const WEAPONS: readonly WeaponKind[] = ['dagger', 'bow', 'crossbow', 'staff', 'cannon'];
const MONSTERS: readonly EnemyKind[] = ['normal', 'fast', 'heavy', 'elite', 'ranged', 'boss'];

export function renderJournal(
    scene: Phaser.Scene,
    tab: JournalTab,
    addObject: AddObject,
    callbacks: JournalCallbacks,
): void {
    const centerX = scene.scale.width / 2;
    const title = scene.add.text(centerX, 62, i18n.t('journal.title').toUpperCase(), {
        ...grimHeadingStyle(GRIM.text, '40px'),
    }).setOrigin(0.5);
    addObject(createRuleMark(scene, centerX, 16));
    addObject(title);

    const tabs: JournalTab[] = callbacks.developerControls ? ['weapons', 'monsters', 'cheats'] : ['weapons', 'monsters'];
    tabs.forEach((candidate, index) => {
        const button = createButton(
            scene,
            centerX + (index - (tabs.length - 1) / 2) * 180,
            125,
            i18n.t(`journal.tab.${candidate}`),
            candidate === tab ? 'primary' : 'secondary',
            '18px',
        );
        button.on(Phaser.Input.Events.POINTER_DOWN, () => callbacks.onTabChange(candidate));
        addObject(button);
    });

    if (tab === 'cheats' && callbacks.developerControls) {
        renderCheatPanel(scene, callbacks.developerControls, addObject);
    } else if (tab === 'weapons') {
        const weapons = isDeveloperRoute ? WEAPONS : WEAPONS.filter((weapon) => metaProgress.getUnlockedWeapons().includes(weapon));
        if (weapons.length === 0) {
            renderEmptyState(scene, tab, addObject);
        }
        weapons.forEach((weapon, index) => renderWeaponCard(scene, weapon, index, addObject));
    } else {
        const monsters = isDeveloperRoute ? MONSTERS : MONSTERS.filter((monster) => getEnemyKills(monster) > 0);
        if (monsters.length === 0) {
            renderEmptyState(scene, tab, addObject);
        }
        monsters.forEach((monster, index) => renderMonsterCard(scene, monster, index, addObject));
    }

    const close = createButton(scene, centerX, 675, i18n.t('menu.back'), 'secondary', '18px');
    close.on(Phaser.Input.Events.POINTER_DOWN, callbacks.onClose);
    addObject(close);
}

function renderWeaponCard(scene: Phaser.Scene, weapon: WeaponKind, index: number, addObject: AddObject): void {
    const { x, y } = getCardPosition(scene, index);
    const definition = WEAPON_DEFINITIONS[weapon];
    const texture = weapon === 'dagger' ? DAGGER_TEXTURE : WEAPON_TEXTURES[weapon];
    const kills = getWeaponKills(weapon);
    const informationLevel = isDeveloperRoute
        ? JOURNAL_WEAPON_MILESTONES.length
        : getInformationLevel(kills, JOURNAL_WEAPON_MILESTONES);
    const area = definition.areaRadius > 0
        ? i18n.t('journal.weapon.area', { radius: definition.areaRadius })
        : '';
    const details = i18n.t('journal.weapon.stats', {
        area,
        damage: definition.damage,
        interval: (definition.attackInterval / 1000).toFixed(1),
        piercing: definition.piercing,
        speed: definition.projectileSpeed,
    });

    addObject(createPanelBorder(scene, x, y, 560, 126));
    addObject(scene.add.image(x - 225, y, texture));
    addObject(scene.add.text(x - 170, y - 48, i18n.t(`weapon.${weapon}`), {
        ...grimHeadingStyle(GRIM.accentText, '20px', 1),
    }).setOrigin(0, 0.5));
    const description = informationLevel >= 1
        ? i18n.t(`journal.weapon.${weapon}`)
        : i18n.t('journal.weapon.unknown');
    const characteristics = informationLevel === 2
        ? i18n.t('journal.weapon.general', {
            cadence: getCadenceTier(definition.attackInterval),
            damage: getPowerTier(definition.damage),
            speed: getSpeedTier(definition.projectileSpeed),
        })
        : informationLevel >= 3 ? details : getProgressLabel(kills);

    addObject(scene.add.text(x - 170, y - 17, description, {
        ...grimTextStyle(GRIM.text, '15px'),
        wordWrap: { width: 410 },
    }).setOrigin(0, 0.5));
    addObject(scene.add.text(x - 170, y + 28, characteristics, {
        ...grimTextStyle(GRIM.mutedText, '14px'),
        wordWrap: { width: 410 },
    }).setOrigin(0, 0.5));
}

function renderMonsterCard(scene: Phaser.Scene, monster: EnemyKind, index: number, addObject: AddObject): void {
    const { x, y } = getCardPosition(scene, index);
    const definition = ENEMY_DEFINITIONS[monster];
    const kills = getEnemyKills(monster);
    const informationLevel = isDeveloperRoute
        ? JOURNAL_ENEMY_MILESTONES.length
        : getInformationLevel(kills, JOURNAL_ENEMY_MILESTONES);
    const hasArmoredVariant = monster === 'normal' || monster === 'heavy' || monster === 'elite';
    const ranged = definition.ranged
        ? i18n.t('journal.monster.rangedStats', {
            interval: (definition.ranged.attackInterval / 1000).toFixed(1),
            range: definition.ranged.attackRange,
        })
        : '';
    const details = i18n.t('journal.monster.stats', {
        damage: definition.damage,
        experience: definition.experienceMultiplier,
        gold: Math.round(definition.goldDropChance * 100),
        health: definition.health,
        ranged,
        speed: definition.speed,
    });
    const description = informationLevel >= 2
        ? i18n.t(`journal.monster.${monster}`)
            + (hasArmoredVariant ? ` ${i18n.t('journal.monster.armored')}` : '')
        : i18n.t('journal.monster.unknown');
    const characteristics = informationLevel === 3
        ? i18n.t('journal.monster.general', {
            damage: getPowerTier(definition.damage),
            health: getPowerTier(definition.health / 3),
            speed: getSpeedTier(definition.speed),
        })
        : informationLevel >= 4 ? details : getProgressLabel(kills);

    addObject(createPanelBorder(scene, x, y, 560, 126));
    addObject(scene.add.image(x - 225, y, ENEMY_TEXTURES[monster]));
    addObject(scene.add.text(x - 170, y - 48, i18n.t(`journal.monster.${monster}.name`), {
        ...grimHeadingStyle(GRIM.accentText, '20px', 1),
    }).setOrigin(0, 0.5));
    addObject(scene.add.text(x - 170, y - 17, description, {
        ...grimTextStyle(GRIM.text, '15px'),
        wordWrap: { width: 410 },
    }).setOrigin(0, 0.5));
    addObject(scene.add.text(x - 170, y + 28, characteristics, {
        ...grimTextStyle(GRIM.mutedText, '14px'),
        wordWrap: { width: 410 },
    }).setOrigin(0, 0.5));
}

function renderEmptyState(scene: Phaser.Scene, tab: JournalTab, addObject: AddObject): void {
    addObject(scene.add.text(scene.scale.width / 2, 370, i18n.t(`journal.empty.${tab}`), {
        align: 'center',
        ...grimTextStyle(GRIM.mutedText, '20px'),
        wordWrap: { width: 520 },
    }).setOrigin(0.5));
}

function renderCheatPanel(scene: Phaser.Scene, controls: JournalDeveloperControls, addObject: AddObject): void {
    const centerX = scene.scale.width / 2;
    const left = centerX - 250;
    const width = 500;
    const sliderY = 445;
    addObject(createPanelBorder(scene, centerX, 365, 700, 320));
    addObject(scene.add.text(centerX, 245, i18n.t('journal.cheats.hint'), {
        align: 'center',
        ...grimTextStyle(GRIM.mutedText, '16px'),
    }).setOrigin(0.5));

    const immortality = createButton(
        scene,
        centerX,
        320,
        i18n.t('journal.cheats.invulnerability', {
            state: i18n.t(controls.invulnerable ? 'journal.cheats.enabled' : 'journal.cheats.disabled'),
        }),
        controls.invulnerable ? 'primary' : 'secondary',
        '20px',
    );
    immortality.on(Phaser.Input.Events.POINTER_DOWN, () => controls.onInvulnerabilityChange(!controls.invulnerable));
    addObject(immortality);

    const track = scene.add.rectangle(left, sliderY, width, 16, 0x000000, 0.2).setOrigin(0, 0.5).setStrokeStyle(1, 0x3f424d);
    const fill = scene.add.rectangle(left, sliderY, getSpeedProgress(controls.gameSpeed) * width, 8, 0x9184d9).setOrigin(0, 0.5);
    const thumb = scene.add.rectangle(left + getSpeedProgress(controls.gameSpeed) * width, sliderY, 14, 28, 0xd2cefd).setStrokeStyle(1, 0x9184d9);
    const label = scene.add.text(centerX, 390, getSpeedLabel(controls.gameSpeed), grimHeadingStyle(GRIM.accentText, '20px', 1)).setOrigin(0.5);
    const ticks = scene.add.text(centerX, 478, 'x1                 x2                 x3                 x4                 x5', grimTextStyle(GRIM.mutedText, '14px')).setOrigin(0.5);

    const setSpeedFromPointer = (pointerX: number): void => {
        const speed = Math.round(Phaser.Math.Clamp(1 + ((pointerX - left) / width) * 4, 1, 5) * 10) / 10;
        const progress = getSpeedProgress(speed);
        fill.setDisplaySize(progress * width, 8);
        thumb.setX(left + progress * width);
        label.setText(getSpeedLabel(speed));
        controls.onGameSpeedChange(speed);
    };
    track.setInteractive();
    track.on(Phaser.Input.Events.POINTER_DOWN, (pointer: Phaser.Input.Pointer) => setSpeedFromPointer(pointer.x));
    track.on(Phaser.Input.Events.POINTER_MOVE, (pointer: Phaser.Input.Pointer) => {
        if (pointer.isDown) {
            setSpeedFromPointer(pointer.x);
        }
    });
    addObject(track);
    addObject(fill);
    addObject(thumb);
    addObject(label);
    addObject(ticks);
}

function getSpeedProgress(speed: number): number {
    return (Phaser.Math.Clamp(speed, 1, 5) - 1) / 4;
}

function getSpeedLabel(speed: number): string {
    return i18n.t('journal.cheats.speed', { speed: speed.toFixed(1) });
}

function getEnemyKills(enemy: EnemyKind): number {
    return metaProgress.achievementProgress[getJournalEnemyAchievementId(enemy, 100)] ?? 0;
}

function getWeaponKills(weapon: WeaponKind): number {
    return metaProgress.achievementProgress[getJournalWeaponAchievementId(weapon, 100)] ?? 0;
}

function getInformationLevel(kills: number, milestones: readonly number[]): number {
    return milestones.filter((milestone) => kills >= milestone).length;
}

function getProgressLabel(kills: number): string {
    return i18n.t('journal.progress', { kills, total: 100 });
}

function getPowerTier(value: number): string {
    if (value < 2) {
        return i18n.t('journal.tier.low');
    }

    return value < 5 ? i18n.t('journal.tier.medium') : i18n.t('journal.tier.high');
}

function getSpeedTier(value: number): string {
    if (value < 150) {
        return i18n.t('journal.tier.slow');
    }

    return value < 400 ? i18n.t('journal.tier.mediumSpeed') : i18n.t('journal.tier.fast');
}

function getCadenceTier(interval: number): string {
    if (interval <= 900) {
        return i18n.t('journal.tier.fast');
    }

    return interval <= 1300 ? i18n.t('journal.tier.mediumSpeed') : i18n.t('journal.tier.slow');
}

function getCardPosition(scene: Phaser.Scene, index: number): { x: number; y: number } {
    return {
        x: scene.scale.width / 2 + (index % 2 === 0 ? -295 : 295),
        y: 230 + Math.floor(index / 2) * 145,
    };
}
