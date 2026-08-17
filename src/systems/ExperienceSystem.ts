import Phaser from 'phaser';
import type { Player } from '../entities/createPlayer';
import {
    EXPERIENCE_LEVEL_GROWTH,
    EXPERIENCE_PER_GEM,
    EXPERIENCE_TO_LEVEL,
} from '../game/constants';
import type { PlayerStats } from '../game/PlayerStats';

type ExperienceGem = Phaser.GameObjects.Arc & {
    usesPlayerMultiplier: boolean;
    value: number;
};

type ExperienceCallbacks = {
    onExperienceChanged: (level: number, experience: number, requiredExperience: number) => void;
    onLevelUp: () => void;
};

export class ExperienceSystem {
    private readonly gems: Phaser.Physics.Arcade.Group;

    private level = 1;

    private experience = 0;

    private handleGemPickup: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (
        firstObject,
        secondObject,
    ) => {
        const firstGameObject = firstObject as Phaser.GameObjects.GameObject;
        const secondGameObject = secondObject as Phaser.GameObjects.GameObject;
        const gem = (this.gems.contains(firstGameObject) ? firstGameObject : secondGameObject) as ExperienceGem;

        if (!gem.active) {
            return;
        }

        this.collectGem(gem);
    };

    public constructor(
        private readonly scene: Phaser.Scene,
        private readonly player: Player,
        private readonly stats: PlayerStats,
        private readonly callbacks: ExperienceCallbacks,
    ) {
        this.gems = this.scene.physics.add.group();
        this.scene.physics.add.overlap(this.player, this.gems, this.handleGemPickup, undefined, this);
    }

    public update(): void {
        if (this.stats.pickupRange <= 0) {
            return;
        }

        const pickupRangeSquared = this.stats.pickupRange ** 2;

        for (const gameObject of this.gems.getChildren()) {
            const gem = gameObject as ExperienceGem;
            const distanceX = this.player.x - gem.x;
            const distanceY = this.player.y - gem.y;

            if (gem.active && distanceX ** 2 + distanceY ** 2 <= pickupRangeSquared) {
                this.collectGem(gem);
                return;
            }
        }
    }

    private collectGem(gem: ExperienceGem): void {
        gem.destroy();
        const experience = gem.value * (gem.usesPlayerMultiplier ? this.stats.experienceMultiplier : 1);
        this.addExperience(experience);
    }

    public get currentLevel(): number {
        return this.level;
    }

    public get currentExperience(): number {
        return this.experience;
    }

    public get currentRequiredExperience(): number {
        return Math.ceil(EXPERIENCE_TO_LEVEL * EXPERIENCE_LEVEL_GROWTH ** (this.level - 1));
    }

    public addExperience(amount: number): void {
        this.experience += amount;
        let levelsGained = 0;

        while (this.experience >= this.currentRequiredExperience) {
            this.experience -= this.currentRequiredExperience;
            this.level += 1;
            levelsGained += 1;
        }

        this.callbacks.onExperienceChanged(this.level, this.experience, this.currentRequiredExperience);

        for (let index = 0; index < levelsGained; index += 1) {
            this.callbacks.onLevelUp();
        }
    }

    public spawn(x: number, y: number, multiplier: number, grantsFullLevel: boolean): void {
        const gem = this.scene.add.circle(x, y, 10, grantsFullLevel ? 0xfbbf24 : 0x7dd3fc) as ExperienceGem;
        gem.setStrokeStyle(2, grantsFullLevel ? 0xfef3c7 : 0xe0f2fe);
        gem.usesPlayerMultiplier = !grantsFullLevel;
        gem.value = grantsFullLevel ? this.currentRequiredExperience : EXPERIENCE_PER_GEM * multiplier;
        this.scene.physics.add.existing(gem);
        this.gems.add(gem);
    }
}
