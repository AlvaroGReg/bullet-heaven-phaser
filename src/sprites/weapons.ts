import Phaser from 'phaser';
import { renderSpriteSheet } from './pixelRenderer';
import type { WeaponKind } from '../systems/WeaponSystem';

const PALETTE = [null, 0x0b0e0d, 0x33231c, 0x74513a, 0xc4b680, 0xe2e8f0, 0xa7f3d0, 0xfde68a, 0xc4b5fd, 0xfb7185] as const;

const frame = (rows: readonly string[]) => rows.map((row) => [...row].map(Number));

const BOW = frame([
    '00000000001100',
    '00000000011310',
    '00000000113100',
    '00000001131000',
    '00000011310000',
    '00000113100000',
    '00001131100000',
    '00011310000000',
    '00113100000000',
    '01131000000000',
    '11310000000000',
    '11000000000000',
]);

const CROSSBOW = frame([
    '0000000500000000',
    '0000000500000000',
    '0000000700000000',
    '0011117777111100',
    '0111777777771110',
    '0111777117771110',
    '0011111111111100',
    '0000001331000000',
    '0000001333100000',
    '0000001133310000',
    '0000000113310000',
    '0000000011100000',
    '0000000000000000',
    '0000000000000000',
]);

const STAFF = frame([
    '000000000000',
    '000008880000',
    '000088888000',
    '000888888800',
    '000088888000',
    '000008880000',
    '000001100000',
    '000001100000',
    '000001100000',
    '000001100000',
    '000001100000',
    '000001100000',
    '000001100000',
    '000001100000',
    '000011110000',
    '000000000000',
]);

const CANNON = frame([
    '00000000000000000000',
    '00000000000000000000',
    '00000011111111100000',
    '00000199999999100000',
    '00001999999999910000',
    '00019999999999991000',
    '00199999999999999100',
    '01111119999911111110',
    '00000019999910000000',
    '00000019999910000000',
    '00000119999911000000',
    '00001119999911100000',
    '00011111111111110000',
    '00111999999999111000',
    '00011111111111110000',
    '00000000000000000000',
]);

export const WEAPON_TEXTURES: Record<Exclude<WeaponKind, 'dagger'>, string> = {
    bow: 'bow',
    cannon: 'cannon',
    crossbow: 'crossbow',
    staff: 'staff',
};

export function createWeaponTextures(scene: Phaser.Scene): void {
    renderSpriteSheet(scene, WEAPON_TEXTURES.bow, [BOW], PALETTE, 2);
    renderSpriteSheet(scene, WEAPON_TEXTURES.crossbow, [CROSSBOW], PALETTE, 2);
    renderSpriteSheet(scene, WEAPON_TEXTURES.staff, [STAFF], PALETTE, 2);
    renderSpriteSheet(scene, WEAPON_TEXTURES.cannon, [CANNON], PALETTE, 2);
}
