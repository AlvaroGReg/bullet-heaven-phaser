import Phaser from 'phaser';
import { i18n } from '../i18n';
import type { Locale } from '../i18n';
import {
    createButton,
    createFrame,
    createRuleMark,
    GRIM,
    grimHeadingStyle,
    grimTextStyle,
} from './grimTheme';
import type { ButtonVariant } from './grimTheme';

const CONTROLS_DURATION = 10_000;
const BAR_WIDTH = 260;
const BAR_HEIGHT = 24;

type GameHudCallbacks = {
    onMainMenu: () => void;
    onResume: () => void;
    onRestart: () => void;
    onTogglePause: () => void;
};

export class GameHud {
    private readonly healthFill: Phaser.GameObjects.Rectangle;

    private readonly experienceFill: Phaser.GameObjects.Rectangle;

    private readonly experienceLabel: Phaser.GameObjects.Text;

    private readonly timerText: Phaser.GameObjects.Text;

    private readonly goldText: Phaser.GameObjects.Text;

    private readonly controlsText: Phaser.GameObjects.Text;

    private readonly hasTouchInput: boolean;

    private elapsed = 0;

    private menuObjects: Phaser.GameObjects.GameObject[] = [];

    private menuState: 'gameOver' | 'pause' | 'restartConfirmation' | 'victory' | undefined;

    private languageMenuOpen = false;

    private currentLevel: number;

    private currentGold: number;

    private removeLanguageListener: () => void;

    public constructor(
        private readonly scene: Phaser.Scene,
        health: number,
        maxHealth: number,
        level: number,
        experience: number,
        requiredExperience: number,
        private readonly callbacks: GameHudCallbacks,
        gold: number,
        hasTouchInput: boolean,
    ) {
        this.hasTouchInput = hasTouchInput;
        this.currentLevel = level;
        this.currentGold = gold;
        this.scene.add
            .rectangle(24, 20, BAR_WIDTH, BAR_HEIGHT, 0x193127)
            .setOrigin(0)
            .setScrollFactor(0);
        this.healthFill = this.scene.add
            .rectangle(24, 20, BAR_WIDTH, BAR_HEIGHT, 0x4ade80)
            .setOrigin(0)
            .setScrollFactor(0);
        this.scene.add
            .rectangle(24, 52, BAR_WIDTH, BAR_HEIGHT, 0x172554)
            .setOrigin(0)
            .setScrollFactor(0);
        this.experienceFill = this.scene.add
            .rectangle(24, 52, BAR_WIDTH, BAR_HEIGHT, 0x3b82f6)
            .setOrigin(0)
            .setScrollFactor(0);
        this.experienceLabel = this.scene.add
            .text(
                24 + BAR_WIDTH / 2,
                54,
                this.getExperienceLabel(level),
                this.textStyle(GRIM.text, '16px'),
            )
            .setOrigin(0.5, 0)
            .setScrollFactor(0);

        this.setHealth(health, maxHealth);
        this.setExperience(level, experience, requiredExperience);

        const rightHudOffset = this.hasTouchInput ? 88 : 24;
        this.timerText = this.scene.add
            .text(this.scene.scale.width - rightHudOffset, 20, this.getTimerLabel(), this.textStyle(GRIM.text, '18px'))
            .setOrigin(1, 0)
            .setScrollFactor(0);

        this.goldText = this.scene.add
            .text(this.scene.scale.width - rightHudOffset, 48, this.getGoldLabel(gold), this.textStyle('#fcd34d', '18px'))
            .setOrigin(1, 0)
            .setScrollFactor(0);

        if (this.hasTouchInput) {
            this.addPauseButton();
        }

        this.controlsText = this.scene.add
            .text(
                24,
                88,
                this.getControlsText(),
                this.textStyle(GRIM.mutedText, '16px'),
            )
            .setScrollFactor(0);

        this.removeLanguageListener = i18n.onChange(() => this.updateLanguage());
        this.scene.events.once(Phaser.Scenes.Events.SHUTDOWN, this.destroy, this);

    }

    public update(delta: number): void {
        this.elapsed += delta;
        this.timerText.setText(this.getTimerLabel());

        if (this.elapsed >= CONTROLS_DURATION) {
            this.controlsText.setVisible(false);
        }
    }

