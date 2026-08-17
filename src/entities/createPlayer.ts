import Phaser from 'phaser';
import type { PlayerCharacter } from '../game/playerCharacters';
import { ROGUE_TEXTURE } from '../sprites/rogue';

export type Player = Phaser.Physics.Arcade.Sprite;

export function createPlayer(scene: Phaser.Scene, x: number, y: number, _character: PlayerCharacter): Player {
    const player = scene.physics.add.sprite(x, y, ROGUE_TEXTURE);
    player.setDisplaySize(36, 36);

    const body = player.body;
    body.setCircle(14, 2, 4);
    body.setCollideWorldBounds(true);

    return player;
}
