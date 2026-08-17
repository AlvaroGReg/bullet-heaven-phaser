import Phaser from 'phaser';
import type { Enemy } from '../entities/createEnemy';
import type { PlayerStats } from '../game/PlayerStats';
import {
    ENEMY_DAMAGE_COOLDOWN,
    ENEMY_SPEED,
    PLAYER_MAX_HEALTH,
} from '../game/constants';

type Projectile = Phaser.GameObjects.Arc & {
    piercing: number;
    hitEnemies: Set<Phaser.GameObjects.Arc>;
};

type CombatCallbacks = {
    onPlayerHealthChanged: (health: number) => void;
    onPlayerDeath: () => void;
    onEnemyDeath: (enemy: Enemy) => void;
};

export class CombatSystem {
    private readonly projectiles: Phaser.Physics.Arcade.Group;

    private readonly autoAimDirection = new Phaser.Math.Vector2();

    private playerHealth = PLAYER_MAX_HEALTH;

    private nextPlayerDamageAt = 0;

    private nextAutoAttackAt = 0;

    private gameOver = false;

    private autoAimEnabled = false;

    private handleProjectileHit: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (
        firstObject,
        secondObject,
    ) => {
        const firstGameObject = firstObject as Phaser.GameObjects.GameObject;
        const secondGameObject = secondObject as Phaser.GameObjects.GameObject;
        const projectile = (this.projectiles.contains(firstGameObject)
            ? firstGameObject
            : secondGameObject) as Projectile;
        const enemy = (projectile === firstGameObject ? secondGameObject : firstGameObject) as Enemy;

        if (!projectile.active || !enemy.active || projectile.hitEnemies.has(enemy)) {
            return;
        }

        projectile.hitEnemies.add(enemy);
        enemy.health -= this.stats.damage;

        if (enemy.health <= 0) {
            this.callbacks.onEnemyDeath(enemy);
            enemy.destroy();
        }

        if (projectile.hitEnemies.size > projectile.piercing) {
            projectile.destroy();
        }
    };

    public constructor(
        private readonly scene: Phaser.Scene,
        private readonly player: Phaser.GameObjects.Arc,
        private readonly enemies: Phaser.Physics.Arcade.Group,
        private readonly stats: PlayerStats,
        private readonly callbacks: CombatCallbacks,
    ) {
        this.projectiles = this.scene.physics.add.group();
        this.scene.physics.add.overlap(
            this.projectiles,
            this.enemies,
            this.handleProjectileHit,
            undefined,
            this,
        );
        this.scene.physics.add.overlap(this.player, this.enemies, this.handlePlayerHit, undefined, this);
    }

    public get health(): number {
        return this.playerHealth;
    }

    public get isGameOver(): boolean {
        return this.gameOver;
    }

    public update(): void {
        for (const gameObject of this.enemies.getChildren()) {
            const enemy = gameObject as Enemy;

            if (enemy.active) {
                this.scene.physics.moveToObject(enemy, this.player, ENEMY_SPEED);
            }
        }

        if (this.autoAimEnabled && this.updateAutoAim() && this.scene.time.now >= this.nextAutoAttackAt) {
            this.attack(this.autoAimDirection);
            this.nextAutoAttackAt = this.scene.time.now + this.stats.attackInterval;
        }
    }

    public attack(aimDirection: Phaser.Math.Vector2): void {
        const target = this.getClosestEnemy();

        if (this.gameOver || !target) {
            return;
        }

        const direction = this.autoAimEnabled
            ? this.autoAimDirection.set(target.x - this.player.x, target.y - this.player.y).normalize()
            : aimDirection;
        const projectile = this.scene.add.circle(this.player.x, this.player.y, 6, 0xffe28a) as Projectile;
        projectile.piercing = this.stats.projectilePiercing;
        projectile.hitEnemies = new Set();
        this.scene.physics.add.existing(projectile);
        this.projectiles.add(projectile);

        const body = projectile.body as Phaser.Physics.Arcade.Body;
        body.setVelocity(direction.x * this.stats.projectileSpeed, direction.y * this.stats.projectileSpeed);

        this.scene.time.delayedCall(this.stats.projectileLifetime, () => {
            if (projectile.active) {
                projectile.destroy();
            }
        });
    }

    public toggleAutoAim(): void {
        this.autoAimEnabled = !this.autoAimEnabled;
        this.nextAutoAttackAt = this.scene.time.now;
    }

    private updateAutoAim(): boolean {
        const target = this.getClosestEnemy();

        if (!target) {
            return false;
        }

        this.autoAimDirection.set(target.x - this.player.x, target.y - this.player.y).normalize();
        return true;
    }

    private getClosestEnemy(): Enemy | undefined {
        let closestEnemy: Enemy | undefined;
        let shortestDistance = Number.POSITIVE_INFINITY;

        for (const gameObject of this.enemies.getChildren()) {
            const enemy = gameObject as Enemy;
            const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y);

            if (enemy.active && distance < shortestDistance) {
                closestEnemy = enemy;
                shortestDistance = distance;
            }
        }

        return closestEnemy;
    }

    private handlePlayerHit(): void {
        if (this.gameOver || this.scene.time.now < this.nextPlayerDamageAt) {
            return;
        }

        this.nextPlayerDamageAt = this.scene.time.now + ENEMY_DAMAGE_COOLDOWN;
        this.playerHealth -= 1;
        this.callbacks.onPlayerHealthChanged(this.playerHealth);

        if (this.playerHealth <= 0) {
            this.gameOver = true;
            this.callbacks.onPlayerDeath();
        }
    }
}
