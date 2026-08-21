import Phaser from 'phaser';

export const GRIM = {
    bg: '#161826',
    line: '#292b31',
    lineFine: '#3f424d',
    text: '#e9e9ed',
    mutedText: '#75798c',
    mutedDim: '#595d6c',
    accent: '#9184d9',
    accentText: '#d2cefd',
    accentDeep: '#423a6a',
    accentMid: '#796cbf',
} as const;

export const GRIM_INT = {
    bg: 0x161826,
    line: 0x292b31,
    lineFine: 0x3f424d,
    text: 0xe9e9ed,
    mutedText: 0x75798c,
    mutedDim: 0x595d6c,
    accent: 0x9184d9,
    accentText: 0xd2cefd,
    accentDeep: 0x423a6a,
    accentMid: 0x796cbf,
} as const;

const HEADING_FONT = 'Cinzel';
const BODY_FONT = 'Inter';

export function grimHeadingStyle(color: string, fontSize: string, letterSpacing = 3): Phaser.Types.GameObjects.Text.TextStyle {
    return {
        color,
        fontFamily: HEADING_FONT,
        fontSize,
        fontStyle: '600',
        letterSpacing,
    };
}

export function grimTextStyle(color: string, fontSize: string): Phaser.Types.GameObjects.Text.TextStyle {
    return {
        color,
        fontFamily: BODY_FONT,
        fontSize,
        fontStyle: 'normal',
    };
}

export function grimLabelStyle(color: string, fontSize: string): Phaser.Types.GameObjects.Text.TextStyle {
    return {
        ...grimTextStyle(color, fontSize),
        fontStyle: '500',
    };
}

/** A small square rotated 45deg, the one recurring ornamental mark of this design system. */
export function createDiamond(
    scene: Phaser.Scene,
    x: number,
    y: number,
    size = 7,
    color: number = GRIM_INT.accent,
): Phaser.GameObjects.Rectangle {
    return scene.add.rectangle(x, y, size, size, color).setRotation(Math.PI / 4);
}

/** Thin rule - diamond - thin rule, centered at (x, y). Used above every screen title. */
export function createRuleMark(
    scene: Phaser.Scene,
    x: number,
    y: number,
    ruleWidth = 26,
    color: number = GRIM_INT.mutedDim,
): Phaser.GameObjects.Container {
    const gap = 8;
    const left = scene.add.rectangle(-ruleWidth - gap / 2, 0, ruleWidth, 1, color);
    const right = scene.add.rectangle(ruleWidth + gap / 2, 0, ruleWidth, 1, color);
    const diamond = createDiamond(scene, 0, 0, 6, color);
    return scene.add.container(x, y, [left, diamond, right]);
}

export type ButtonVariant = 'primary' | 'secondary';

/**
 * Outlined button: 1px border + text, never filled. Primary uses the accent border/text,
 * secondary uses the hairline border and muted text.
 */
export function createButton(
    scene: Phaser.Scene,
    x: number,
    y: number,
    label: string,
    variant: ButtonVariant = 'secondary',
    fontSize = '20px',
): Phaser.GameObjects.Container {
    const textColor = variant === 'primary' ? GRIM.accentText : GRIM.mutedText;
    const hoverColor = variant === 'primary' ? '#f5f4ff' : GRIM.text;
    const borderColor = variant === 'primary' ? GRIM_INT.accent : GRIM_INT.line;
    const text = scene.add.text(0, 0, label, grimLabelStyle(textColor, fontSize)).setOrigin(0.5);
    const paddingX = 20;
    const paddingY = 12;
    const width = text.width + paddingX * 2;
    const height = text.height + paddingY * 2;
    const border = scene.add.rectangle(0, 0, width, height, 0x000000, 0).setStrokeStyle(1, borderColor);
    const container = scene.add.container(x, y, [border, text]);
    container.setSize(width, height);
    // Container defaults to origin 0.5, and Phaser's hit test adds displayOrigin to the
    // tested point before checking it — so the hit area must be given in top-left-relative
    // coordinates (0,0,w,h), not centered ones, even though children are positioned centered.
    container.setInteractive(
        new Phaser.Geom.Rectangle(0, 0, width, height),
        Phaser.Geom.Rectangle.Contains,
    );
    container.on(Phaser.Input.Events.POINTER_OVER, () => text.setColor(hoverColor));
    container.on(Phaser.Input.Events.POINTER_OUT, () => text.setColor(textColor));
    return container;
}

/** Left-flush nav row: top hairline rule + diamond bullet + label, used for main-menu navigation. */
export function createNavRow(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    label: string,
    onClick: () => void,
): Phaser.GameObjects.Container {
    const rowHeight = 44;
    const rule = scene.add.rectangle(0, -rowHeight / 2, width, 1, GRIM_INT.line);
    const diamond = createDiamond(scene, -width / 2 + 10, 0, 6, GRIM_INT.mutedDim);
    const text = scene.add.text(-width / 2 + 30, 0, label, grimLabelStyle(GRIM.text, '22px')).setOrigin(0, 0.5);
    const container = scene.add.container(x, y, [rule, diamond, text]);
    container.setSize(width, rowHeight);
    container.setInteractive(
        new Phaser.Geom.Rectangle(0, 0, width, rowHeight),
        Phaser.Geom.Rectangle.Contains,
    );
    container.on(Phaser.Input.Events.POINTER_OVER, () => {
        text.setColor(GRIM.accentText);
        diamond.setFillStyle(GRIM_INT.accent);
    });
    container.on(Phaser.Input.Events.POINTER_OUT, () => {
        text.setColor(GRIM.text);
        diamond.setFillStyle(GRIM_INT.mutedDim);
    });
    container.on(Phaser.Input.Events.POINTER_DOWN, onClick);
    return container;
}

/** Unfilled 1px bordered panel, used behind cards/columns instead of a filled backgroundColor. */
export function createPanelBorder(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
): Phaser.GameObjects.Rectangle {
    return scene.add.rectangle(x, y, width, height, 0x000000, 0).setStrokeStyle(1, GRIM_INT.line);
}

/** Double hairline inset frame with a diamond at top-center and bottom-center. */
export function createFrame(scene: Phaser.Scene): Phaser.GameObjects.Container {
    const width = scene.scale.width;
    const height = scene.scale.height;
    const outer = scene.add.rectangle(width / 2, height / 2, width - 24, height - 24, 0x000000, 0)
        .setStrokeStyle(1, GRIM_INT.line);
    const inner = scene.add.rectangle(width / 2, height / 2, width - 32, height - 32, 0x000000, 0)
        .setStrokeStyle(1, 0x1a1c26);
    const top = createDiamond(scene, width / 2, 12, 6, GRIM_INT.mutedDim);
    const bottom = createDiamond(scene, width / 2, height - 12, 6, GRIM_INT.mutedDim);
    return scene.add.container(0, 0, [outer, inner, top, bottom]);
}
