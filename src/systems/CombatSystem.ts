import Phaser from 'phaser';
import type { Enemy } from '../entities/createEnemy';
import type { Player } from '../entities/createPlayer';
import { DAGGER_TEXTURE } from '../sprites/rogue';
import { WEAPON_TEXTURES } from '../sprites/weapons';
import { ENEMY_DAMAGE_COOLDOWN } from '../game/constants';
import type { PlayerStats } from '../game/PlayerStats';
import { WEAPON_DEFINITIONS } from './WeaponSystem';
import type { WeaponSystem } from './WeaponSystem';
import type { WeaponKind } from './WeaponSystem';

type Projectile = (Phaser.GameObjects.Arc | Phaser.Physics.Arcade.Sprite) & {
    areaRadius: number;
    damage: number;
    piercing: number;
    weapon: WeaponKind;
    hitEnemies: Set<Enemy>;
};

type EnemyProjectile = Phaser.GameObjects.Arc & {
    damage: number;
};

type CombatCallbacks = {
    onPlayerHealthChanged: (health: number, maxHealth: number) => void;
    onPlayerDeath: () => void;
    onEnemyDeath: (enemy: Enemy, weapon: WeaponKind) => void;
    onAreaImpact: (kills: number) => void;
    onPlayerDamaged: (amount: number) => void;
};

export class CombatSystem {
    private readonly projectiles: Phaser.Physics.Arcade.Group;

    private readonly enemyProjectiles: Phaser.Physics.Arcade.Group;

    private readonly autoAimDirection = new Phaser.Math.Vector2();

    private playerHealth: number;

    private nextPlayerDamageAt = 0;

    private gameOver = false;

    private autoAimEnabled = false;

    private invulnerable = false;

    private elapsedGameTime = 0;

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
        const primaryKill = this.damageEnemy(enemy, projectile.damage, projectile.weapon);

