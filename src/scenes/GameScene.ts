import Phaser from 'phaser';
import { createEnemy } from '../entities/createEnemy';
import { createPlayer } from '../entities/createPlayer';
import type { Player } from '../entities/createPlayer';
import { MAP_HEIGHT, MAP_WIDTH } from '../game/constants';
import { AchievementSystem } from '../game/Achievements';
import { metaProgress } from '../game/MetaProgress';
import { PlayerStats } from '../game/PlayerStats';
import { i18n } from '../i18n';
import { CombatSystem } from '../systems/CombatSystem';
import { CurrencySystem } from '../systems/CurrencySystem';
import { EnemySpawner } from '../systems/EnemySpawner';
import { ExperienceSystem } from '../systems/ExperienceSystem';
import { PlayerController } from '../systems/PlayerController';
import { UpgradeSystem } from '../systems/UpgradeSystem';
import type { Upgrade } from '../systems/UpgradeSystem';
import { WeaponSystem } from '../systems/WeaponSystem';
import { GameHud } from '../ui/GameHud';
import {
    createDiamond,
    createFrame,
    createRuleMark,
    GRIM,
    GRIM_INT,
    grimHeadingStyle,
    grimLabelStyle,
    grimTextStyle,
} from '../ui/grimTheme';
import { createArena } from '../world/createArena';
import { createRogueTextures } from '../sprites/rogue';

type RarityStyle = {
    borderColor: number;
    borderWidth: number;
    labelColor: string;
    chipFillHex?: string;
    chipTextColor?: string;
    glowAlpha?: number;
    diamonds: number;
};

const RARITY_STYLES: Record<string, RarityStyle> = {
    common: { borderColor: GRIM_INT.lineFine, borderWidth: 1, labelColor: GRIM.mutedText, diamonds: 0 },
    uncommon: { borderColor: GRIM_INT.mutedText, borderWidth: 1, labelColor: GRIM.text, diamonds: 0 },
    rare: { borderColor: GRIM_INT.accentMid, borderWidth: 1, labelColor: GRIM.accentText, diamonds: 0 },
    epic: {
        borderColor: GRIM_INT.accent,
        borderWidth: 1,
        labelColor: GRIM.accentText,
        chipFillHex: GRIM.accentDeep,
        chipTextColor: '#f5f4ff',
        glowAlpha: 0.12,
        diamonds: 1,
    },
    legendary: {
        borderColor: GRIM_INT.accent,
        borderWidth: 2,
        labelColor: GRIM.accentText,
        chipFillHex: GRIM.accentMid,
        chipTextColor: '#f5f4ff',
        glowAlpha: 0.18,
        diamonds: 2,
    },
    mythic: {
        borderColor: GRIM_INT.accentText,
        borderWidth: 2,
        labelColor: GRIM.accentText,
        chipFillHex: GRIM.accent,
        chipTextColor: GRIM.bg,
        glowAlpha: 0.26,
        diamonds: 3,
    },
};

export class GameScene extends Phaser.Scene {
    private player!: Player;

    private enemies!: Phaser.Physics.Arcade.Group;

    private combat!: CombatSystem;

    private achievements!: AchievementSystem;

    private controller!: PlayerController;

    private currency!: CurrencySystem;

    private enemySpawner!: EnemySpawner;

    private experience!: ExperienceSystem;

    private stats!: PlayerStats;

    private upgrades!: UpgradeSystem;

    private weapons!: WeaponSystem;

    private hud!: GameHud;

    private pauseKey!: Phaser.Input.Keyboard.Key;

    private readonly hasTouchInput = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    private paused = false;

    private gamepadStartWasDown = false;

    private upgradeSelectionActive = false;

    private pendingUpgradeSelections = 0;

    private upgradeOverlay?: Phaser.GameObjects.Rectangle;

    private upgradeFrame?: Phaser.GameObjects.Container;

    private upgradeTitle?: Phaser.GameObjects.Text;

    private upgradeTitleRule?: Phaser.GameObjects.Container;

    private upgradeCards: Phaser.GameObjects.Container[] = [];

    private completed = false;

    private elapsedGameTime = 0;

    public constructor() {
        super('game');
    }

