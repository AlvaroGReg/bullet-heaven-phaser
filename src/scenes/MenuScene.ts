import Phaser from 'phaser';
import { META_UPGRADES, metaProgress } from '../game/MetaProgress';
import { PLAYER_CHARACTERS } from '../game/playerCharacters';
import type { PlayerCharacter } from '../game/playerCharacters';
import { i18n } from '../i18n';
import type { Locale } from '../i18n';

type MenuView = 'main' | 'characters' | 'meta';

export class MenuScene extends Phaser.Scene {
    private objects: Phaser.GameObjects.GameObject[] = [];

    private view: MenuView = 'main';

    private selectedCharacter: PlayerCharacter = PLAYER_CHARACTERS[0];

    private languageMenuOpen = false;

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

        if (this.view === 'characters') {
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
