export type Locale = 'en' | 'es' | 'ja';

type TranslationValues = Record<string, string>;

const STORAGE_KEY = 'bullet-heaven.locale';

const translations: Record<Locale, TranslationValues> = {
    es: {
        'controls.aim': 'Apunta con raton o stick derecho. Dispara con click o A / X.',
        'controls.auto': 'Modo automatico: click secundario o B / O.',
        'controls.move': 'Muevete con WASD, flechas, cruceta o stick izquierdo',
        'gameover.title': 'Has muerto',
        'hud.level': 'Nivel: {level}',
        'hud.gold': 'Oro: {gold}',
        'hud.time': 'Tiempo: {time}',
        'language.english': 'English',
        'language.japanese': '日本語',
        'language.spanish': 'Español',
        'language.title': 'Idioma',
        'menu.back': 'Volver',
        'menu.characterPlaceholder': 'La funcion de cada personaje llegara en una futura actualizacion.',
        'menu.gold': 'Oro: {gold}',
        'menu.main': 'Menu principal',
        'menu.metaProgression': 'Mejoras',
        'menu.newGame': 'Nueva partida',
        'menu.selectCharacter': 'Elige personaje',
        'menu.start': 'Empezar partida',
        'menu.title': 'Bullet Heaven',
        'character.ranger': 'Explorador',
        'character.vanguard': 'Vanguardia',
        'meta.autoAim.description': 'Desbloquea el apuntado automatico.',
        'meta.autoAim.name': 'Apuntado automatico',
        'meta.autoFire.description': 'Desbloquea el disparo automatico.',
        'meta.autoFire.name': 'Disparo automatico',
        'meta.cameraRange.description': 'Aumenta el alcance de la camara.',
        'meta.cameraRange.name': 'Alcance de camara',
        'meta.category.baseStats': 'Estadisticas base',
        'meta.category.characters': 'Personajes',
        'meta.category.ingameUpgrades': 'Mejoras ingame',
        'meta.category.weapons': 'Armas',
        'meta.character.description': 'Desbloquea este personaje.',
        'meta.comingSoon': 'Los logros y las compras llegaran proximamente.',
        'meta.requires': 'Requiere: {achievement}\nCoste: {gold} oro',
        'meta.title': 'Metaprogresion',
        'meta.vitality.description': 'Aumenta la vida inicial.',
        'meta.vitality.name': 'Vitalidad',
        'meta.weapon.description': 'Permite que aparezca esta arma en partida.',
        'achievement.explorer': 'Explorador',
        'achievement.hunter': 'Cazador',
        'achievement.scout': 'Explorador del mapa',
        'achievement.sharpshooter': 'Tirador experto',
        'achievement.survivor': 'Superviviente',
        'achievement.veteran': 'Veterano',
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
        'hud.gold': 'Gold: {gold}',
        'hud.time': 'Time: {time}',
        'language.english': 'English',
        'language.japanese': '日本語',
        'language.spanish': 'Español',
        'language.title': 'Language',
        'menu.back': 'Back',
        'menu.characterPlaceholder': 'Character roles will arrive in a future update.',
        'menu.gold': 'Gold: {gold}',
        'menu.main': 'Main menu',
        'menu.metaProgression': 'Upgrades',
        'menu.newGame': 'New game',
        'menu.selectCharacter': 'Choose character',
        'menu.start': 'Start game',
        'menu.title': 'Bullet Heaven',
        'character.ranger': 'Ranger',
        'character.vanguard': 'Vanguard',
        'meta.autoAim.description': 'Unlock automatic aiming.',
        'meta.autoAim.name': 'Auto aim',
        'meta.autoFire.description': 'Unlock automatic firing.',
        'meta.autoFire.name': 'Auto fire',
        'meta.cameraRange.description': 'Increase camera range.',
        'meta.cameraRange.name': 'Camera range',
        'meta.category.baseStats': 'Base stats',
        'meta.category.characters': 'Characters',
        'meta.category.ingameUpgrades': 'In-game upgrades',
        'meta.category.weapons': 'Weapons',
        'meta.character.description': 'Unlock this character.',
        'meta.comingSoon': 'Achievements and purchases are coming soon.',
        'meta.requires': 'Requires: {achievement}\nCost: {gold} gold',
        'meta.title': 'Meta progression',
        'meta.vitality.description': 'Increase starting health.',
        'meta.vitality.name': 'Vitality',
        'meta.weapon.description': 'Allow this weapon to appear during a game.',
        'achievement.explorer': 'Explorer',
        'achievement.hunter': 'Hunter',
        'achievement.scout': 'Map scout',
        'achievement.sharpshooter': 'Sharpshooter',
        'achievement.survivor': 'Survivor',
        'achievement.veteran': 'Veteran',
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
    ja: {
        'achievement.explorer': '探検家',
        'achievement.hunter': '狩人',
        'achievement.scout': '地図の偵察者',
        'achievement.sharpshooter': '名射手',
        'achievement.survivor': '生存者',
        'achievement.veteran': 'ベテラン',
        'character.ranger': 'レンジャー',
        'character.vanguard': 'ヴァンガード',
        'controls.aim': 'マウスまたは右スティックで照準。クリックまたは A / X で攻撃。',
        'controls.auto': '自動モード: 右クリックまたは B / O。',
        'controls.move': 'WASD、矢印キー、方向パッドまたは左スティックで移動',
        'gameover.title': 'やられてしまった',
        'hud.gold': 'ゴールド: {gold}',
        'hud.level': 'レベル: {level}',
        'hud.time': '時間: {time}',
        'language.english': 'English',
        'language.japanese': '日本語',
        'language.spanish': 'Español',
        'language.title': '言語',
        'menu.back': '戻る',
        'menu.characterPlaceholder': 'キャラクターごとの役割は今後のアップデートで追加されます。',
        'menu.gold': 'ゴールド: {gold}',
        'menu.main': 'メインメニュー',
        'menu.metaProgression': '強化',
        'menu.newGame': 'ニューゲーム',
        'menu.selectCharacter': 'キャラクターを選択',
        'menu.start': 'ゲーム開始',
        'menu.title': 'Bullet Heaven',
        'meta.autoAim.description': '自動照準を解放する。',
        'meta.autoAim.name': '自動照準',
        'meta.autoFire.description': '自動射撃を解放する。',
        'meta.autoFire.name': '自動射撃',
        'meta.cameraRange.description': 'カメラの表示範囲を広げる。',
        'meta.cameraRange.name': 'カメラ範囲',
        'meta.category.baseStats': '基本ステータス',
        'meta.category.characters': 'キャラクター',
        'meta.category.ingameUpgrades': 'ゲーム内強化',
        'meta.category.weapons': '武器',
        'meta.character.description': 'このキャラクターを解放する。',
        'meta.comingSoon': '実績と購入機能は近日追加予定です。',
        'meta.requires': '必要実績: {achievement}\nコスト: {gold} ゴールド',
        'meta.title': 'メタプログレッション',
        'meta.vitality.description': '開始時の体力を増やす。',
        'meta.vitality.name': '生命力',
        'meta.weapon.description': 'ゲーム中にこの武器が出現するようにする。',
        'pause.continue': '続ける',
        'pause.restart': 'やり直す',
        'pause.restartCancel': 'いいえ、続ける',
        'pause.restartConfirm': 'はい、やり直す',
        'pause.restartQuestion': '最初からやり直しますか？',
        'pause.title': '一時停止',
        'rarity.common': 'コモン',
        'rarity.epic': 'エピック',
        'rarity.legendary': 'レジェンダリー',
        'rarity.mythic': 'ミシック',
        'rarity.rare': 'レア',
        'rarity.uncommon': 'アンコモン',
        'upgrade.attackSpeed.description': '攻撃速度 +{value}%',
        'upgrade.attackSpeed.name': '攻撃速度',
        'upgrade.choose': '強化を選ぶ',
        'upgrade.damage.description': 'ダメージ +{value}',
        'upgrade.damage.name': 'ダメージ',
        'upgrade.experience.description': 'ジェム EXP +{value}%',
        'upgrade.experience.name': '経験値',
        'upgrade.health.description': '最大体力 +{value}',
        'upgrade.health.name': '最大体力',
        'upgrade.movementSpeed.description': '移動速度 +{value}',
        'upgrade.movementSpeed.name': '移動速度',
        'upgrade.pickupRange.description': '取得範囲 +{value}',
        'upgrade.pickupRange.name': '取得範囲',
        'upgrade.piercing.description': '敵 +{value} 体を貫通',
        'upgrade.piercing.name': '貫通',
        'upgrade.projectileLifetime.description': '投射物の持続時間 +{value} ms',
        'upgrade.projectileLifetime.name': '投射物の持続時間',
        'upgrade.projectileSpeed.description': '投射物速度 +{value}',
        'upgrade.projectileSpeed.name': '投射物速度',
        'upgrade.regeneration.description': '毎秒体力 +{value}',
        'upgrade.regeneration.name': '再生',
        'upgrade.weapon.description': 'この武器を装備する',
        'weapon.bow': '弓',
        'weapon.cannon': '大砲',
        'weapon.crossbow': 'クロスボウ',
        'weapon.dagger': '短剣',
        'weapon.staff': '魔術師の杖',
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

        const browserLocale = navigator.language.toLowerCase();
        if (browserLocale.startsWith('es')) {
            return 'es';
        }

        return browserLocale.startsWith('ja') ? 'ja' : 'en';
    }

    private getStoredLocale(): Locale | undefined {
        try {
            const locale = localStorage.getItem(STORAGE_KEY);
            return locale === 'en' || locale === 'es' || locale === 'ja' ? locale : undefined;
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
