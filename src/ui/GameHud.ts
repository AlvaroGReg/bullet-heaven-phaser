import Phaser from 'phaser';
import { PLAYER_MAX_HEALTH } from '../game/constants';

const CONTROLS_DURATION = 10_000;
const BAR_WIDTH = 260;
const BAR_HEIGHT = 24;

type GameHudCallbacks = {
    onResume: () => void;
    onRestart: () => void;
};

export class GameHud {
    private readonly healthFill: Phaser.GameObjects.Rectangle;

    private readonly experienceFill: Phaser.GameObjects.Rectangle;

    private readonly experienceLabel: Phaser.GameObjects.Text;

    private readonly timerText: Phaser.GameObjects.Text;

    private readonly controlsText: Phaser.GameObjects.Text;

    private elapsed = 0;

    private menuObjects: Phaser.GameObjects.GameObject[] = [];

    public constructor(
        private readonly scene: Phaser.Scene,
        health: number,
        level: number,
        experience: number,
        requiredExperience: number,
        private readonly callbacks: GameHudCallbacks,
    ) {
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
                this.textStyle('#eff6ff', '16px'),
            )
            .setOrigin(0.5, 0)
            .setScrollFactor(0);

        this.setHealth(health);
        this.setExperience(level, experience, requiredExperience);

        this.timerText = this.scene.add
            .text(this.scene.scale.width - 24, 20, 'Tiempo: 00:00', this.textStyle('#f2f5f7', '18px'))
            .setOrigin(1, 0)
            .setScrollFactor(0);

        this.controlsText = this.scene.add
            .text(
                24,
                88,
                'Muevete con WASD, flechas, cruceta o stick izquierdo\n'
                    + 'Apunta con raton o stick derecho. Dispara con click o A / X.\n'
                    + 'Modo automatico: click secundario o B / O.',
                this.textStyle('#aebac6', '16px'),
            )
            .setScrollFactor(0);

    }

    public update(delta: number): void {
        this.elapsed += delta;
        this.timerText.setText(`Tiempo: ${this.formatTime(this.elapsed)}`);

        if (this.elapsed >= CONTROLS_DURATION) {
            this.controlsText.setVisible(false);
        }
    }

    public setHealth(health: number): void {
        const safeHealth = Phaser.Math.Clamp(health, 0, PLAYER_MAX_HEALTH);
        this.healthFill.setDisplaySize(BAR_WIDTH * (safeHealth / PLAYER_MAX_HEALTH), BAR_HEIGHT);
    }

    public setExperience(level: number, experience: number, requiredExperience: number): void {
        const progress = Phaser.Math.Clamp(experience / requiredExperience, 0, 1);
        this.experienceFill.setDisplaySize(BAR_WIDTH * progress, BAR_HEIGHT);
        this.experienceLabel.setText(this.getExperienceLabel(level));
    }

    public setPaused(paused: boolean): void {
        this.controlsText.setVisible(paused || this.elapsed < CONTROLS_DURATION);
        this.controlsText.setDepth(paused ? 21 : 0);

        if (paused) {
            this.showPauseMenu();
        } else {
            this.clearMenu();
        }
    }

    public showGameOver(): void {
        this.controlsText.setVisible(false);
        this.clearMenu();
        this.addMenuBackground();
        this.addMenuTitle('Has muerto', 280);
        this.addMenuButton('Volver a empezar', 380, this.callbacks.onRestart, '#7f1d1d');
    }

    private getExperienceLabel(level: number): string {
        return `Nivel: ${level}`;
    }

    private showPauseMenu(): void {
        this.clearMenu();
        this.addMenuBackground();
        this.addMenuTitle('Pausado', 260);
        this.addMenuButton('Continuar', 340, this.callbacks.onResume, '#1d4ed8');
        this.addMenuButton('Volver a empezar', 410, this.showRestartConfirmation, '#7f1d1d');
    }

    private showRestartConfirmation = (): void => {
        this.clearMenu();
        this.addMenuBackground();
        this.addMenuTitle('Volver a empezar desde cero?', 280);
        this.addMenuButton('Si, reiniciar', 360, this.callbacks.onRestart, '#7f1d1d');
        this.addMenuButton('No, continuar', 430, () => this.showPauseMenu(), '#1d4ed8');
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
                    color: '#f8fafc',
                    fontFamily: 'system-ui, sans-serif',
                    fontSize: '40px',
                })
                .setOrigin(0.5)
                .setScrollFactor(0)
                .setDepth(21),
        );
    }

    private addMenuButton(text: string, y: number, callback: () => void, color: string): void {
        this.menuObjects.push(
            this.scene.add
                .text(this.scene.scale.width / 2, y, text, {
                    backgroundColor: color,
                    color: '#f8fafc',
                    fontFamily: 'system-ui, sans-serif',
                    fontSize: '22px',
                })
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

    private formatTime(elapsed: number): string {
        const totalSeconds = Math.floor(elapsed / 1000);
        const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
        const seconds = (totalSeconds % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    }

    private textStyle(color: string, fontSize: string): Phaser.Types.GameObjects.Text.TextStyle {
        return {
            color,
            fontFamily: 'system-ui, sans-serif',
            fontSize,
        };
    }
}
