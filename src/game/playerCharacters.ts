export type PlayerCharacter = {
    color: number;
    id: 'vanguard' | 'ranger';
    nameKey: string;
};

export const PLAYER_CHARACTERS: readonly PlayerCharacter[] = [
    { id: 'vanguard', nameKey: 'character.vanguard', color: 0x6ee7b7 },
    { id: 'ranger', nameKey: 'character.ranger', color: 0x93c5fd },
];
