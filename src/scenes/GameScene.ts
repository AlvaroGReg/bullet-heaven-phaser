import Phaser from 'phaser';

const MAP_WIDTH = 2560;
const MAP_HEIGHT = 1600;
const PLAYER_SPEED = 280;
const ENEMY_SPEED = 120;

export class GameScene extends Phaser.Scene {
    private player!: Phaser.GameObjects.Arc;

    private enemy!: Phaser.GameObjects.Arc;

    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

    private movementKeys!: Record<'up' | 'down' | 'left' | 'right', Phaser.Input.Keyboard.Key>;

    public constructor() {
        super('game');
    }

    public create(): void {
        this.createMap();

        this.player = this.add.circle(MAP_WIDTH / 2, MAP_HEIGHT / 2, 18, 0x6ee7b7);
        this.player.setStrokeStyle(3, 0xd9fff0);
        this.physics.add.existing(this.player);

        const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
        playerBody.setCircle(18);
        playerBody.setCollideWorldBounds(true);

        this.enemy = this.add.circle(MAP_WIDTH / 2 - 360, MAP_HEIGHT / 2, 20, 0xf07178);
        this.enemy.setStrokeStyle(3, 0xffc2c5);
        this.physics.add.existing(this.enemy);

        const enemyBody = this.enemy.body as Phaser.Physics.Arcade.Body;
        enemyBody.setCircle(20);
        enemyBody.setCollideWorldBounds(true);

        this.cameras.main.setBounds(0, 0, MAP_WIDTH, MAP_HEIGHT);
        this.cameras.main.startFollow(this.player, true, 0.12, 0.12);

        this.cursors = this.input.keyboard!.createCursorKeys();
        this.movementKeys = this.input.keyboard!.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        }) as Record<'up' | 'down' | 'left' | 'right', Phaser.Input.Keyboard.Key>;

        this.add
            .text(24, 20, 'Muevete con WASD o las flechas', {
                color: '#d3dce5',
                fontFamily: 'system-ui, sans-serif',
                fontSize: '18px',
            })
            .setScrollFactor(0);
    }

    public update(): void {
        const horizontal = Number(this.cursors.right.isDown || this.movementKeys.right.isDown)
            - Number(this.cursors.left.isDown || this.movementKeys.left.isDown);
        const vertical = Number(this.cursors.down.isDown || this.movementKeys.down.isDown)
            - Number(this.cursors.up.isDown || this.movementKeys.up.isDown);

        const movement = new Phaser.Math.Vector2(horizontal, vertical).normalize().scale(PLAYER_SPEED);
        const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
        playerBody.setVelocity(movement.x, movement.y);

        this.physics.moveToObject(this.enemy, this.player, ENEMY_SPEED);
    }

    private createMap(): void {
        this.physics.world.setBounds(0, 0, MAP_WIDTH, MAP_HEIGHT);

        const map = this.add.graphics();
        map.fillStyle(0x17212b);
        map.fillRect(0, 0, MAP_WIDTH, MAP_HEIGHT);
        map.lineStyle(1, 0x2a3b48, 0.65);

        for (let x = 0; x <= MAP_WIDTH; x += 64) {
            map.lineBetween(x, 0, x, MAP_HEIGHT);
        }

        for (let y = 0; y <= MAP_HEIGHT; y += 64) {
            map.lineBetween(0, y, MAP_WIDTH, y);
        }

        map.lineStyle(8, 0x4e6773);
        map.strokeRect(4, 4, MAP_WIDTH - 8, MAP_HEIGHT - 8);
    }
}
