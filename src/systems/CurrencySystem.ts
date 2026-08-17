import Phaser from 'phaser';

type GoldCoin = Phaser.GameObjects.Arc & {
    amount: number;
};

export class CurrencySystem {
    private readonly coins: Phaser.Physics.Arcade.Group;

    public constructor(
        private readonly scene: Phaser.Scene,
        player: Phaser.GameObjects.Arc,
        private readonly onGoldCollected: (amount: number) => void,
    ) {
        this.coins = this.scene.physics.add.group();
        this.scene.physics.add.overlap(player, this.coins, this.collectCoin, undefined, this);
    }

    public trySpawn(x: number, y: number, dropChance: number): void {
        if (Math.random() >= dropChance) {
            return;
        }

        const coin = this.scene.add.circle(x, y, 8, 0xfbbf24) as GoldCoin;
        coin.amount = 1;
        coin.setStrokeStyle(2, 0xfef3c7);
        this.scene.physics.add.existing(coin);
        this.coins.add(coin);
    }

    private collectCoin: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (firstObject, secondObject) => {
        const firstGameObject = firstObject as Phaser.GameObjects.GameObject;
        const coin = (this.coins.contains(firstGameObject) ? firstGameObject : secondObject) as GoldCoin;

        if (!coin.active) {
            return;
        }

        this.onGoldCollected(coin.amount);
        coin.destroy();
    };
}
