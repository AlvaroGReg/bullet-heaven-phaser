export type Locale = 'en' | 'es';

type TranslationValues = Record<string, string>;

const STORAGE_KEY = 'bullet-heaven.locale';

const translations: Record<Locale, TranslationValues> = {
    es: {
        'controls.aim': 'Apunta con raton o stick derecho. Dispara con click o A / X.',
        'controls.auto': 'Modo automatico: click secundario o B / O.',
        'controls.move': 'Muevete con WASD, flechas, cruceta o stick izquierdo',
        'gameover.title': 'Has muerto',
        'hud.level': 'Nivel: {level}',
        'hud.time': 'Tiempo: {time}',
        'language.english': 'English',
        'language.spanish': 'Espanol',
        'language.title': 'Idioma',
        'pause.continue': 'Continuar',
        'pause.restart': 'Volver a empezar',
        'pause.restartCancel': 'No, continuar',
        'pause.restartConfirm': 'Si, reiniciar',
        'pause.restartQuestion': 'Volver a empezar desde cero?',
        'pause.title': 'Pausado',
        'rarity.common': 'Comun',
        'rarity.epic': 'Epica',
        'rarity.legendary': 'Legendaria',
        'rarity.mythic': 'Mitica',
        'rarity.rare': 'Rara',
        'rarity.uncommon': 'Poco comun',
        'upgrade.attackSpeed.description': '+{value}% cadencia',
        'upgrade.attackSpeed.name': 'Cadencia',
        'upgrade.choose': 'Elige una mejora',
        'upgrade.damage.description': '+{value} dano',
        'upgrade.damage.name': 'Dano',
        'upgrade.experience.description': '+{value}% EXP de gemas',
        'upgrade.experience.name': 'Experiencia',
        'upgrade.health.description': '+{value} vida maxima',
        'upgrade.health.name': 'Vida maxima',
        'upgrade.movementSpeed.description': '+{value} velocidad',
        'upgrade.movementSpeed.name': 'Velocidad de movimiento',
        'upgrade.pickupRange.description': '+{value} rango',
        'upgrade.pickupRange.name': 'Rango de recogida',
        'upgrade.piercing.description': '+{value} enemigos',
        'upgrade.piercing.name': 'Perforacion',
        'upgrade.projectileLifetime.description': '+{value} ms',
        'upgrade.projectileLifetime.name': 'Vida de proyectil',
        'upgrade.projectileSpeed.description': '+{value} velocidad',
        'upgrade.projectileSpeed.name': 'Velocidad de proyectil',
        'upgrade.regeneration.description': '+{value} vida/s',
        'upgrade.regeneration.name': 'Regeneracion',
        'upgrade.weapon.description': 'Equipa esta arma',
        'weapon.bow': 'Arco',
        'weapon.cannon': 'Canon',
        'weapon.crossbow': 'Ballesta',
        'weapon.dagger': 'Daga',
        'weapon.staff': 'Vara de mago',
    },
    en: {
        'controls.aim': 'Aim with mouse or right stick. Fire with click or A / X.',
        'controls.auto': 'Auto mode: right click or B / O.',
        'controls.move': 'Move with WASD, arrows, D-pad, or left stick',
        'gameover.title': 'You died',
        'hud.level': 'Level: {level}',
        'hud.time': 'Time: {time}',
        'language.english': 'English',
        'language.spanish': 'Spanish',
        'language.title': 'Language',
        'pause.continue': 'Continue',
        'pause.restart': 'Restart',
        'pause.restartCancel': 'No, continue',
        'pause.restartConfirm': 'Yes, restart',
        'pause.restartQuestion': 'Restart from the beginning?',
        'pause.title': 'Paused',
        'rarity.common': 'Common',
        'rarity.epic': 'Epic',
        'rarity.legendary': 'Legendary',
        'rarity.mythic': 'Mythic',
        'rarity.rare': 'Rare',
        'rarity.uncommon': 'Uncommon',
        'upgrade.attackSpeed.description': '+{value}% attack speed',
        'upgrade.attackSpeed.name': 'Attack speed',
        'upgrade.choose': 'Choose an upgrade',
        'upgrade.damage.description': '+{value} damage',
        'upgrade.damage.name': 'Damage',
        'upgrade.experience.description': '+{value}% gem EXP',
        'upgrade.experience.name': 'Experience',
        'upgrade.health.description': '+{value} maximum health',
        'upgrade.health.name': 'Maximum health',
        'upgrade.movementSpeed.description': '+{value} speed',
        'upgrade.movementSpeed.name': 'Movement speed',
        'upgrade.pickupRange.description': '+{value} pickup range',
        'upgrade.pickupRange.name': 'Pickup range',
        'upgrade.piercing.description': '+{value} enemies',
        'upgrade.piercing.name': 'Piercing',
        'upgrade.projectileLifetime.description': '+{value} ms',
        'upgrade.projectileLifetime.name': 'Projectile lifetime',
        'upgrade.projectileSpeed.description': '+{value} speed',
        'upgrade.projectileSpeed.name': 'Projectile speed',
        'upgrade.regeneration.description': '+{value} health/s',
        'upgrade.regeneration.name': 'Regeneration',
        'upgrade.weapon.description': 'Equip this weapon',
        'weapon.bow': 'Bow',
        'weapon.cannon': 'Cannon',
        'weapon.crossbow': 'Crossbow',
        'weapon.dagger': 'Dagger',
        'weapon.staff': 'Mage staff',
    },
};

export class I18n {
    private readonly listeners = new Set<() => void>();

    private currentLocale: Locale;

    public constructor() {
        this.currentLocale = this.getInitialLocale();
    }

    public get locale(): Locale {
        return this.currentLocale;
    }

    public setLocale(locale: Locale): void {
        if (locale === this.currentLocale) {
            return;
        }

        this.currentLocale = locale;
        this.storeLocale(locale);
        this.listeners.forEach((listener) => listener());
    }

    public t(key: string, values: Record<string, number | string> = {}): string {
        const template = translations[this.currentLocale][key] ?? key;
        return template.replace(/\{(\w+)\}/g, (_match, name: string) => `${values[name] ?? ''}`);
    }

    public onChange(listener: () => void): () => void {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    private getInitialLocale(): Locale {
        const storedLocale = this.getStoredLocale();

        if (storedLocale) {
            return storedLocale;
        }

        return navigator.language.toLowerCase().startsWith('es') ? 'es' : 'en';
    }

    private getStoredLocale(): Locale | undefined {
        try {
            const locale = localStorage.getItem(STORAGE_KEY);
            return locale === 'en' || locale === 'es' ? locale : undefined;
        } catch {
            return undefined;
        }
    }

    private storeLocale(locale: Locale): void {
        try {
            localStorage.setItem(STORAGE_KEY, locale);
        } catch {
            // The game remains usable when browser storage is unavailable.
        }
    }
}

export const i18n = new I18n();
