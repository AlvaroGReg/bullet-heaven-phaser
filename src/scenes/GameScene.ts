import Phaser from 'phaser';
import { createEnemy } from '../entities/createEnemy';
import { createPlayer } from '../entities/createPlayer';
import { MAP_HEIGHT, MAP_WIDTH, PLAYER_MAX_HEALTH } from '../game/constants';
import { PlayerStats } from '../game/PlayerStats';
import { CombatSystem } from '../systems/CombatSystem';
import { EnemySpawner } from '../systems/EnemySpawner';
import { ExperienceSystem } from '../systems/ExperienceSystem';
import { PlayerController } from '../systems/PlayerController';
import { UpgradeSystem } from '../systems/UpgradeSystem';
import type { Upgrade } from '../systems/UpgradeSystem';
import { createArena } from '../world/createArena';

export class GameScene extends Phaser.Scene {
    private player!: Phaser.GameObjects.Arc;

    private enemies!: Phaser.Physics.Arcade.Group;

    private combat!: CombatSystem;

    private controller!: PlayerController;

    private enemySpawner!: EnemySpawner;

    private experience!: ExperienceSystem;

    private stats!: PlayerStats;

    private upgrades!: UpgradeSystem;

    private healthText!: Phaser.GameObjects.Text;

    private experienceText!: Phaser.GameObjects.Text;

    private pauseText!: Phaser.GameObjects.Text;

    private pauseKey!: Phaser.Input.Keyboard.Key;

    private paused = false;

    private gamepadStartWasDown = false;

    private upgradeSelectionActive = false;

    private pendingUpgradeSelections = 0;

    private upgradeOverlay?: Phaser.GameObjects.Rectangle;

    private upgradeTitle?: Phaser.GameObjects.Text;

    private upgradeCards: Phaser.GameObjects.Text[] = [];

    public constructor() {
        super('game');
    }

    public create(): void {
        createArena(this);

        this.player = createPlayer(this, MAP_WIDTH / 2, MAP_HEIGHT / 2);
        const enemy = createEnemy(this, MAP_WIDTH / 2 - 360, MAP_HEIGHT / 2);
        this.enemies = this.physics.add.group();
        this.enemies.add(enemy);

        this.stats = new PlayerStats();
        this.experience = new ExperienceSystem(this, this.player, this.stats, {
            onExperienceChanged: this.updateExperience,
            onLevelUp: this.queueUpgradeSelection,
        });
        this.upgrades = new UpgradeSystem(this.stats);
        this.combat = new CombatSystem(this, this.player, this.enemies, this.stats, {
            onPlayerHealthChanged: this.updateHealth,
            onPlayerDeath: this.endGame,
            onEnemyDeath: (defeatedEnemy) => this.experience.spawn(defeatedEnemy.x, defeatedEnemy.y),
        });
        this.controller = new PlayerController(this, this.player, this.stats, {
            attack: (aimDirection) => {
                if (!this.paused && !this.upgradeSelectionActive) {
                    this.combat.attack(aimDirection);
                }
            },
            toggleAutoAim: () => {
                if (!this.paused && !this.upgradeSelectionActive) {
                    this.combat.toggleAutoAim();
                }
            },
        });
        this.enemySpawner = new EnemySpawner(this, this.player, this.enemies);
        this.pauseKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        this.cameras.main.setBounds(0, 0, MAP_WIDTH, MAP_HEIGHT);
        this.cameras.main.startFollow(this.player, true, 0.12, 0.12);

        this.healthText = this.add
            .text(24, 20, `Vida: ${this.combat.health}/${PLAYER_MAX_HEALTH}`, {
                color: '#d3dce5',
                fontFamily: 'system-ui, sans-serif',
                fontSize: '18px',
            })
            .setScrollFactor(0);

        this.experienceText = this.add
            .text(
                24,
                44,
                `Nivel: ${this.experience.currentLevel}  EXP: ${this.formatExperience(this.experience.currentExperience)}/${this.experience.currentRequiredExperience}`,
                {
                    color: '#bae6fd',
                    fontFamily: 'system-ui, sans-serif',
                    fontSize: '18px',
                },
            )
            .setScrollFactor(0);

        this.add
            .text(24, 76, 'Muevete con WASD, flechas, cruceta o stick izquierdo', {
                color: '#aebac6',
                fontFamily: 'system-ui, sans-serif',
                fontSize: '16px',
            })
            .setScrollFactor(0);

        this.add
            .text(24, 100, 'Apunta con raton o stick derecho. Dispara con click o A / X.', {
                color: '#aebac6',
                fontFamily: 'system-ui, sans-serif',
                fontSize: '16px',
            })
            .setScrollFactor(0);

        this.add
            .text(24, 124, 'Activa el modo automatico con click secundario o B / O.', {
                color: '#aebac6',
                fontFamily: 'system-ui, sans-serif',
                fontSize: '16px',
            })
            .setScrollFactor(0);

        this.pauseText = this.add
            .text(this.scale.width / 2, this.scale.height / 2, 'Pausado\nESC o Start para continuar', {
                align: 'center',
                color: '#ffffff',
                fontFamily: 'system-ui, sans-serif',
                fontSize: '40px',
            })
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setVisible(false);
    }