    public create(): void {
        this.time.paused = false;
        this.paused = false;
        this.gamepadStartWasDown = false;
        this.upgradeSelectionActive = false;
        this.pendingUpgradeSelections = 0;
        this.completed = false;
        this.elapsedGameTime = 0;
        createArena(this);
        createRogueTextures(this);

        this.player = createPlayer(this, MAP_WIDTH / 2, MAP_HEIGHT / 2);
        const enemy = createEnemy(this, MAP_WIDTH / 2 - 360, MAP_HEIGHT / 2);
        this.enemies = this.physics.add.group();
        this.enemies.add(enemy);

        this.stats = new PlayerStats();
        this.achievements = new AchievementSystem();
        this.weapons = new WeaponSystem();
        this.experience = new ExperienceSystem(this, this.player, this.stats, {
            onExperienceChanged: (level, experience, requiredExperience) => {
                this.achievements.recordLevel(level);
                this.updateExperience(level, experience, requiredExperience);
            },
            onLevelUp: this.queueUpgradeSelection,
        });
        this.currency = new CurrencySystem(this, this.player, (amount) => {
            metaProgress.addGold(amount);
            this.achievements.recordCoinCollected(amount);
            this.hud.setGold(metaProgress.currentGold);
        });
        this.combat = new CombatSystem(this, this.player, this.enemies, this.stats, this.weapons, {
            onPlayerHealthChanged: this.updateHealth,
            onPlayerDeath: () => {
                this.achievements.recordDeath();
                this.endGame();
            },
            onPlayerDamaged: (amount) => this.achievements.recordDamageTaken(amount),
            onAreaImpact: (kills) => this.achievements.recordAreaImpact(kills),
            onEnemyDeath: (defeatedEnemy, weapon) => {
                this.achievements.recordKill(defeatedEnemy.kind, weapon);
                this.experience.spawn(
                    defeatedEnemy.x,
                    defeatedEnemy.y,
                    defeatedEnemy.experienceMultiplier,
                    defeatedEnemy.grantsFullLevel,
                );
                this.currency.trySpawn(defeatedEnemy.x, defeatedEnemy.y, defeatedEnemy.goldDropChance);
                if (defeatedEnemy.isFinalBoss) {
                    this.completeGame();
                }
            },
        });
        if (this.hasTouchInput) {
            this.combat.enableAutoAim();
        }
        this.upgrades = new UpgradeSystem(
            this.stats,
            (amount) => this.combat.increaseMaxHealth(amount),
            this.weapons,
        );
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
        }, this.hasTouchInput);
        this.enemySpawner = new EnemySpawner(this, this.player, this.enemies);
        this.pauseKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        this.cameras.main.setBounds(0, 0, MAP_WIDTH, MAP_HEIGHT);
        this.cameras.main.startFollow(this.player, true, 0.12, 0.12);

        this.hud = new GameHud(
            this,
            this.combat.health,
            this.combat.maxHealth,
            this.experience.currentLevel,
            this.experience.currentExperience,
            this.experience.currentRequiredExperience,
            {
                onResume: this.resumeGame,
                onRestart: this.restartGame,
                onMainMenu: this.returnToMenu,
                onTogglePause: this.togglePause,
            },
            metaProgress.currentGold,
            this.hasTouchInput,
        );
    }

    public update(_time: number, delta: number): void {
        this.updatePauseInput();

        if (this.combat.isGameOver || this.completed || this.paused || this.upgradeSelectionActive) {
            return;
        }

        this.elapsedGameTime += delta;
        this.hud.update(delta);
        this.achievements.update(delta);
        this.controller.update();
        this.experience.update();

        if (this.upgradeSelectionActive) {
            return;
        }

        this.enemySpawner.update(this.elapsedGameTime);
        this.combat.update(delta);
    }

    private updateHealth = (health: number, maxHealth: number): void => {
        this.hud.setHealth(health, maxHealth);
    };

    private updateExperience = (level: number, experience: number, requiredExperience: number): void => {
        this.hud.setExperience(level, experience, requiredExperience);
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
        this.time.paused = true;
        this.upgradeOverlay = this.add
            .rectangle(this.scale.width / 2, this.scale.height / 2, this.scale.width, this.scale.height, 0x0d0f16, 0.86)
            .setScrollFactor(0)
            .setDepth(10);

        this.upgradeFrame = createFrame(this).setScrollFactor(0).setDepth(10);

        this.upgradeTitleRule = createRuleMark(this, this.scale.width / 2, 104)
            .setScrollFactor(0)
            .setDepth(11);

        this.upgradeTitle = this.add
            .text(this.scale.width / 2, 150, i18n.t('upgrade.choose').toUpperCase(), {
                ...grimHeadingStyle(GRIM.text, '36px'),
            })
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(11);

        const choices = this.upgrades.createChoices(3, this.experience.currentLevel);
        this.upgradeCards = choices.map((upgrade, index) => this.createUpgradeCard(upgrade, index));
    }

    private createUpgradeCard(upgrade: Upgrade, index: number): Phaser.GameObjects.Container {
        const x = 330 + index * 310;
        const y = this.scale.height / 2;
        const width = 250;
        const height = 190;
        const style = RARITY_STYLES[upgrade.rarity.id] ?? RARITY_STYLES.common;

        const objects: Phaser.GameObjects.GameObject[] = [];

        if (style.glowAlpha) {
            objects.push(this.add.rectangle(0, 0, width + 24, height + 24, style.borderColor, style.glowAlpha));
        }

        for (let i = 0; i < style.diamonds; i += 1) {
            const offset = (i - (style.diamonds - 1) / 2) * 16;
            objects.push(createDiamond(this, offset, -height / 2 - 14, 7, style.borderColor));
        }

        objects.push(this.add.rectangle(0, 0, width, height, 0x000000, 0).setStrokeStyle(style.borderWidth, style.borderColor));

        const rarityLabel = i18n.t(`rarity.${upgrade.rarity.id}`).toUpperCase();
        if (style.chipFillHex) {
            objects.push(
                this.add.text(0, -height / 2 + 22, rarityLabel, grimLabelStyle(style.chipTextColor ?? GRIM.text, '12px'))
                    .setOrigin(0.5)
                    .setPadding(8, 4)
                    .setBackgroundColor(style.chipFillHex),
            );
        } else {
            objects.push(
                this.add.text(0, -height / 2 + 22, rarityLabel, grimLabelStyle(style.labelColor, '12px')).setOrigin(0.5),
            );
        }

        objects.push(
            this.add.text(0, -6, upgrade.name, {
                ...grimHeadingStyle(GRIM.text, '18px', 1),
                align: 'center',
                wordWrap: { width: 220 },
            }).setOrigin(0.5),
        );
        objects.push(
            this.add.text(0, 48, upgrade.description, {
                ...grimTextStyle(GRIM.mutedText, '14px'),
                align: 'center',
                wordWrap: { width: 210 },
            }).setOrigin(0.5),
        );

        const card = this.add.container(x, y, objects);
        card.setScrollFactor(0).setDepth(11);
        card.setSize(width, height);
        card.setInteractive(
            new Phaser.Geom.Rectangle(0, 0, width, height),
            Phaser.Geom.Rectangle.Contains,
        ).on(Phaser.Input.Events.POINTER_DOWN, () => this.selectUpgrade(upgrade));

        return card;
    }

    private selectUpgrade(upgrade: Upgrade): void {
        upgrade.apply();
        this.achievements.recordUpgradeSelected();
        this.achievements.recordStats(this.stats);
        if (upgrade.type === 'weapon') {
            this.achievements.recordWeaponsEquipped(this.weapons.weapons.length - 1);
        }
        this.upgradeOverlay?.destroy();
        this.upgradeOverlay = undefined;
        this.upgradeFrame?.destroy();
        this.upgradeFrame = undefined;
        this.upgradeTitleRule?.destroy();
        this.upgradeTitleRule = undefined;
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
            this.time.paused = false;
        }
    }

    private updatePauseInput(): void {
        const startIsDown = this.input.gamepad?.pad1?.buttons[9]?.pressed ?? false;

        if (Phaser.Input.Keyboard.JustDown(this.pauseKey) || (startIsDown && !this.gamepadStartWasDown)) {
            this.togglePause();
        }

        this.gamepadStartWasDown = startIsDown;
    }

    private togglePause = (): void => {
        if (this.combat.isGameOver || this.completed || this.upgradeSelectionActive) {
            return;
        }

        this.paused = !this.paused;
        this.hud.setPaused(this.paused);

        if (this.paused) {
            this.physics.pause();
            this.time.paused = true;
        } else {
            this.physics.resume();
            this.time.paused = false;
        }
    };

    private resumeGame = (): void => {
        if (this.paused) {
            this.togglePause();
        }
    };

    private restartGame = (): void => {
        this.scene.restart();
    };

    private returnToMenu = (): void => {
        this.scene.start('menu');
    };

    private endGame = (): void => {
        this.physics.pause();
        this.time.paused = true;
        this.player.setTint(0x5c6670);
        this.hud.showGameOver();
    };

    private completeGame(): void {
        this.completed = true;
        this.achievements.recordVictory(this.elapsedGameTime / 1000, this.combat.health);
        this.physics.pause();
        this.time.paused = true;
        this.player.setTint(0x60a5fa);
        this.hud.showVictory();
    }
}
