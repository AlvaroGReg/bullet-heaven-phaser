import Phaser from 'phaser';

export const GRIM = {
    ink: '#0b0e0d',
    panel: '#1a211d',
    panelRaised: '#303b2b',
    text: '#e7e2cf',
    mutedText: '#a8ad98',
} as const;

export function grimTextStyle(color: string, fontSize: string): Phaser.Types.GameObjects.Text.TextStyle {
    return {
        color,
        fontFamily: 'monospace',
        fontSize,
        fontStyle: 'bold',
    };
}

export function grimButtonStyle(color: string, fontSize = '20px'): Phaser.Types.GameObjects.Text.TextStyle {
    return {
        ...grimTextStyle(GRIM.text, fontSize),
        backgroundColor: color,
    };
}
