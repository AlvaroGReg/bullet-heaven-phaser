import Phaser from 'phaser';

export class GameScene extends Phaser.Scene {
  public constructor() {
    super('game');
  }

  public create(): void {
    this.add
      .text(this.scale.width / 2, this.scale.height / 2, 'Bullet Heaven', {
        color: '#f2f5f7',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '48px',
      })
      .setOrigin(0.5);

    this.add
      .text(this.scale.width / 2, this.scale.height / 2 + 64, 'Escena base lista', {
        color: '#aebac6',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '20px',
      })
      .setOrigin(0.5);
  }
}
