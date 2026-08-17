import Phaser from 'phaser';
import { MAP_HEIGHT, MAP_WIDTH } from '../game/constants';

export function createArena(scene: Phaser.Scene): void {
    scene.physics.world.setBounds(0, 0, MAP_WIDTH, MAP_HEIGHT);

    const map = scene.add.graphics();
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
