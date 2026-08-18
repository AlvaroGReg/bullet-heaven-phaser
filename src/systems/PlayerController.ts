import Phaser from 'phaser';
import type { Player } from '../entities/createPlayer';
import { CONTROLLER_DEAD_ZONE, TOUCH_DRAG_DEAD_ZONE } from '../game/constants';
import type { PlayerStats } from '../game/PlayerStats';

type PlayerControllerCallbacks = {
    attack: (aimDirection: Phaser.Math.Vector2) => void;
    toggleAutoAim: () => void;
};

export class PlayerController {
    private readonly cursors: Phaser.Types.Input.Keyboard.CursorKeys;

    private readonly movementKeys: Record<'up' | 'down' | 'left' | 'right', Phaser.Input.Keyboard.Key>;

    private readonly aimDirection = new Phaser.Math.Vector2(1, 0);

    private readonly touchMovement = new Phaser.Math.Vector2();

    private readonly touchOrigin = new Phaser.Math.Vector2();

    private gamepadAttackWasDown = false;

    private gamepadAutoAimWasDown = false;

    private touchPointerId?: number;

    public constructor(
        private readonly scene: Phaser.Scene,
        private readonly player: Player,
        private readonly stats: PlayerStats,
        private readonly callbacks: PlayerControllerCallbacks,
        private readonly touchInputEnabled: boolean,
    ) {
        this.cursors = this.scene.input.keyboard!.createCursorKeys();
        this.movementKeys = this.scene.input.keyboard!.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        }) as Record<'up' | 'down' | 'left' | 'right', Phaser.Input.Keyboard.Key>;

        this.scene.input.on(Phaser.Input.Events.POINTER_DOWN, this.handlePointerDown);
        this.scene.input.on(Phaser.Input.Events.POINTER_MOVE, this.handlePointerMove);
        this.scene.input.on(Phaser.Input.Events.POINTER_UP, this.clearTouchMovement);
        this.scene.input.on(Phaser.Input.Events.POINTER_UP_OUTSIDE, this.clearTouchMovement);
        this.scene.events.once(Phaser.Scenes.Events.SHUTDOWN, this.destroy, this);
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
                - Number(gamepad?.left ?? false)
                + this.touchMovement.x,
            vertical
                + (isLeftStickActive ? leftStick.y : 0)
                + Number(gamepad?.down ?? false)
                - Number(gamepad?.up ?? false)
                + this.touchMovement.y,
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
        if (!this.touchInputEnabled && gamepadAutoAimIsDown && !this.gamepadAutoAimWasDown) {
            this.callbacks.toggleAutoAim();
        }
        this.gamepadAutoAimWasDown = gamepadAutoAimIsDown;
    }

    private readonly handlePointerDown = (
        pointer: Phaser.Input.Pointer,
        currentlyOver: Phaser.GameObjects.GameObject[],
    ): void => {
        if (this.touchInputEnabled && pointer.wasTouch) {
            if (currentlyOver.length === 0 && this.touchPointerId === undefined) {
                this.touchPointerId = pointer.id;
                this.touchOrigin.set(pointer.x, pointer.y);
                this.touchMovement.set(0);
            }
            return;
        }

        if (pointer.rightButtonDown()) {
            if (!this.touchInputEnabled) {
                this.callbacks.toggleAutoAim();
            }
        } else if (currentlyOver.length === 0) {
            this.updateAimDirection(this.scene.input.gamepad?.pad1);
            this.callbacks.attack(this.aimDirection);
        }
    };

    private readonly handlePointerMove = (pointer: Phaser.Input.Pointer): void => {
        if (pointer.id !== this.touchPointerId) {
            return;
        }

        this.touchMovement.set(pointer.x - this.touchOrigin.x, pointer.y - this.touchOrigin.y);

        if (this.touchMovement.lengthSq() < TOUCH_DRAG_DEAD_ZONE ** 2) {
            this.touchMovement.set(0);
            return;
        }

        this.touchMovement.normalize();
    };

    private readonly clearTouchMovement = (pointer: Phaser.Input.Pointer): void => {
        if (pointer.id === this.touchPointerId) {
            this.touchPointerId = undefined;
            this.touchMovement.set(0);
        }
    };

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

    private destroy(): void {
        this.scene.input.off(Phaser.Input.Events.POINTER_DOWN, this.handlePointerDown);
        this.scene.input.off(Phaser.Input.Events.POINTER_MOVE, this.handlePointerMove);
        this.scene.input.off(Phaser.Input.Events.POINTER_UP, this.clearTouchMovement);
        this.scene.input.off(Phaser.Input.Events.POINTER_UP_OUTSIDE, this.clearTouchMovement);
    }
}
