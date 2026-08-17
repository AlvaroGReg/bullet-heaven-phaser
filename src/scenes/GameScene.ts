import Phaser from 'phaser';
import { createEnemy } from '../entities/createEnemy';
import { createPlayer } from '../entities/createPlayer';
import { MAP_HEIGHT, MAP_WIDTH, PLAYER_MAX_HEALTH } from '../game/constants';
import { CombatSystem } from '../systems/CombatSystem';
import { PlayerController } from '../systems/PlayerController';
import { createArena } from '../world/createArena';

export class GameScene extends Phaser.Scene {
    private player!: Phaser.GameObjects.Arc;

    private enemies!: Phaser.Physics.Arcade.Group;

    private combat!: CombatSystem;

    private controller!: PlayerController;

    private healthText!: Phaser.GameObjects.Text;

    public constructor() {
        super('game');
    }

    public create(): void {
        createArena(this);

        this.player = createPlayer(this, MAP_WIDTH / 2, MAP_HEIGHT / 2);
        const enemy = createEnemy(this, MAP_WIDTH / 2 - 360, MAP_HEIGHT / 2);
        this.enemies = this.physics.add.group();
        this.enemies.add(enemy);

        this.combat = new CombatSystem(this, this.player, this.enemies, {
            onPlayerHealthChanged: this.updateHealth,
            onPlayerDeath: this.endGame,
        });
        this.controller = new PlayerController(this, this.player, {
            attack: (aimDirection) => this.combat.attack(aimDirection),
            toggleAutoAim: () => this.combat.toggleAutoAim(),
        });

        this.cameras.main.setBounds(0, 0, MAP_WIDTH, MAP_HEIGHT);
        this.cameras.main.startFollow(this.player, true, 0.12, 0.12);

        this.healthText = this.add
            .text(24, 20, `Vida: ${this.combat.health}/${PLAYER_MAX_HEALTH}`, {
                color: '#d3dce5',
                fontFamily: 'system-ui, sans-serif',
                fontSize: '18px',
            })
            .setScrollFactor(0);

        this.add
            .text(24, 48, 'Muevete con WASD, flechas, cruceta o stick izquierdo', {
                color: '#aebac6',
                fontFamily: 'system-ui, sans-serif',
                fontSize: '16px',
            })
            .setScrollFactor(0);

        this.add
            .text(24, 72, 'Apunta con raton o stick derecho. Dispara con click o A / X.', {
                color: '#aebac6',
                fontFamily: 'system-ui, sans-serif',
                fontSize: '16px',
            })
            .setScrollFactor(0);

        this.add
            .text(24, 96, 'Activa el modo automatico con click secundario o B / O.', {
                color: '#aebac6',
                fontFamily: 'system-ui, sans-serif',
                fontSize: '16px',
            })
            .setScrollFactor(0);
    }

    public update(): void {
        if (this.combat.isGameOver) {
            return;
        }

        this.controller.update();
        this.combat.update();
    }

    private updateHealth = (health: number): void => {
        this.healthText.setText(`Vida: ${Math.max(health, 0)}/${PLAYER_MAX_HEALTH}`);
    };

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
