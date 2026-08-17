import Phaser from 'phaser';
import type { Enemy } from '../entities/createEnemy';
import type { PlayerStats } from '../game/PlayerStats';
import {
    ENEMY_DAMAGE_COOLDOWN,
    PLAYER_MAX_HEALTH,
} from '../game/constants';

type Projectile = Phaser.GameObjects.Arc & {
    piercing: number;
    hitEnemies: Set<Phaser.GameObjects.Arc>;
};

type EnemyProjectile = Phaser.GameObjects.Arc & {
    damage: number;
};

type CombatCallbacks = {
    onPlayerHealthChanged: (health: number) => void;
    onPlayerDeath: () => void;
    onEnemyDeath: (enemy: Enemy) => void;
};

export class CombatSystem {
    private readonly projectiles: Phaser.Physics.Arcade.Group;

    private readonly enemyProjectiles: Phaser.Physics.Arcade.Group;

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
        this.damageEnemy(enemy, this.stats.damage);

        if (projectile.hitEnemies.size > projectile.piercing) {
            projectile.destroy();
        }
    };

    private handleEnemyProjectileHit: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (
        firstObject,
        secondObject,
    ) => {
        const firstGameObject = firstObject as Phaser.GameObjects.GameObject;
        const secondGameObject = secondObject as Phaser.GameObjects.GameObject;
        const projectile = (this.enemyProjectiles.contains(firstGameObject)
            ? firstGameObject
            : secondGameObject) as EnemyProjectile;

        if (!projectile.active) {
            return;
        }

        projectile.destroy();
        this.damagePlayer(projectile.damage);
    };

    private handlePlayerHit: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (firstObject, secondObject) => {
        const firstGameObject = firstObject as Phaser.GameObjects.GameObject;
        const secondGameObject = secondObject as Phaser.GameObjects.GameObject;
        const enemy = (this.enemies.contains(firstGameObject) ? firstGameObject : secondGameObject) as Enemy;

        if (enemy.active) {
            this.damagePlayer(enemy.damage);
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
        this.enemyProjectiles = this.scene.physics.add.group();
        this.scene.physics.add.overlap(
            this.projectiles,
            this.enemies,
            this.handleProjectileHit,
            undefined,
            this,
        );
        this.scene.physics.add.overlap(this.player, this.enemies, this.handlePlayerHit, undefined, this);
        this.scene.physics.add.overlap(
            this.enemyProjectiles,
            this.player,
            this.handleEnemyProjectileHit,
            undefined,
            this,
        );
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
                this.updateEnemy(enemy);
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

    private updateEnemy(enemy: Enemy): void {
        const distance = Phaser.Math.Distance.Between(enemy.x, enemy.y, this.player.x, this.player.y);

        if (enemy.ranged) {
            if (distance > enemy.ranged.attackRange) {
                this.scene.physics.moveToObject(enemy, this.player, enemy.speed);
            } else {
                const body = enemy.body as Phaser.Physics.Arcade.Body;
                body.setVelocity(0);
            }

            if (distance <= enemy.ranged.attackRange && this.scene.time.now >= enemy.nextAttackAt) {
                this.fireEnemyProjectile(enemy);
                enemy.nextAttackAt = this.scene.time.now + enemy.ranged.attackInterval;
            }

            return;
        }

        this.scene.physics.moveToObject(enemy, this.player, enemy.speed);
    }

    private fireEnemyProjectile(enemy: Enemy): void {
        const projectile = this.scene.add.circle(enemy.x, enemy.y, 5, 0xfb7185) as EnemyProjectile;
        projectile.damage = enemy.damage;
        this.scene.physics.add.existing(projectile);
        this.enemyProjectiles.add(projectile);
        this.scene.physics.moveToObject(projectile, this.player, enemy.ranged!.projectileSpeed);

        this.scene.time.delayedCall(2500, () => {
            if (projectile.active) {
                projectile.destroy();
            }
        });
    }

    private damageEnemy(enemy: Enemy, damage: number): void {
        const reducedDamage = enemy.armored ? damage * 0.8 : damage;
        enemy.health -= reducedDamage;

        if (enemy.health <= 0) {
            this.callbacks.onEnemyDeath(enemy);
            enemy.destroy();
        }
    }

    private damagePlayer(damage: number): void {
        if (this.gameOver || this.scene.time.now < this.nextPlayerDamageAt) {
            return;
        }

        this.nextPlayerDamageAt = this.scene.time.now + ENEMY_DAMAGE_COOLDOWN;
        this.playerHealth -= damage;
        this.callbacks.onPlayerHealthChanged(this.playerHealth);

        if (this.playerHealth <= 0) {
            this.gameOver = true;
            this.callbacks.onPlayerDeath();
        }
    }
}