    public setHealth(health: number, maxHealth: number): void {
        const safeHealth = Phaser.Math.Clamp(health, 0, maxHealth);
        this.healthFill.setDisplaySize(BAR_WIDTH * (safeHealth / maxHealth), BAR_HEIGHT);
    }

    public setExperience(level: number, experience: number, requiredExperience: number): void {
        const progress = Phaser.Math.Clamp(experience / requiredExperience, 0, 1);
        this.experienceFill.setDisplaySize(BAR_WIDTH * progress, BAR_HEIGHT);
        this.currentLevel = level;
        this.experienceLabel.setText(this.getExperienceLabel(level));
    }

    public setGold(gold: number): void {
        this.currentGold = gold;
        this.goldText.setText(this.getGoldLabel(gold));
    }

    public setPaused(paused: boolean): void {
        this.controlsText.setVisible(paused || this.elapsed < CONTROLS_DURATION);
        this.controlsText.setDepth(paused ? 21 : 0);

        if (paused) {
            this.showPauseMenu();
        } else {
            this.clearMenu();
            this.menuState = undefined;
        }
    }

    public showGameOver(): void {
        this.controlsText.setVisible(false);
        this.clearMenu();
        this.menuState = 'gameOver';
        this.addMenuBackground();
        this.addMenuTitle(i18n.t('gameover.title'), 280);
        this.addMenuButton(i18n.t('pause.restart'), 380, this.callbacks.onRestart, 'secondary');
        this.addMenuButton(i18n.t('menu.main'), 450, this.callbacks.onMainMenu, 'secondary');
    }

    public showVictory(): void {
        this.controlsText.setVisible(false);
        this.clearMenu();
        this.menuState = 'victory';
        this.addMenuBackground();
        this.addMenuTitle(i18n.t('win.title'), 280);
        this.addMenuButton(i18n.t('menu.main'), 400, this.callbacks.onMainMenu, 'primary');
    }

    private getExperienceLabel(level: number): string {
        return i18n.t('hud.level', { level });
    }

    private getTimerLabel(): string {
        return i18n.t('hud.time', { time: this.formatTime(this.elapsed) });
    }

    private getGoldLabel(gold: number): string {
        return i18n.t('hud.gold', { gold });
    }

    private getControlsText(): string {
        if (this.hasTouchInput) {
            return i18n.t('controls.touch');
        }

        return [i18n.t('controls.move'), i18n.t('controls.aim'), i18n.t('controls.auto')].join('\n');
    }

    private addPauseButton(): void {
        const size = 56;
        const background = this.scene.add.graphics();
        background.fillStyle(0x1a211d, 0.94);
        background.fillRoundedRect(-size / 2, -size / 2, size, size, 8);
        background.lineStyle(3, 0xa8ad98, 1);
        background.strokeRoundedRect(-size / 2, -size / 2, size, size, 8);

        const icon = this.scene.add.text(0, -2, 'II', this.textStyle(GRIM.text, '24px')).setOrigin(0.5);
        const button = this.scene.add.container(this.scene.scale.width - 44, 44, [background, icon]);
        button
            .setSize(size, size)
            .setScrollFactor(0)
            .setDepth(2)
            .setInteractive(new Phaser.Geom.Rectangle(0, 0, size, size), Phaser.Geom.Rectangle.Contains)
            .on(Phaser.Input.Events.POINTER_DOWN, this.callbacks.onTogglePause);
    }

    private showPauseMenu(): void {
        this.clearMenu();
        this.menuState = 'pause';
        this.addMenuBackground();
        this.addMenuTitle(i18n.t('pause.title'), 250);
        this.addMenuButton(i18n.t('pause.continue'), 330, this.callbacks.onResume, 'primary');
        this.addMenuButton(i18n.t('pause.restart'), 400, this.showRestartConfirmation, 'secondary');
        this.addMenuButton(i18n.t('menu.main'), 470, this.callbacks.onMainMenu, 'secondary');
        this.addLanguageMenu();
    }

    private showRestartConfirmation = (): void => {
        this.clearMenu();
        this.menuState = 'restartConfirmation';
        this.addMenuBackground();
        this.addMenuTitle(i18n.t('pause.restartQuestion'), 280);
        this.addMenuButton(i18n.t('pause.restartConfirm'), 360, this.callbacks.onRestart, 'secondary');
        this.addMenuButton(i18n.t('pause.restartCancel'), 430, () => this.showPauseMenu(), 'primary');
    };