    public update(): void {
        this.updatePauseInput();

        if (this.combat.isGameOver || this.paused || this.upgradeSelectionActive) {
            return;
        }

        this.controller.update();
        this.enemySpawner.update();
        this.combat.update();
    }

    private updateHealth = (health: number): void => {
        this.healthText.setText(`Vida: ${Math.max(health, 0)}/${PLAYER_MAX_HEALTH}`);
    };

    private updateExperience = (level: number, experience: number, requiredExperience: number): void => {
        this.experienceText.setText(`Nivel: ${level}  EXP: ${this.formatExperience(experience)}/${requiredExperience}`);
    };

    private formatExperience(experience: number): string {
        return Number.isInteger(experience) ? `${experience}` : experience.toFixed(1);
    }

    private queueUpgradeSelection = (): void => {
        if (this.upgradeSelectionActive) {
            this.pendingUpgradeSelections += 1;
            return;
        }

        this.showUpgradeSelection();
    };

    private showUpgradeSelection(): void {
        this.upgradeSelectionActive = true;
        this.physics.pause();
        this.upgradeOverlay = this.add
            .rectangle(this.scale.width / 2, this.scale.height / 2, this.scale.width, this.scale.height, 0x080b10, 0.86)
            .setScrollFactor(0)
            .setDepth(10);

        this.upgradeTitle = this.add
            .text(this.scale.width / 2, 150, 'Elige una mejora', {
                color: '#f8fafc',
                fontFamily: 'system-ui, sans-serif',
                fontSize: '36px',
            })
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(11);

        const choices = this.upgrades.createChoices(3);
        this.upgradeCards = choices.map((upgrade, index) => this.createUpgradeCard(upgrade, index));
    }

    private createUpgradeCard(upgrade: Upgrade, index: number): Phaser.GameObjects.Text {
        const card = this.add
            .text(330 + index * 310, this.scale.height / 2, `${upgrade.name}\n${upgrade.rarity.name}\n${upgrade.description}`, {
                align: 'center',
                color: '#111827',
                fontFamily: 'system-ui, sans-serif',
                fontSize: '20px',
                wordWrap: { width: 220 },
            })
            .setOrigin(0.5)
            .setFixedSize(250, 170)
            .setPadding(15)
            .setBackgroundColor(upgrade.rarity.color)
            .setScrollFactor(0)
            .setDepth(11)
            .setInteractive({ useHandCursor: true })
            .on(Phaser.Input.Events.POINTER_DOWN, () => this.selectUpgrade(upgrade));

        return card;
    }

    private selectUpgrade(upgrade: Upgrade): void {
        upgrade.apply();
        this.upgradeOverlay?.destroy();
        this.upgradeOverlay = undefined;
        this.upgradeTitle?.destroy();
        this.upgradeTitle = undefined;
        this.upgradeCards.forEach((card) => card.destroy());
        this.upgradeCards = [];

        if (this.pendingUpgradeSelections > 0) {
            this.pendingUpgradeSelections -= 1;
            this.showUpgradeSelection();
            return;
        }

        this.upgradeSelectionActive = false;

        if (!this.paused) {
            this.physics.resume();
        }
    }

    private updatePauseInput(): void {
        const startIsDown = this.input.gamepad?.pad1?.buttons[9]?.pressed ?? false;

        if (Phaser.Input.Keyboard.JustDown(this.pauseKey) || (startIsDown && !this.gamepadStartWasDown)) {
            this.togglePause();
        }

        this.gamepadStartWasDown = startIsDown;
    }

    private togglePause(): void {
        if (this.combat.isGameOver || this.upgradeSelectionActive) {
            return;
        }

        this.paused = !this.paused;
        this.pauseText.setVisible(this.paused);

        if (this.paused) {
            this.physics.pause();
        } else {
            this.physics.resume();
        }
    }

    private endGame = (): void => {
        this.physics.pause();
        this.player.setFillStyle(0x5c6670);

        this.add
            .text(this.scale.width / 2, this.scale.height / 2, 'Has muerto', {
                color: '#ffffff',
                fontFamily: 'system-ui, sans-serif',
                fontSize: '48px',
            })
            .setOrigin(0.5)
            .setScrollFactor(0);
    };
}