        if (projectile.areaRadius > 0) {
            this.callbacks.onAreaImpact((primaryKill ? 1 : 0) + this.damageArea(projectile, enemy));
        }

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
        private readonly player: Player,
        private readonly enemies: Phaser.Physics.Arcade.Group,
        private readonly stats: PlayerStats,
        private readonly weapons: WeaponSystem,
        private readonly callbacks: CombatCallbacks,
    ) {
        this.playerHealth = this.stats.maxHealth;
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

    public get maxHealth(): number {
        return this.stats.maxHealth;
    }

    public get isGameOver(): boolean {
        return this.gameOver;
    }

    public get isInvulnerable(): boolean {
        return this.invulnerable;
    }

    public update(delta: number): void {
        this.elapsedGameTime += delta;
        this.regeneratePlayer(delta);

        for (const gameObject of this.enemies.getChildren()) {
            const enemy = gameObject as Enemy;

            if (enemy.active) {
                this.updateEnemy(enemy);
            }
        }

        if (this.autoAimEnabled && this.weapons.hasReadyWeapon(this.elapsedGameTime)) {
            const target = this.updateAutoAim();

            if (target) {
                this.attack(this.autoAimDirection, target);
            }
        }
    }

    public attack(aimDirection: Phaser.Math.Vector2, target = this.getClosestEnemy()): void {

        if (this.gameOver || !target) {
            return;
        }

        const direction = this.autoAimEnabled
            ? this.autoAimDirection.set(target.x - this.player.x, target.y - this.player.y).normalize()
            : aimDirection;

        for (const weapon of this.weapons.weapons) {
            this.fireWeapon(weapon, direction);
        }
    }

    public toggleAutoAim(): void {
        this.autoAimEnabled = !this.autoAimEnabled;
    }

    public enableAutoAim(): void {
        this.autoAimEnabled = true;
    }

    public increaseMaxHealth(amount: number): void {
        this.stats.maxHealth += amount;
        this.playerHealth += amount;
        this.callbacks.onPlayerHealthChanged(this.playerHealth, this.stats.maxHealth);
    }

    public setInvulnerable(invulnerable: boolean): void {
        this.invulnerable = invulnerable;
    }

    private fireWeapon(weapon: keyof typeof WEAPON_DEFINITIONS, direction: Phaser.Math.Vector2): void {
        const definition = WEAPON_DEFINITIONS[weapon];
        const attackInterval = this.getAttackInterval(weapon);

        if (!this.weapons.canFire(weapon, this.elapsedGameTime, attackInterval)) {
            return;
        }

        if (weapon === 'dagger') {
            const offset = new Phaser.Math.Vector2(-direction.y, direction.x).scale(7);
            this.fireProjectile(weapon, definition, direction, offset);
            this.fireProjectile(weapon, definition, direction, offset.negate());
            return;
        }

        this.fireProjectile(weapon, definition, direction);
    }

    private fireProjectile(
        weapon: WeaponKind,
        definition: (typeof WEAPON_DEFINITIONS)[WeaponKind],
        direction: Phaser.Math.Vector2,
        offset = new Phaser.Math.Vector2(),
    ): void {
        const projectile = weapon === 'dagger'
            ? this.scene.physics.add.sprite(this.player.x + offset.x, this.player.y + offset.y, DAGGER_TEXTURE) as Projectile
            : this.scene.physics.add.sprite(this.player.x, this.player.y, WEAPON_TEXTURES[weapon]) as Projectile;

        if (weapon === 'dagger' || weapon === 'bow' || weapon === 'crossbow') {
            projectile.setRotation(direction.angle() + Math.PI / 2);
        }

        projectile.areaRadius = definition.areaRadius;
        projectile.damage = definition.damage + this.stats.damage - 1;
        projectile.piercing = definition.piercing + this.stats.projectilePiercing;
        projectile.weapon = weapon;
        projectile.hitEnemies = new Set();
        this.projectiles.add(projectile);

        const body = projectile.body as Phaser.Physics.Arcade.Body;
        const projectileSpeed = definition.projectileSpeed + this.stats.projectileSpeedBonus;
        body.setVelocity(direction.x * projectileSpeed, direction.y * projectileSpeed);

        const lifetime = definition.lifetime + this.stats.projectileLifetimeBonus;
        this.scene.time.delayedCall(lifetime, () => {
            if (projectile.active) {
                projectile.destroy();
            }
        });
    }

    private updateAutoAim(): Enemy | undefined {
        const target = this.getClosestEnemy();

        if (!target) {
            return undefined;
        }

        this.autoAimDirection.set(target.x - this.player.x, target.y - this.player.y).normalize();
        return target;
    }

    private getAttackInterval(weapon: keyof typeof WEAPON_DEFINITIONS): number {
        return WEAPON_DEFINITIONS[weapon].attackInterval / this.stats.attackSpeedMultiplier;
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

            if (distance <= enemy.ranged.attackRange && this.elapsedGameTime >= enemy.nextAttackAt) {
                this.fireEnemyProjectile(enemy);
                enemy.nextAttackAt = this.elapsedGameTime + enemy.ranged.attackInterval;
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

    private damageEnemy(enemy: Enemy, damage: number, weapon: WeaponKind): boolean {
        const reducedDamage = enemy.armored ? damage * 0.8 : damage;
        enemy.health -= reducedDamage;

        if (enemy.health <= 0) {
            this.callbacks.onEnemyDeath(enemy, weapon);
            enemy.destroy();
            return true;
        }

        return false;
    }

    private damageArea(projectile: Projectile, hitEnemy: Enemy): number {
        let kills = 0;
        for (const gameObject of this.enemies.getChildren()) {
            const enemy = gameObject as Enemy;

            if (
                enemy.active
                && enemy !== hitEnemy
                && !projectile.hitEnemies.has(enemy)
                && Phaser.Math.Distance.Between(projectile.x, projectile.y, enemy.x, enemy.y) <= projectile.areaRadius
            ) {
                projectile.hitEnemies.add(enemy);
                if (this.damageEnemy(enemy, projectile.damage, projectile.weapon)) {
                    kills += 1;
                }
            }
        }

        return kills;
    }

    private regeneratePlayer(delta: number): void {
        if (this.stats.healthRegeneration <= 0 || this.playerHealth >= this.stats.maxHealth) {
            return;
        }

        this.playerHealth = Math.min(
            this.stats.maxHealth,
            this.playerHealth + this.stats.healthRegeneration * (delta / 1000),
        );
        this.callbacks.onPlayerHealthChanged(this.playerHealth, this.stats.maxHealth);
    }

    private damagePlayer(damage: number): void {
        if (this.gameOver || this.invulnerable || this.elapsedGameTime < this.nextPlayerDamageAt) {
            return;
        }

        this.nextPlayerDamageAt = this.elapsedGameTime + ENEMY_DAMAGE_COOLDOWN;
        const lostHealth = Math.min(damage, this.playerHealth);
        this.playerHealth -= damage;
        this.callbacks.onPlayerDamaged(lostHealth);
        this.callbacks.onPlayerHealthChanged(this.playerHealth, this.stats.maxHealth);

        if (this.playerHealth <= 0) {
            this.gameOver = true;
            this.callbacks.onPlayerDeath();
        }
    }
}
