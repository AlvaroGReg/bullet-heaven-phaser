import Phaser from 'phaser';
import { i18n } from '../i18n';
import type { Locale } from '../i18n';
import { GRIM, grimButtonStyle, grimTextStyle } from './grimTheme';

const CONTROLS_DURATION = 10_000;
const BAR_WIDTH = 260;
const BAR_HEIGHT = 24;

type GameHudCallbacks = {
    onMainMenu: () => void;
    onResume: () => void;
    onRestart: () => void;
};

export class GameHud {
    private readonly healthFill: Phaser.GameObjects.Rectangle;

    private readonly experienceFill: Phaser.GameObjects.Rectangle;

    private readonly experienceLabel: Phaser.GameObjects.Text;

    private readonly timerText: Phaser.GameObjects.Text;

    private readonly goldText: Phaser.GameObjects.Text;

    private readonly controlsText: Phaser.GameObjects.Text;

    private elapsed = 0;

    private menuObjects: Phaser.GameObjects.GameObject[] = [];

    private menuState: 'gameOver' | 'pause' | 'restartConfirmation' | 'victory' | undefined;

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
    ) {
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

        this.timerText = this.scene.add
            .text(this.scene.scale.width - 24, 20, this.getTimerLabel(), this.textStyle(GRIM.text, '18px'))
            .setOrigin(1, 0)
            .setScrollFactor(0);

        this.goldText = this.scene.add
            .text(this.scene.scale.width - 24, 48, this.getGoldLabel(gold), this.textStyle('#fcd34d', '18px'))
            .setOrigin(1, 0)
            .setScrollFactor(0);

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
        this.addMenuButton(i18n.t('pause.restart'), 380, this.callbacks.onRestart, '#7f1d1d');
        this.addMenuButton(i18n.t('menu.main'), 450, this.callbacks.onMainMenu, '#475569');
    }

    public showVictory(): void {
        this.controlsText.setVisible(false);
        this.clearMenu();
        this.menuState = 'victory';
        this.addMenuBackground();
        this.addMenuTitle(i18n.t('win.title'), 280);
        this.addMenuButton(i18n.t('menu.main'), 400, this.callbacks.onMainMenu, '#2563eb');
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
        return [i18n.t('controls.move'), i18n.t('controls.aim'), i18n.t('controls.auto')].join('\n');
    }

    private showPauseMenu(): void {
        this.clearMenu();
        this.menuState = 'pause';
        this.addMenuBackground();
        this.addMenuTitle(i18n.t('pause.title'), 250);
        this.addMenuButton(i18n.t('pause.continue'), 330, this.callbacks.onResume, '#1d4ed8');
        this.addMenuButton(i18n.t('pause.restart'), 400, this.showRestartConfirmation, '#7f1d1d');
        this.addMenuButton(i18n.t('menu.main'), 470, this.callbacks.onMainMenu, '#475569');
        this.addMenuLabel(i18n.t('language.title'), 535);
        this.addMenuButton(i18n.t('language.english'), 580, () => this.setLocale('en'), '#475569', 430);
        this.addMenuButton(i18n.t('language.spanish'), 580, () => this.setLocale('es'), '#475569', 640);
        this.addMenuButton(i18n.t('language.japanese'), 580, () => this.setLocale('ja'), '#475569', 850);
    }

    private showRestartConfirmation = (): void => {
        this.clearMenu();
        this.menuState = 'restartConfirmation';
        this.addMenuBackground();
        this.addMenuTitle(i18n.t('pause.restartQuestion'), 280);
        this.addMenuButton(i18n.t('pause.restartConfirm'), 360, this.callbacks.onRestart, '#7f1d1d');
        this.addMenuButton(i18n.t('pause.restartCancel'), 430, () => this.showPauseMenu(), '#1d4ed8');
    };

    private addMenuBackground(): void {
        this.menuObjects.push(
            this.scene.add
                .rectangle(
                    this.scene.scale.width / 2,
                    this.scene.scale.height / 2,
                    this.scene.scale.width,
                    this.scene.scale.height,
                    0x080b10,
                    0.82,
                )
                .setScrollFactor(0)
                .setDepth(20),
        );
    }

    private addMenuTitle(text: string, y: number): void {
        this.menuObjects.push(
            this.scene.add
                .text(this.scene.scale.width / 2, y, text, {
                    align: 'center',
                    ...grimTextStyle(GRIM.text, '40px'),
                })
                .setOrigin(0.5)
                .setScrollFactor(0)
                .setDepth(21),
        );
    }

    private addMenuLabel(text: string, y: number): void {
        this.menuObjects.push(
            this.scene.add
                .text(this.scene.scale.width / 2, y, text, this.textStyle(GRIM.mutedText, '18px'))
                .setOrigin(0.5)
                .setScrollFactor(0)
                .setDepth(21),
        );
    }

    private addMenuButton(text: string, y: number, callback: () => void, color: string, x = this.scene.scale.width / 2): void {
        this.menuObjects.push(
            this.scene.add
                .text(x, y, text, grimButtonStyle(color, '22px'))
                .setOrigin(0.5)
                .setPadding(18, 10)
                .setScrollFactor(0)
                .setDepth(21)
                .setInteractive({ useHandCursor: true })
                .on(Phaser.Input.Events.POINTER_DOWN, callback),
        );
    }

    private clearMenu(): void {
        this.menuObjects.forEach((gameObject) => gameObject.destroy());
        this.menuObjects = [];
    }

    private setLocale(locale: Locale): void {
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
