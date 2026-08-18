export type WeaponKind = 'dagger' | 'bow' | 'crossbow' | 'staff' | 'cannon';

export type WeaponDefinition = {
    areaRadius: number;
    attackInterval: number;
    color: number;
    damage: number;
    lifetime: number;
    piercing: number;
    projectileRadius: number;
    projectileSpeed: number;
};

export const WEAPON_DEFINITIONS: Record<WeaponKind, WeaponDefinition> = {
    dagger: {
        areaRadius: 0,
        attackInterval: 800,
        color: 0xe2e8f0,
        damage: 0.75,
        lifetime: 600,
        piercing: 0,
        projectileRadius: 6,
        projectileSpeed: 350,
    },
    bow: {
        areaRadius: 0,
        attackInterval: 1000,
        color: 0xa7f3d0,
        damage: 1.2,
        lifetime: 800,
        piercing: 0,
        projectileRadius: 4,
        projectileSpeed: 700,
    },
    crossbow: {
        areaRadius: 0,
        attackInterval: 1500,
        color: 0xfde68a,
        damage: 2.5,
        lifetime: 1000,
        piercing: 1,
        projectileRadius: 6,
        projectileSpeed: 700,
    },
    staff: {
        areaRadius: 55,
        attackInterval: 1200,
        color: 0xc4b5fd,
        damage: 2.4,
        lifetime: 1500,
        piercing: 0,
        projectileRadius: 4,
        projectileSpeed: 300,
    },
    cannon: {
        areaRadius: 100,
        attackInterval: 2000,
        color: 0xfb7185,
        damage: 5,
        lifetime: 1300,
        piercing: 0,
        projectileRadius: 14,
        projectileSpeed: 500,
    },
};

export class WeaponSystem {
    private readonly nextAttackAt: Partial<Record<WeaponKind, number>> = {};

    private readonly equippedWeapons: WeaponKind[] = ['dagger'];

    private weaponSlots = 5;

    public get weapons(): readonly WeaponKind[] {
        return this.equippedWeapons;
    }

    public get hasFreeSlot(): boolean {
        return this.equippedWeapons.length < this.weaponSlots;
    }

    public get availableWeapons(): WeaponKind[] {
        return (Object.keys(WEAPON_DEFINITIONS) as WeaponKind[]).filter(
            (weapon) => !this.equippedWeapons.includes(weapon),
        );
    }

    public equipWeapon(weapon: WeaponKind): boolean {
        if (!this.hasFreeSlot || this.equippedWeapons.includes(weapon)) {
            return false;
        }

        this.equippedWeapons.push(weapon);
        return true;
    }

    public canFire(weapon: WeaponKind, time: number, interval: number): boolean {
        if (time < (this.nextAttackAt[weapon] ?? 0)) {
            return false;
        }

        this.nextAttackAt[weapon] = time + interval;
        return true;
    }

    public hasReadyWeapon(time: number): boolean {
        return this.equippedWeapons.some((weapon) => time >= (this.nextAttackAt[weapon] ?? 0));
    }
}