    private addMenuBackground(): void {
        const isGameOver = this.menuState === 'gameOver';
        const isVictory = this.menuState === 'victory';
        const dimColor = isGameOver ? 0x030406 : 0x0d0f16;
        const alpha = isGameOver ? 0.92 : isVictory ? 0.85 : 0.78;
        this.menuObjects.push(
            this.scene.add
                .rectangle(
                    this.scene.scale.width / 2,
                    this.scene.scale.height / 2,
                    this.scene.scale.width,
                    this.scene.scale.height,
                    dimColor,
                    alpha,
                )
                .setScrollFactor(0)
                .setDepth(20),
        );
        this.menuObjects.push(createFrame(this.scene).setScrollFactor(0).setDepth(20));
    }

    private addMenuTitle(text: string, y: number): void {
        this.menuObjects.push(
            createRuleMark(this.scene, this.scene.scale.width / 2, y - 50)
                .setScrollFactor(0)
                .setDepth(21),
        );
        this.menuObjects.push(
            this.scene.add
                .text(this.scene.scale.width / 2, y, text.toUpperCase(), {
                    align: 'center',
                    ...grimHeadingStyle(GRIM.text, '40px'),
                })
                .setOrigin(0.5)
                .setScrollFactor(0)
                .setDepth(21),
        );
    }

    private addLanguageMenu(): void {
        const x = this.scene.scale.width - 46;
        const toggleY = 110;
        const toggle = createButton(this.scene, x, toggleY, i18n.locale.toUpperCase(), 'secondary', '16px');
        toggle.setScrollFactor(0).setDepth(21);
        toggle.on(Phaser.Input.Events.POINTER_DOWN, () => {
            this.languageMenuOpen = !this.languageMenuOpen;
            this.showPauseMenu();
        });
        this.menuObjects.push(toggle);

        if (!this.languageMenuOpen) {
            return;
        }

        const options: Array<[Locale, string]> = [['en', 'EN'], ['es', 'ES'], ['ja', 'JA']];
        options.forEach(([locale, label], index) => {
            const chip = createButton(
                this.scene,
                x,
                toggleY + 54 + index * 46,
                label,
                locale === i18n.locale ? 'primary' : 'secondary',
                '16px',
            );
            chip.setScrollFactor(0).setDepth(21);
            chip.on(Phaser.Input.Events.POINTER_DOWN, () => this.setLocale(locale));
            this.menuObjects.push(chip);
        });
    }

    private addMenuButton(
        text: string,
        y: number,
        callback: () => void,
        variant: ButtonVariant,
        x = this.scene.scale.width / 2,
        fontSize = '22px',
    ): void {
        const button = createButton(this.scene, x, y, text, variant, fontSize);
        button.setScrollFactor(0).setDepth(21);
        button.on(Phaser.Input.Events.POINTER_DOWN, callback);
        this.menuObjects.push(button);
    }

    private clearMenu(): void {
        this.menuObjects.forEach((gameObject) => gameObject.destroy());
        this.menuObjects = [];
    }

    private setLocale(locale: Locale): void {
        this.languageMenuOpen = false;
        i18n.setLocale(locale);
    }

    private updateLanguage(): void {
        this.timerText.setText(this.getTimerLabel());
        this.experienceLabel.setText(this.getExperienceLabel(this.currentLevel));
        this.goldText.setText(this.getGoldLabel(this.currentGold));
        this.controlsText.setText(this.getControlsText());

        if (this.menuState === 'gameOver') {
            this.showGameOver();
        } else if (this.menuState === 'victory') {
            this.showVictory();
        } else if (this.menuState === 'pause') {
            this.showPauseMenu();
        } else if (this.menuState === 'restartConfirmation') {
            this.showRestartConfirmation();
        }
    }

    private destroy(): void {
        this.removeLanguageListener();
    }

    private formatTime(elapsed: number): string {
        const totalSeconds = Math.floor(elapsed / 1000);
        const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
        const seconds = (totalSeconds % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    }

    private textStyle(color: string, fontSize: string): Phaser.Types.GameObjects.Text.TextStyle {
        return grimTextStyle(color, fontSize);
    }
}
