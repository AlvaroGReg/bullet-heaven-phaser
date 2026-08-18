import Phaser from 'phaser';
import { ACHIEVEMENTS } from '../game/Achievements';
import type { AchievementDefinition } from '../game/Achievements';
import { META_UPGRADES, metaProgress } from '../game/MetaProgress';
import { i18n } from '../i18n';
import type { Locale } from '../i18n';
import { createRogueTextures, DAGGER_TEXTURE, ROGUE_TEXTURE } from '../sprites/rogue';
import { GRIM, grimButtonStyle, grimTextStyle } from '../ui/grimTheme';

type MenuView = 'achievements' | 'main' | 'characters' | 'meta' | 'patchNotes';

export class MenuScene extends Phaser.Scene {
    private objects: Phaser.GameObjects.GameObject[] = [];

    private view: MenuView = 'main';

    private languageMenuOpen = false;

    private achievementPage = 0;

    private removeLanguageListener?: () => void;

    public constructor() {
        super('menu');
    }

    public create(): void {
        createRogueTextures(this);
        this.removeLanguageListener = i18n.onChange(this.render);
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.destroy, this);
        this.render();
    }

    private render = (): void => {
        this.objects.forEach((gameObject) => gameObject.destroy());
        this.objects = [];
        this.addObject(this.add.rectangle(
            this.scale.width / 2,
            this.scale.height / 2,
            this.scale.width,
            this.scale.height,
            0x080b10,
        ).setDepth(-1));

        if (this.view === 'achievements') {
            this.renderAchievements();
        } else if (this.view === 'characters') {
            this.renderCharacterSelection();
        } else if (this.view === 'meta') {
            this.renderMetaProgression();
        } else if (this.view === 'patchNotes') {
            this.renderPatchNotes();
        } else {
            this.renderMainMenu();
        }

        this.addLanguageMenu();
    };

    private renderMainMenu(): void {
        this.addTitle(i18n.t('menu.title'), 170);
        this.addLabel(i18n.t('menu.gold', { gold: metaProgress.currentGold }), 230, '#fcd34d');
        this.addButton(i18n.t('menu.newGame'), 330, () => {
            this.view = 'characters';
            this.render();
        }, '#2563eb');
        this.addButton(i18n.t('menu.metaProgression'), 410, () => {
            this.view = 'meta';
            this.render();
        }, '#475569');
        this.addButton(i18n.t('achievement.title'), 490, () => {
            this.view = 'achievements';
            this.render();
        }, '#475569');
        this.addButton(i18n.t('menu.patchNotes'), 570, () => {
            this.view = 'patchNotes';
            this.render();
        }, '#475569');
    }

    private renderCharacterSelection(): void {
        this.addTitle(i18n.t('menu.selectCharacter'), 105);
        this.addLabel(i18n.t('character.rogue'), 160, '#cbd5e1');
        this.addObject(this.add.image(this.scale.width / 2, 255, ROGUE_TEXTURE).setScale(4));
        this.addLabel(i18n.t('weapon.daggers'), 370, '#fcd34d');
        this.addObject(this.add.image(this.scale.width / 2, 435, DAGGER_TEXTURE).setScale(4));

        this.addButton(i18n.t('menu.start'), 530, () => this.scene.start('game'), '#16a34a');
        this.addButton(i18n.t('menu.back'), 605, () => {
            this.view = 'main';
            this.render();
        }, '#475569');
    }

    private renderMetaProgression(): void {
        this.addTitle(i18n.t('meta.title'), 75);
        this.addLabel(i18n.t('menu.gold', { gold: metaProgress.currentGold }), 120, '#fcd34d');
        this.addLabel(i18n.t('meta.comingSoon'), 155, '#cbd5e1');

        const columns = ['baseStats', 'weapons', 'ingameUpgrades'] as const;
        columns.forEach((category, index) => {
            const x = 330 + index * 310;
            const upgrades = META_UPGRADES.filter((upgrade) => upgrade.category === category);
            const text = [i18n.t(`meta.category.${category}`), ...upgrades.map((upgrade) => (
                `${i18n.t(upgrade.nameKey)}\n${i18n.t(upgrade.descriptionKey)}\n${i18n.t('meta.requires', { achievement: i18n.t(upgrade.achievementKey), gold: upgrade.goldCost })}`
            ))].join('\n\n');
            const card = this.add.text(x, 330, text, {
                align: 'center',
                ...grimTextStyle(GRIM.text, '16px'),
                backgroundColor: GRIM.panel,
                wordWrap: { width: 260 },
            }).setOrigin(0.5).setFixedSize(280, 315).setPadding(16);
            this.objects.push(card);
        });

        this.addButton(i18n.t('menu.back'), 610, () => {
            this.view = 'main';
            this.render();
        }, '#475569');
    }

    private renderPatchNotes(): void {
        this.addTitle(i18n.t('patchNotes.title'), 75);
        this.addObject(this.add.text(this.scale.width / 2, 350, i18n.t('patchNotes.content'), {
            align: 'left',
            ...grimTextStyle(GRIM.text, '18px'),
            backgroundColor: GRIM.panel,
            wordWrap: { width: 820 },
        }).setOrigin(0.5).setFixedSize(860, 500).setPadding(24));
        this.addButton(i18n.t('menu.back'), 650, () => {
            this.view = 'main';
            this.render();
        }, '#475569');
    }

    private renderAchievements(): void {
        const unlockedCount = metaProgress.unlockedAchievements.length;
        const pageSize = 16;
        const pageCount = Math.ceil(ACHIEVEMENTS.length / pageSize);
        const pageAchievements = ACHIEVEMENTS.slice(this.achievementPage * pageSize, (this.achievementPage + 1) * pageSize);
        this.addTitle(i18n.t('achievement.title'), 70);
        this.addLabel(
            `${i18n.t('achievement.summary', { completed: unlockedCount, total: ACHIEVEMENTS.length })} · ${i18n.t('achievement.page', { current: this.achievementPage + 1, total: pageCount })}`,
            115,
            '#fcd34d',
        );

        for (let column = 0; column < 4; column += 1) {
            const text = pageAchievements.filter((_, index) => index % 4 === column).map((achievement) => {
                const progress = metaProgress.achievementProgress[achievement.id] ?? 0;
                const unlocked = metaProgress.unlockedAchievements.includes(achievement.id);
                const isTimeAchievement = achievement.metric === 'survivalRun'
                    || achievement.metric === 'survivalTotal'
                    || achievement.metric === 'playTime'
                    || achievement.metric === 'survivalWithoutUpgrades';
                const status = unlocked
                    ? i18n.t('achievement.unlocked')
                    : i18n.t('achievement.progress', {
                        current: Math.floor(isTimeAchievement ? progress / 60 : progress),
                        target: isTimeAchievement ? achievement.target / 60 : achievement.target,
                    });
                return `${this.getAchievementLabel(achievement)}\n${status}`;
            }).join('\n\n');
            this.addObject(this.add.text(175 + column * 310, 365, text, {
                align: 'center', ...grimTextStyle(GRIM.text, '13px'), backgroundColor: GRIM.panel,
                wordWrap: { width: 260 },
            }).setOrigin(0.5).setFixedSize(280, 450).setPadding(12));
        }

        if (this.achievementPage > 0) {
            this.addButton(i18n.t('achievement.previous'), 650, () => {
                this.achievementPage -= 1;
                this.render();
            }, '#475569', this.scale.width / 2 - 180);
        }
        if (this.achievementPage < pageCount - 1) {
            this.addButton(i18n.t('achievement.next'), 650, () => {
                this.achievementPage += 1;
                this.render();
            }, '#475569', this.scale.width / 2 + 180);
        }
        this.addButton(i18n.t('menu.back'), 650, () => {
            this.view = 'main';
            this.render();
        }, '#475569');
    }

    private getAchievementLabel(achievement: AchievementDefinition): string {
        if (achievement.metric === 'finalBossBefore') {
            return i18n.t('achievement.metric.finalBossBefore', { time: this.formatAchievementTime(achievement.deadlineSeconds!) });
        }

        if (achievement.metric === 'gameCompletedLowHealth') {
            return i18n.t('achievement.metric.gameCompletedLowHealth', { value: achievement.healthThreshold! });
        }

        const value = achievement.metric === 'survivalRun' || achievement.metric === 'survivalTotal' || achievement.metric === 'playTime'
            || achievement.metric === 'survivalWithoutUpgrades'
            ? achievement.target / 60
            : achievement.target;
        const values = {
            enemy: achievement.enemyKind ? i18n.t(`enemy.${achievement.enemyKind}`) : '',
            stat: achievement.stat ? i18n.t(`stat.${achievement.stat}`) : '',
            value,
            weapon: achievement.weapon ? i18n.t(`weapon.${achievement.weapon}`) : '',
        };
        return i18n.t(`achievement.metric.${achievement.metric}`, values);
    }

    private formatAchievementTime(seconds: number): string {
        const minutes = Math.floor(seconds / 60);
        return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
    }

    private addTitle(text: string, y: number): void {
        this.addObject(this.add.text(this.scale.width / 2, y, text, {
            ...grimTextStyle(GRIM.text, '44px'),
        }).setOrigin(0.5));
    }

    private addLabel(text: string, y: number, color: string): void {
        this.addObject(this.add.text(this.scale.width / 2, y, text, {
            ...grimTextStyle(color, '20px'),
        }).setOrigin(0.5));
    }

    private addButton(text: string, y: number, callback: () => void, color: string, x = this.scale.width / 2): void {
        this.addObject(this.add.text(x, y, text, {
            ...grimButtonStyle(color, '22px'),
        }).setOrigin(0.5).setPadding(18, 10).setInteractive({ useHandCursor: true }).on(Phaser.Input.Events.POINTER_DOWN, callback));
    }

    private addLanguageMenu(): void {
        const x = this.scale.width - 42;
        const flag = i18n.locale === 'es' ? '🇪🇸' : i18n.locale === 'ja' ? '🇯🇵' : '🇬🇧';
        this.addObject(this.add.text(x, 42, flag, {
            ...grimButtonStyle(GRIM.panelRaised, '24px'),
        }).setOrigin(0.5).setPadding(10, 6).setInteractive({ useHandCursor: true }).on(Phaser.Input.Events.POINTER_DOWN, () => {
            this.languageMenuOpen = !this.languageMenuOpen;
            this.render();
        }));

        if (!this.languageMenuOpen) {
            return;
        }

        this.addObject(this.add.text(this.scale.width - 150, 96, '🇬🇧 English', {
            ...grimButtonStyle(GRIM.panelRaised, '18px'),
        }).setOrigin(0.5).setPadding(14, 9).setInteractive({ useHandCursor: true }).on(Phaser.Input.Events.POINTER_DOWN, () => this.setLocale('en')));
        this.addObject(this.add.text(this.scale.width - 150, 146, '🇪🇸 Español', {
            ...grimButtonStyle(GRIM.panelRaised, '18px'),
        }).setOrigin(0.5).setPadding(14, 9).setInteractive({ useHandCursor: true }).on(Phaser.Input.Events.POINTER_DOWN, () => this.setLocale('es')));
        this.addObject(this.add.text(this.scale.width - 150, 196, '🇯🇵 日本語', {
            ...grimButtonStyle(GRIM.panelRaised, '18px'),
        }).setOrigin(0.5).setPadding(14, 9).setInteractive({ useHandCursor: true }).on(Phaser.Input.Events.POINTER_DOWN, () => this.setLocale('ja')));
    }

    private addObject(gameObject: Phaser.GameObjects.GameObject): void {
        this.objects.push(gameObject);
    }

    private setLocale(locale: Locale): void {
        i18n.setLocale(locale);
        this.languageMenuOpen = false;
        this.render();
    }

    private destroy(): void {
        this.removeLanguageListener?.();
    }
}
