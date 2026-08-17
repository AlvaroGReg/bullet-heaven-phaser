import Phaser from 'phaser';

export function renderSpriteSheet(
    scene: Phaser.Scene,
    key: string,
    frames: readonly (readonly (readonly number[])[])[],
    palette: readonly (number | null)[],
    scale: number,
): void {
    if (scene.textures.exists(key)) {
        return;
    }

    const frameHeight = frames[0].length * scale;
    const frameWidth = frames[0][0].length * scale;
    const canvas = document.createElement('canvas');
    canvas.width = frameWidth * frames.length;
    canvas.height = frameHeight;
    const context = canvas.getContext('2d');

    if (!context) {
        throw new Error('Pixel-art canvas context is unavailable.');
    }

    frames.forEach((frame, frameIndex) => {
        frame.forEach((row, y) => {
            row.forEach((colorIndex, x) => {
                const color = palette[colorIndex];
                if (color === null || color === undefined) {
                    return;
                }

                context.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
                context.fillRect((frameIndex * frame[0].length + x) * scale, y * scale, scale, scale);
            });
        });
    });

    scene.textures.addCanvas(key, canvas);
}
