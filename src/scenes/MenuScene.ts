import Phaser from 'phaser';
import { ACHIEVEMENTS } from '../game/Achievements';
import type { AchievementDefinition } from '../game/Achievements';
import { META_UPGRADES, metaProgress } from '../game/MetaProgress';
import { PLAYER_CHARACTERS } from '../game/playerCharacters';
import type { PlayerCharacter } from '../game/playerCharacters';
import { i18n } from '../i18n';
import type { Locale } from '../i18n';

type MenuView = 'achievements' | 'main' | 'characters' | 'meta';

export class MenuScene extends Phaser.Scene {
    private objects: Phaser.GameObjects.GameObject[] = [];

    private view: MenuView = 'main';

    private selectedCharacter: PlayerCharacter = PLAYER_CHARACTERS[0];

    private languageMenuOpen = false;

    private achievementPage = 0;

    private removeLanguageListener?: () => void;

    public constructor() {
        super('menu');
    }

    public create(): void {
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
    }

    private renderCharacterSelection(): void {
        this.addTitle(i18n.t('menu.selectCharacter'), 105);
        this.addLabel(i18n.t('menu.characterPlaceholder'), 155, '#cbd5e1');

        PLAYER_CHARACTERS.forEach((character, index) => {
            const x = this.scale.width / 2 - 170 + index * 340;
            const selected = character.id === this.selectedCharacter.id;
            const card = this.add.text(x, 290, i18n.t(character.nameKey), {
                align: 'center',
                backgroundColor: selected ? '#1d4ed8' : '#1e293b',
                color: '#f8fafc',
                fontFamily: 'system-ui, sans-serif',
                fontSize: '26px',
            })
                .setOrigin(0.5)
                .setFixedSize(280, 150)
                .setPadding(16)
                .setInteractive({ useHandCursor: true })
                .on(Phaser.Input.Events.POINTER_DOWN, () => {
                    this.selectedCharacter = character;
                    this.render();
                });
            this.objects.push(card);
        });

        this.addButton(i18n.t('menu.start'), 470, () => this.scene.start('game', { character: this.selectedCharacter }), '#16a34a');
        this.addButton(i18n.t('menu.back'), 545, () => {
            this.view = 'main';
            this.render();
        }, '#475569');
    }

    private renderMetaProgression(): void {
        this.addTitle(i18n.t('meta.title'), 75);
        this.addLabel(i18n.t('menu.gold', { gold: metaProgress.currentGold }), 120, '#fcd34d');
        this.addLabel(i18n.t('meta.comingSoon'), 155, '#cbd5e1');

        const columns = ['baseStats', 'characters', 'weapons', 'ingameUpgrades'] as const;
        columns.forEach((category, index) => {
            const x = 175 + index * 310;
            const upgrades = META_UPGRADES.filter((upgrade) => upgrade.category === category);
            const text = [i18n.t(`meta.category.${category}`), ...upgrades.map((upgrade) => (
                `${i18n.t(upgrade.nameKey)}\n${i18n.t(upgrade.descriptionKey)}\n${i18n.t('meta.requires', { achievement: i18n.t(upgrade.achievementKey), gold: upgrade.goldCost })}`
            ))].join('\n\n');
            const card = this.add.text(x, 330, text, {
                align: 'center',
                backgroundColor: '#1e293b',
                color: '#e2e8f0',
                fontFamily: 'system-ui, sans-serif',
                fontSize: '16px',
                wordWrap: { width: 260 },
            }).setOrigin(0.5).setFixedSize(280, 315).setPadding(16);
            this.objects.push(card);
        });

        this.addButton(i18n.t('menu.back'), 610, () => {
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
                align: 'center', backgroundColor: '#1e293b', color: '#e2e8f0', fontFamily: 'system-ui, sans-serif', fontSize: '13px',
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
            color: '#f8fafc', fontFamily: 'system-ui, sans-serif', fontSize: '44px',
        }).setOrigin(0.5));
    }

    private addLabel(text: string, y: number, color: string): void {
        this.addObject(this.add.text(this.scale.width / 2, y, text, {
            color, fontFamily: 'system-ui, sans-serif', fontSize: '20px',
        }).setOrigin(0.5));
    }

    private addButton(text: string, y: number, callback: () => void, color: string, x = this.scale.width / 2): void {
        this.addObject(this.add.text(x, y, text, {
            backgroundColor: color, color: '#f8fafc', fontFamily: 'system-ui, sans-serif', fontSize: '22px',
        }).setOrigin(0.5).setPadding(18, 10).setInteractive({ useHandCursor: true }).on(Phaser.Input.Events.POINTER_DOWN, callback));
    }

    private addLanguageMenu(): void {
        const x = this.scale.width - 42;
        const flag = i18n.locale === 'es' ? '🇪🇸' : i18n.locale === 'ja' ? '🇯🇵' : '🇬🇧';
        this.addObject(this.add.text(x, 42, flag, {
            backgroundColor: '#1e293b', color: '#f8fafc', fontFamily: 'system-ui, sans-serif', fontSize: '24px',
        }).setOrigin(0.5).setPadding(10, 6).setInteractive({ useHandCursor: true }).on(Phaser.Input.Events.POINTER_DOWN, () => {
            this.languageMenuOpen = !this.languageMenuOpen;
            this.render();
        }));

        if (!this.languageMenuOpen) {
            return;
        }

        this.addObject(this.add.text(this.scale.width - 150, 96, '🇬🇧 English', {
            backgroundColor: '#334155', color: '#f8fafc', fontFamily: 'system-ui, sans-serif', fontSize: '18px',
        }).setOrigin(0.5).setPadding(14, 9).setInteractive({ useHandCursor: true }).on(Phaser.Input.Events.POINTER_DOWN, () => this.setLocale('en')));
        this.addObject(this.add.text(this.scale.width - 150, 146, '🇪🇸 Español', {
            backgroundColor: '#334155', color: '#f8fafc', fontFamily: 'system-ui, sans-serif', fontSize: '18px',
        }).setOrigin(0.5).setPadding(14, 9).setInteractive({ useHandCursor: true }).on(Phaser.Input.Events.POINTER_DOWN, () => this.setLocale('es')));
        this.addObject(this.add.text(this.scale.width - 150, 196, '🇯🇵 日本語', {
            backgroundColor: '#334155', color: '#f8fafc', fontFamily: 'system-ui, sans-serif', fontSize: '18px',
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
