import Phaser from 'phaser';
import {
    EXPERIENCE_LEVEL_GROWTH,
    EXPERIENCE_PER_GEM,
    EXPERIENCE_TO_LEVEL,
} from '../game/constants';
import type { PlayerStats } from '../game/PlayerStats';

type ExperienceGem = Phaser.GameObjects.Arc & {
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

        gem.destroy();
        this.addExperience(gem.value * this.stats.experienceMultiplier);
    };

    public constructor(
        private readonly scene: Phaser.Scene,
        player: Phaser.GameObjects.Arc,
        private readonly stats: PlayerStats,
        private readonly callbacks: ExperienceCallbacks,
    ) {
        this.gems = this.scene.physics.add.group();
        this.scene.physics.add.overlap(player, this.gems, this.handleGemPickup, undefined, this);
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

    public spawn(x: number, y: number): void {
        const gem = this.scene.add.circle(x, y, 10, 0x7dd3fc) as ExperienceGem;
        gem.setStrokeStyle(2, 0xe0f2fe);
        gem.value = EXPERIENCE_PER_GEM;
        this.scene.physics.add.existing(gem);
        this.gems.add(gem);
    }
}
