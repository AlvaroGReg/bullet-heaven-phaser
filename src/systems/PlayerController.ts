import Phaser from 'phaser';
import { CONTROLLER_DEAD_ZONE } from '../game/constants';
import type { PlayerStats } from '../game/PlayerStats';

type PlayerControllerCallbacks = {
    attack: (aimDirection: Phaser.Math.Vector2) => void;
    toggleAutoAim: () => void;
};

export class PlayerController {
    private readonly cursors: Phaser.Types.Input.Keyboard.CursorKeys;

    private readonly movementKeys: Record<'up' | 'down' | 'left' | 'right', Phaser.Input.Keyboard.Key>;

    private readonly aimDirection = new Phaser.Math.Vector2(1, 0);

    private gamepadAttackWasDown = false;

    private gamepadAutoAimWasDown = false;

    public constructor(
        private readonly scene: Phaser.Scene,
        private readonly player: Phaser.GameObjects.Arc,
        private readonly stats: PlayerStats,
        private readonly callbacks: PlayerControllerCallbacks,
    ) {
        this.cursors = this.scene.input.keyboard!.createCursorKeys();
        this.movementKeys = this.scene.input.keyboard!.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        }) as Record<'up' | 'down' | 'left' | 'right', Phaser.Input.Keyboard.Key>;

        this.scene.input.on(
            Phaser.Input.Events.POINTER_DOWN,
            (pointer: Phaser.Input.Pointer, currentlyOver: Phaser.GameObjects.GameObject[]) => {
                if (pointer.rightButtonDown()) {
                    this.callbacks.toggleAutoAim();
                } else if (currentlyOver.length === 0) {
                    this.updateAimDirection(this.scene.input.gamepad?.pad1);
                    this.callbacks.attack(this.aimDirection);
                }
            },
        );
    }

    public update(): void {
        const gamepad = this.scene.input.gamepad?.pad1;
        const horizontal = Number(this.cursors.right.isDown || this.movementKeys.right.isDown)
            - Number(this.cursors.left.isDown || this.movementKeys.left.isDown);
        const vertical = Number(this.cursors.down.isDown || this.movementKeys.down.isDown)
            - Number(this.cursors.up.isDown || this.movementKeys.up.isDown);
        const leftStick = gamepad?.leftStick;
        const isLeftStickActive = leftStick && leftStick.lengthSq() >= CONTROLLER_DEAD_ZONE ** 2;
        const movement = new Phaser.Math.Vector2(
            horizontal
                + (isLeftStickActive ? leftStick.x : 0)
                + Number(gamepad?.right ?? false)
                - Number(gamepad?.left ?? false),
            vertical
                + (isLeftStickActive ? leftStick.y : 0)
                + Number(gamepad?.down ?? false)
                - Number(gamepad?.up ?? false),
        );

        if (movement.lengthSq() > 1) {
            movement.normalize();
        }

        const body = this.player.body as Phaser.Physics.Arcade.Body;
        body.setVelocity(movement.x * this.stats.movementSpeed, movement.y * this.stats.movementSpeed);
        this.updateAimDirection(gamepad);

        const gamepadAttackIsDown = gamepad?.A ?? false;
        if (gamepadAttackIsDown && !this.gamepadAttackWasDown) {
            this.callbacks.attack(this.aimDirection);
        }
        this.gamepadAttackWasDown = gamepadAttackIsDown;

        const gamepadAutoAimIsDown = gamepad?.B ?? false;
        if (gamepadAutoAimIsDown && !this.gamepadAutoAimWasDown) {
            this.callbacks.toggleAutoAim();
        }
        this.gamepadAutoAimWasDown = gamepadAutoAimIsDown;
    }

    private updateAimDirection(gamepad?: Phaser.Input.Gamepad.Gamepad): void {
        const rightStick = gamepad?.rightStick;

        if (rightStick && rightStick.lengthSq() >= CONTROLLER_DEAD_ZONE ** 2) {
            this.aimDirection.copy(rightStick).normalize();
            return;
        }

        this.aimDirection
            .set(
                this.scene.input.activePointer.worldX - this.player.x,
                this.scene.input.activePointer.worldY - this.player.y,
            )
            .normalize();
    }
}
