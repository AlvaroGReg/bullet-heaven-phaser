import Phaser from 'phaser';
import { ACHIEVEMENTS } from '../game/Achievements';
import type { AchievementDefinition } from '../game/Achievements';
import { META_UPGRADES, metaProgress } from '../game/MetaProgress';
import type { MetaUpgrade, MetaUpgradeCategory } from '../game/MetaProgress';
import { i18n } from '../i18n';
import type { Locale } from '../i18n';
import { createRogueTextures, DAGGER_TEXTURE, ROGUE_TEXTURE } from '../sprites/rogue';
import {
    createButton,
    createFrame,
    createNavRow,
    createPanelBorder,
    createRuleMark,
    GRIM,
    GRIM_INT,
    grimHeadingStyle,
    grimTextStyle,
} from '../ui/grimTheme';
import type { ButtonVariant } from '../ui/grimTheme';

type MenuView = 'achievements' | 'main' | 'characters' | 'meta' | 'patchNotes';

export class MenuScene extends Phaser.Scene {
    private objects: Phaser.GameObjects.GameObject[] = [];

    private view: MenuView = 'main';

    private languageMenuOpen = false;

    private achievementPage = 0;

    private metaCategory: MetaUpgradeCategory = 'baseStats';

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
            GRIM_INT.bg,
        ).setDepth(-1));
        this.addObject(createFrame(this));

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
        this.addTitle(i18n.t('menu.title'), 150);
        this.addLabel(i18n.t('menu.gold', { gold: metaProgress.currentGold }), 205, GRIM.accentText);

        const rowWidth = 440;
        const startY = 310;
        const rows: Array<[string, () => void]> = [
            [i18n.t('menu.newGame'), () => {
                this.view = 'characters';
                this.render();
            }],
            [i18n.t('menu.metaProgression'), () => {
                this.view = 'meta';
                this.render();
            }],
            [i18n.t('achievement.title'), () => {
                this.view = 'achievements';
                this.render();
            }],
            [i18n.t('menu.patchNotes'), () => {
                this.view = 'patchNotes';
                this.render();
            }],
        ];
        rows.forEach(([label, onClick], index) => {
            this.addObject(createNavRow(this, this.scale.width / 2, startY + index * 62, rowWidth, label, onClick));
        });
    }

    private renderCharacterSelection(): void {
        this.addTitle(i18n.t('menu.selectCharacter'), 105);
        this.addLabel(i18n.t('character.rogue'), 160, GRIM.text);
        this.addObject(this.add.image(this.scale.width / 2, 255, ROGUE_TEXTURE).setScale(4));
        this.addLabel(i18n.t('weapon.daggers'), 370, GRIM.accentText);
        this.addObject(this.add.image(this.scale.width / 2, 435, DAGGER_TEXTURE).setScale(4));

        this.addButton(i18n.t('menu.start'), 530, () => this.scene.start('game'), 'primary');
        this.addButton(i18n.t('menu.back'), 605, () => {
            this.view = 'main';
            this.render();
        }, 'secondary');
    }

    private renderMetaProgression(): void {
        this.addTitle(i18n.t('meta.title'), 65);
        this.addLabel(i18n.t('menu.gold', { gold: metaProgress.currentGold }), 105, GRIM.accentText);

        (['baseStats', 'weapons'] as const).forEach((category, index) => {
            const tab = createButton(
                this,
                this.scale.width / 2 + (index === 0 ? -130 : 130),
                160,
                i18n.t(`meta.category.${category}`),
                category === this.metaCategory ? 'primary' : 'secondary',
                '18px',
            );
            tab.on(Phaser.Input.Events.POINTER_DOWN, () => {
                this.metaCategory = category;
                this.render();
            });
            this.addObject(tab);
        });

        META_UPGRADES.filter((upgrade) => upgrade.category === this.metaCategory).forEach((upgrade, index) => {
            const x = this.scale.width / 2 + (index % 2 === 0 ? -245 : 245);
            const y = 290 + Math.floor(index / 2) * 215;
            this.renderMetaUpgrade(upgrade, x, y);
        });

        this.addButton(i18n.t('menu.back'), 610, () => {
            this.view = 'main';
            this.render();
        }, 'secondary');
    }

    private renderMetaUpgrade(upgrade: MetaUpgrade, x: number, y: number): void {
        const level = metaProgress.getLevel(upgrade);
        const cost = metaProgress.getNextCost(upgrade);
        const maxed = cost === undefined;
        const canBuy = cost !== undefined && metaProgress.currentGold >= cost;
        const progress = upgrade.goldCosts.length === 1
            ? (maxed ? i18n.t('meta.purchased') : i18n.t('meta.singlePurchase'))
            : i18n.t('meta.level', { current: level, total: upgrade.goldCosts.length });

        this.addObject(createPanelBorder(this, x, y, 450, 180));
        this.addObject(this.add.text(x, y - 58, i18n.t(upgrade.nameKey), {
            ...grimHeadingStyle(GRIM.text, '20px', 1),
        }).setOrigin(0.5));
        this.addObject(this.add.text(x, y - 22, i18n.t(upgrade.descriptionKey), {
            align: 'center',
            ...grimTextStyle(GRIM.mutedText, '15px'),
            wordWrap: { width: 390 },
        }).setOrigin(0.5));
        this.addObject(this.add.text(x, y + 18, progress, grimTextStyle(GRIM.accentText, '15px')).setOrigin(0.5));

        const label = maxed
            ? i18n.t('meta.maxed')
            : i18n.t('meta.buy', { gold: cost! });
        const button = createButton(this, x, y + 57, label, canBuy ? 'primary' : 'secondary', '16px');
        if (canBuy) {
            button.on(Phaser.Input.Events.POINTER_DOWN, () => {
                if (metaProgress.buy(upgrade)) {
                    this.render();
                }
            });
        }
        this.addObject(button);
    }

    private renderPatchNotes(): void {
        this.addTitle(i18n.t('patchNotes.title'), 75);
        this.addObject(createPanelBorder(this, this.scale.width / 2, 350, 860, 500));
        this.addObject(this.add.text(this.scale.width / 2, 350, i18n.t('patchNotes.content'), {
            align: 'left',
            ...grimTextStyle(GRIM.text, '18px'),
            wordWrap: { width: 820 },
        }).setOrigin(0.5).setFixedSize(860, 500).setPadding(24));
        this.addButton(i18n.t('menu.back'), 650, () => {
            this.view = 'main';
            this.render();
        }, 'secondary');
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
            GRIM.accentText,
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
            const x = 175 + column * 310;
            this.addObject(createPanelBorder(this, x, 365, 280, 450));
            this.addObject(this.add.text(x, 365, text, {
                align: 'center', ...grimTextStyle(GRIM.text, '13px'),
                wordWrap: { width: 260 },
            }).setOrigin(0.5).setFixedSize(280, 450).setPadding(12));
        }

        if (this.achievementPage > 0) {
            this.addButton(i18n.t('achievement.previous'), 650, () => {
                this.achievementPage -= 1;
                this.render();
            }, 'secondary', this.scale.width / 2 - 180);
        }
        if (this.achievementPage < pageCount - 1) {
            this.addButton(i18n.t('achievement.next'), 650, () => {
                this.achievementPage += 1;
                this.render();
            }, 'secondary', this.scale.width / 2 + 180);
        }
        this.addButton(i18n.t('menu.back'), 650, () => {
            this.view = 'main';
            this.render();
        }, 'secondary');
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
        this.addObject(createRuleMark(this, this.scale.width / 2, y - 46));
        this.addObject(this.add.text(this.scale.width / 2, y, text.toUpperCase(), {
            ...grimHeadingStyle(GRIM.text, '44px'),
        }).setOrigin(0.5));
    }

    private addLabel(text: string, y: number, color: string): void {
        this.addObject(this.add.text(this.scale.width / 2, y, text, {
            ...grimTextStyle(color, '20px'),
        }).setOrigin(0.5));
    }

    private addButton(text: string, y: number, callback: () => void, variant: ButtonVariant, x = this.scale.width / 2): void {
        const button = createButton(this, x, y, text, variant, '20px');
        button.on(Phaser.Input.Events.POINTER_DOWN, callback);
        this.addObject(button);
    }

    private addLanguageMenu(): void {
        const x = this.scale.width - 46;
        const toggle = createButton(this, x, 42, i18n.locale.toUpperCase(), 'secondary', '16px');
        toggle.on(Phaser.Input.Events.POINTER_DOWN, () => {
            this.languageMenuOpen = !this.languageMenuOpen;
            this.render();
        });
        this.addObject(toggle);

        if (!this.languageMenuOpen) {
            return;
        }

        const options: Array<[Locale, string]> = [['en', 'EN'], ['es', 'ES'], ['ja', 'JA']];
        options.forEach(([locale, label], index) => {
            const chip = createButton(
                this,
                x,
                96 + index * 46,
                label,
                locale === i18n.locale ? 'primary' : 'secondary',
                '16px',
            );
            chip.on(Phaser.Input.Events.POINTER_DOWN, () => this.setLocale(locale));
            this.addObject(chip);
        });
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
