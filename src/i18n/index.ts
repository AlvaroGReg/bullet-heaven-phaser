export type Locale = 'en' | 'es' | 'ja';

type TranslationValues = Record<string, string>;

const STORAGE_KEY = 'bullet-heaven.locale';

const translations: Record<Locale, TranslationValues> = {
    es: {
        'controls.aim': 'Apunta con raton o stick derecho. Dispara con click o A / X.',
        'controls.auto': 'Modo automatico: click secundario o B / O.',
        'controls.move': 'Muevete con WASD, flechas, cruceta o stick izquierdo',
        'controls.touch': 'Arrastra para moverte. Apuntado automatico activado.',
        'gameover.title': 'Has muerto',
        'hud.level': 'Nivel: {level}',
        'hud.gold': 'Oro: {gold}',
        'hud.time': 'Tiempo: {time}',
        'journal.monster.armored': 'Puede aparecer acorazado y recibe un 20% menos de daño.',
        'journal.monster.boss': 'Un trol enorme, deforme y barrigudo que empuña un garrote.',
        'journal.monster.boss.name': 'Trol',
        'journal.monster.elite': 'Un jefe orco, más grande y armado con una espada larga.',
        'journal.monster.elite.name': 'Jefe orco',
        'journal.monster.fast': 'Un trasgo pequeño y verde que ataca con una daga.',
        'journal.monster.fast.name': 'Trasgo con daga',
        'journal.monster.heavy': 'Un orco hombre-cerdo resistente que combate con un garrote.',
        'journal.monster.heavy.name': 'Orco',
        'journal.monster.normal': 'Un gnoll hombre-perro armado con una espada estropeada.',
        'journal.monster.normal.name': 'Gnoll',
        'journal.monster.ranged': 'Un trasgo pequeño y verde equipado con una honda.',
        'journal.monster.ranged.name': 'Trasgo hondero',
        'journal.monster.rangedStats': ' · Alcance {range} · Disparo cada {interval} s',
        'journal.monster.stats': 'Vida {health} · Daño {damage} · Velocidad {speed}\nEXP x{experience} · Oro {gold}%{ranged}',
        'journal.monster.general': 'Resistencia {health} · Amenaza {damage} · Ritmo {speed}',
        'journal.monster.unknown': 'Aún no hay observaciones fiables sobre esta criatura.',
        'journal.tab.monsters': 'Monstruos',
        'journal.tab.weapons': 'Armas',
        'journal.tab.cheats': 'Trucos',
        'journal.title': 'Diario',
        'journal.empty.monsters': 'Derrota a un monstruo por primera vez para registrarlo aquí.',
        'journal.empty.weapons': 'Compra un arma en la tienda para añadirla al diario.',
        'journal.cheats.disabled': 'desactivada',
        'journal.cheats.enabled': 'activada',
        'journal.cheats.hint': 'Los trucos de desarrollo no modifican el progreso guardado.',
        'journal.cheats.invulnerability': 'Inmortalidad: {state}',
        'journal.cheats.speed': 'Velocidad del juego: x{speed}',
        'journal.progress': '{kills}/{total} bajas registradas',
        'journal.tier.fast': 'rápido',
        'journal.tier.high': 'alto',
        'journal.tier.low': 'bajo',
        'journal.tier.medium': 'medio',
        'journal.tier.mediumSpeed': 'medio',
        'journal.tier.slow': 'lento',
        'journal.weapon.area': ' · Área {radius}',
        'journal.weapon.bow': 'Un arco ligero que dispara proyectiles rápidos.',
        'journal.weapon.cannon': 'Un cañón pesado que provoca una explosión devastadora.',
        'journal.weapon.crossbow': 'Una ballesta potente cuyos virotes atraviesan enemigos.',
        'journal.weapon.dagger': 'Dos hojas rápidas que salen juntas hacia el objetivo.',
        'journal.weapon.staff': 'Una vara mágica cuyo impacto daña a los enemigos cercanos.',
        'journal.weapon.stats': 'Daño {damage} · Cadencia {interval} s\nVelocidad {speed} · Perforación {piercing}{area}',
        'journal.weapon.general': 'Daño {damage} · Cadencia {cadence} · Proyectil {speed}',
        'journal.weapon.unknown': 'Consigue bajas con esta arma para estudiarla.',
        'language.english': 'English',
        'language.japanese': '日本語',
        'language.spanish': 'Español',
        'language.title': 'Idioma',
        'menu.back': 'Volver',
        'menu.gold': 'Oro: {gold}',
        'menu.main': 'Menu principal',
        'menu.metaProgression': 'Mejoras',
        'menu.newGame': 'Nueva partida',
        'menu.patchNotes': 'Notas de parche',
        'menu.selectCharacter': 'Elige personaje',
        'menu.start': 'Empezar partida',
        'menu.title': 'Rogue Heaven',
        'character.rogue': 'Pícaro',
        'meta.category.baseStats': 'Estadisticas base',
        'meta.category.weapons': 'Armas',
        'meta.buy': 'Comprar: {gold} oro',
        'meta.damage.description': '+0,2 dano inicial por nivel.',
        'meta.damage.name': 'Fuerza',
        'meta.level': 'Nivel {current}/{total}',
        'meta.maxed': 'Maximo',
        'meta.movementSpeed.description': '+10 velocidad de movimiento por nivel.',
        'meta.movementSpeed.name': 'Paso ligero',
        'meta.pickupRange.description': '+20 rango de recogida por nivel.',
        'meta.pickupRange.name': 'Atraccion',
        'meta.purchased': 'Comprado',
        'meta.singlePurchase': 'Compra unica',
        'meta.title': 'Metaprogresion',
        'meta.vitality.description': '+1 vida inicial por nivel.',
        'meta.vitality.name': 'Vitalidad',
        'meta.weapon.description': 'Permite que aparezca esta arma en partida.',
        'achievement.explorer': 'Explorador',
        'achievement.hunter': 'Cazador',
        'achievement.scout': 'Explorador del mapa',
        'achievement.sharpshooter': 'Tirador experto',
        'achievement.survivor': 'Superviviente',
        'achievement.veteran': 'Veterano',
        'achievement.metric.damageTaken': 'Pierde {value} vida',
        'achievement.metric.deaths': 'Muere {value} veces',
        'achievement.metric.areaImpactKills': 'Mata {value} enemigos con un impacto de area',
        'achievement.metric.coinsRun': 'Recoge {value} monedas en una partida',
        'achievement.metric.finalBossBefore': 'Mata al jefe final antes de {time}',
        'achievement.metric.gameCompleted': 'Completa la dificultad Normal',
        'achievement.metric.gameCompletedLowHealth': 'Termina con menos de {value} vida',
        'achievement.metric.kills': 'Mata {value} enemigos',
        'achievement.metric.killsByEnemy': 'Mata {value} enemigos {enemy}',
        'achievement.metric.killsByWeapon': 'Mata {value} enemigos con {weapon}',
        'achievement.metric.killsWithoutDamage': 'Mata {value} enemigos sin recibir dano',
        'achievement.metric.level': 'Alcanza el nivel {value} en una partida',
        'achievement.metric.playTime': 'Juega {value} minutos',
        'achievement.metric.stat': 'Alcanza {value} de {stat}',
        'achievement.metric.survivalRun': 'Sobrevive {value} min en una partida',
        'achievement.metric.survivalTotal': 'Sobrevive {value} min en total',
        'achievement.metric.survivalWithoutUpgrades': 'Sobrevive {value} min sin elegir mejoras',
        'achievement.metric.weaponsEquipped': 'Equipa {value} armas distintas',
        'achievement.progress': 'Progreso: {current}/{target}',
        'achievement.next': 'Siguiente',
        'achievement.page': 'Pagina {current}/{total}',
        'achievement.previous': 'Anterior',
        'achievement.summary': '{completed}/{total} logros completados',
        'achievement.title': 'Logros',
        'achievement.unlocked': 'Completado',
        'enemy.boss': 'jefes',
        'enemy.elite': 'elite',
        'enemy.fast': 'rapidos',
        'enemy.heavy': 'pesados',
        'enemy.normal': 'normales',
        'enemy.ranged': 'a distancia',
        'stat.damage': 'dano',
        'stat.maxHealth': 'vida maxima',
        'stat.movementSpeed': 'velocidad de movimiento',
        'stat.pickupRange': 'rango de recogida',
        'pause.continue': 'Continuar',
        'pause.restart': 'Volver a empezar',
        'pause.restartCancel': 'No, continuar',
        'pause.restartConfirm': 'Si, reiniciar',
        'pause.restartQuestion': 'Volver a empezar desde cero?',
        'pause.title': 'Pausado',
        'patchNotes.title': 'Notas de parche',
        'patchNotes.content': `Dificultad 1

- La partida empieza solo con enemigos básicos.
- Los rápidos aparecen en el minuto 2.
- Los enemigos a distancia llegan en el minuto 3.
- Los enemigos acorazados comienzan a aparecer en el minuto 4.
- Los élites entran en las oleadas estándar en el minuto 6 y también aparecen cada 2 minutos.
- La cantidad de enemigos aumenta a los 1:30 y 3:30.
- La vida y la velocidad de los enemigos crecen con el tiempo.
- Los jefes aparecen en los minutos 5 y 10.

Armas

- Conseguir una nueva arma ahora requiere una mejora épica.
- El arco tiene menos duración de proyectil: 800 ms.
- La ballesta tiene menos duración de proyectil: 1000 ms.

Personaje inicial

- Juegas como el Pícaro, equipado con dagas.`,
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
        'weapon.cannon': 'Cañon',
        'weapon.crossbow': 'Ballesta',
        'weapon.dagger': 'Daga',
        'weapon.daggers': 'Dagas',
        'weapon.staff': 'Vara de mago',
        'win.title': 'Victoria',
    },
    en: {
        'controls.aim': 'Aim with mouse or right stick. Fire with click or A / X.',
        'controls.auto': 'Auto mode: right click or B / O.',
        'controls.move': 'Move with WASD, arrows, D-pad, or left stick',
        'controls.touch': 'Drag to move. Auto aim is enabled.',
        'gameover.title': 'You died',
        'hud.level': 'Level: {level}',
        'hud.gold': 'Gold: {gold}',
        'hud.time': 'Time: {time}',
        'journal.monster.armored': 'Can appear armored and takes 20% less damage.',
        'journal.monster.boss': 'A huge, misshapen, pot-bellied troll wielding a club.',
        'journal.monster.boss.name': 'Troll',
        'journal.monster.elite': 'A larger orc chieftain armed with a long sword.',
        'journal.monster.elite.name': 'Orc chieftain',
        'journal.monster.fast': 'A small green goblin that attacks with a dagger.',
        'journal.monster.fast.name': 'Dagger goblin',
        'journal.monster.heavy': 'A tough boar-man orc that fights with a club.',
        'journal.monster.heavy.name': 'Orc',
        'journal.monster.normal': 'A dog-man gnoll armed with a battered sword.',
        'journal.monster.normal.name': 'Gnoll',
        'journal.monster.ranged': 'A small green goblin equipped with a sling.',
        'journal.monster.ranged.name': 'Sling goblin',
        'journal.monster.rangedStats': ' · Range {range} · Fires every {interval} s',
        'journal.monster.stats': 'Health {health} · Damage {damage} · Speed {speed}\nEXP x{experience} · Gold {gold}%{ranged}',
        'journal.monster.general': 'Durability {health} · Threat {damage} · Pace {speed}',
        'journal.monster.unknown': 'There are not yet enough reliable observations of this creature.',
        'journal.tab.monsters': 'Monsters',
        'journal.tab.weapons': 'Weapons',
        'journal.tab.cheats': 'Cheats',
        'journal.title': 'Journal',
        'journal.empty.monsters': 'Defeat a monster for the first time to record it here.',
        'journal.empty.weapons': 'Buy a weapon in the shop to add it to the journal.',
        'journal.cheats.disabled': 'off',
        'journal.cheats.enabled': 'on',
        'journal.cheats.hint': 'Development cheats do not change saved progress.',
        'journal.cheats.invulnerability': 'Invulnerability: {state}',
        'journal.cheats.speed': 'Game speed: x{speed}',
        'journal.progress': '{kills}/{total} kills recorded',
        'journal.tier.fast': 'fast',
        'journal.tier.high': 'high',
        'journal.tier.low': 'low',
        'journal.tier.medium': 'medium',
        'journal.tier.mediumSpeed': 'medium',
        'journal.tier.slow': 'slow',
        'journal.weapon.area': ' · Area {radius}',
        'journal.weapon.bow': 'A light bow that fires fast projectiles.',
        'journal.weapon.cannon': 'A heavy cannon that causes a devastating explosion.',
        'journal.weapon.crossbow': 'A powerful crossbow whose bolts pierce enemies.',
        'journal.weapon.dagger': 'Two swift blades released together toward the target.',
        'journal.weapon.staff': 'A magic staff whose impact harms nearby enemies.',
        'journal.weapon.stats': 'Damage {damage} · Every {interval} s\nSpeed {speed} · Piercing {piercing}{area}',
        'journal.weapon.general': 'Damage {damage} · Rate {cadence} · Projectile {speed}',
        'journal.weapon.unknown': 'Score kills with this weapon to study it.',
        'language.english': 'English',
        'language.japanese': '日本語',
        'language.spanish': 'Español',
        'language.title': 'Language',
        'menu.back': 'Back',
        'menu.gold': 'Gold: {gold}',
        'menu.main': 'Main menu',
        'menu.metaProgression': 'Upgrades',
        'menu.newGame': 'New game',
        'menu.patchNotes': 'Patch notes',
        'menu.selectCharacter': 'Choose character',
        'menu.start': 'Start game',
        'menu.title': 'Rogue',
        'character.rogue': 'Rogue',
        'meta.category.baseStats': 'Base stats',
        'meta.category.weapons': 'Weapons',
        'meta.buy': 'Buy: {gold} gold',
        'meta.damage.description': '+0.2 starting damage per level.',
        'meta.damage.name': 'Might',
        'meta.level': 'Level {current}/{total}',
        'meta.maxed': 'Maxed',
        'meta.movementSpeed.description': '+10 movement speed per level.',
        'meta.movementSpeed.name': 'Light step',
        'meta.pickupRange.description': '+20 pickup range per level.',
        'meta.pickupRange.name': 'Attraction',
        'meta.purchased': 'Purchased',
        'meta.singlePurchase': 'One-time purchase',
        'meta.title': 'Meta progression',
        'meta.vitality.description': '+1 starting health per level.',
        'meta.vitality.name': 'Vitality',
        'meta.weapon.description': 'Allow this weapon to appear during a game.',
        'achievement.explorer': 'Explorer',
        'achievement.hunter': 'Hunter',
        'achievement.scout': 'Map scout',
        'achievement.sharpshooter': 'Sharpshooter',
        'achievement.survivor': 'Survivor',
        'achievement.veteran': 'Veteran',
        'achievement.metric.damageTaken': 'Lose {value} health',
        'achievement.metric.deaths': 'Die {value} times',
        'achievement.metric.areaImpactKills': 'Kill {value} enemies with one area hit',
        'achievement.metric.coinsRun': 'Collect {value} coins in one game',
        'achievement.metric.finalBossBefore': 'Defeat the final boss before {time}',
        'achievement.metric.gameCompleted': 'Complete Normal difficulty',
        'achievement.metric.gameCompletedLowHealth': 'Finish with less than {value} health',
        'achievement.metric.kills': 'Kill {value} enemies',
        'achievement.metric.killsByEnemy': 'Kill {value} {enemy} enemies',
        'achievement.metric.killsByWeapon': 'Kill {value} enemies with {weapon}',
        'achievement.metric.killsWithoutDamage': 'Kill {value} enemies without taking damage',
        'achievement.metric.level': 'Reach level {value} in one game',
        'achievement.metric.playTime': 'Play for {value} minutes',
        'achievement.metric.stat': 'Reach {value} {stat}',
        'achievement.metric.survivalRun': 'Survive {value} min in one game',
        'achievement.metric.survivalTotal': 'Survive {value} min total',
        'achievement.metric.survivalWithoutUpgrades': 'Survive {value} min without choosing upgrades',
        'achievement.metric.weaponsEquipped': 'Equip {value} different weapons',
        'achievement.progress': 'Progress: {current}/{target}',
        'achievement.next': 'Next',
        'achievement.page': 'Page {current}/{total}',
        'achievement.previous': 'Previous',
        'achievement.summary': '{completed}/{total} achievements completed',
        'achievement.title': 'Achievements',
        'achievement.unlocked': 'Completed',
        'enemy.boss': 'boss',
        'enemy.elite': 'elite',
        'enemy.fast': 'fast',
        'enemy.heavy': 'heavy',
        'enemy.normal': 'normal',
        'enemy.ranged': 'ranged',
        'stat.damage': 'damage',
        'stat.maxHealth': 'maximum health',
        'stat.movementSpeed': 'movement speed',
        'stat.pickupRange': 'pickup range',
        'pause.continue': 'Continue',
        'pause.restart': 'Restart',
        'pause.restartCancel': 'No, continue',
        'pause.restartConfirm': 'Yes, restart',
        'pause.restartQuestion': 'Restart from the beginning?',
        'pause.title': 'Paused',
        'patchNotes.title': 'Patch notes',
        'patchNotes.content': `Difficulty 1

- The run starts with basic enemies only.
- Fast enemies appear in minute 2.
- Ranged enemies arrive in minute 3.
- Armored enemies begin appearing in minute 4.
- Elites join standard waves in minute 6 and also appear every 2 minutes.
- Enemy numbers increase at 1:30 and 3:30.
- Enemy health and speed grow over time.
- Bosses appear in minutes 5 and 10.

Weapons

- New weapons now require an epic upgrade.
- Bow projectile lifetime reduced to 800 ms.
- Crossbow projectile lifetime reduced to 1000 ms.

Starting character

- Play as the Rogue, equipped with daggers.`,
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
        'weapon.daggers': 'Daggers',
        'weapon.staff': 'Mage staff',
        'win.title': 'Victory',
    },
    ja: {
        'achievement.explorer': '探検家',
        'achievement.hunter': '狩人',
        'achievement.scout': '地図の偵察者',
        'achievement.sharpshooter': '名射手',
        'achievement.survivor': '生存者',
        'achievement.veteran': 'ベテラン',
        'achievement.metric.damageTaken': '体力を {value} 失う',
        'achievement.metric.deaths': '{value} 回倒れる',
        'achievement.metric.areaImpactKills': '1 回の範囲攻撃で敵を {value} 体倒す',
        'achievement.metric.coinsRun': '1 回のゲームでコインを {value} 枚集める',
        'achievement.metric.finalBossBefore': '{time} までに最終ボスを倒す',
        'achievement.metric.gameCompleted': 'ノーマル難易度をクリアする',
        'achievement.metric.gameCompletedLowHealth': '体力 {value} 未満でクリアする',
        'achievement.metric.kills': '敵を {value} 体倒す',
        'achievement.metric.killsByEnemy': '{enemy} を {value} 体倒す',
        'achievement.metric.killsByWeapon': '{weapon} で敵を {value} 体倒す',
        'achievement.metric.killsWithoutDamage': 'ダメージを受けずに敵を {value} 体倒す',
        'achievement.metric.level': '1 回のゲームでレベル {value} に到達する',
        'achievement.metric.playTime': '{value} 分プレイする',
        'achievement.metric.stat': '{stat} を {value} まで上げる',
        'achievement.metric.survivalRun': '1 回のゲームで {value} 分生き残る',
        'achievement.metric.survivalTotal': '合計 {value} 分生き残る',
        'achievement.metric.survivalWithoutUpgrades': '強化を選ばずに {value} 分生き残る',
        'achievement.metric.weaponsEquipped': '異なる武器を {value} 個装備する',
        'achievement.progress': '進行: {current}/{target}',
        'achievement.next': '次へ',
        'achievement.page': '{current}/{total} ページ',
        'achievement.previous': '前へ',
        'achievement.summary': '{completed}/{total} 個の実績を達成',
        'achievement.title': '実績',
        'achievement.unlocked': '達成済み',
        'enemy.boss': 'ボス',
        'enemy.elite': 'エリート',
        'enemy.fast': '高速の敵',
        'enemy.heavy': '重量級の敵',
        'enemy.normal': '通常の敵',
        'enemy.ranged': '遠距離の敵',
        'stat.damage': 'ダメージ',
        'stat.maxHealth': '最大体力',
        'stat.movementSpeed': '移動速度',
        'stat.pickupRange': '取得範囲',
        'character.rogue': 'ローグ',
        'controls.aim': 'マウスまたは右スティックで照準。クリックまたは A / X で攻撃。',
        'controls.auto': '自動モード: 右クリックまたは B / O。',
        'controls.move': 'WASD、矢印キー、方向パッドまたは左スティックで移動',
        'controls.touch': 'ドラッグで移動。自動照準が有効です。',
        'gameover.title': 'やられてしまった',
        'hud.gold': 'ゴールド: {gold}',
        'hud.level': 'レベル: {level}',
        'hud.time': '時間: {time}',
        'journal.monster.armored': '装甲個体は受けるダメージが 20% 少ない。',
        'journal.monster.boss': '棍棒を振るう、巨大で歪んだ太鼓腹のトロル。',
        'journal.monster.boss.name': 'トロル',
        'journal.monster.elite': '長剣を装備した、より大きなオークの族長。',
        'journal.monster.elite.name': 'オーク族長',
        'journal.monster.fast': '短剣で襲いかかる小柄な緑色のゴブリン。',
        'journal.monster.fast.name': '短剣ゴブリン',
        'journal.monster.heavy': '棍棒で戦う頑丈な猪人のオーク。',
        'journal.monster.heavy.name': 'オーク',
        'journal.monster.normal': '傷んだ剣を持つ犬人のノール。',
        'journal.monster.normal.name': 'ノール',
        'journal.monster.ranged': 'スリングを装備した小柄な緑色のゴブリン。',
        'journal.monster.ranged.name': 'スリングゴブリン',
        'journal.monster.rangedStats': ' · 射程 {range} · {interval} 秒ごとに攻撃',
        'journal.monster.stats': '体力 {health} · ダメージ {damage} · 速度 {speed}\nEXP x{experience} · ゴールド {gold}%{ranged}',
        'journal.monster.general': '耐久 {health} · 脅威 {damage} · 動き {speed}',
        'journal.monster.unknown': 'この生物についての信頼できる観察記録はまだ不足している。',
        'journal.tab.monsters': 'モンスター',
        'journal.tab.weapons': '武器',
        'journal.tab.cheats': 'チート',
        'journal.title': '日誌',
        'journal.empty.monsters': 'モンスターを初めて倒すと、ここに記録される。',
        'journal.empty.weapons': '店で武器を購入すると、日誌に追加される。',
        'journal.cheats.disabled': '無効',
        'journal.cheats.enabled': '有効',
        'journal.cheats.hint': '開発用チートは保存された進行状況を変更しない。',
        'journal.cheats.invulnerability': '無敵: {state}',
        'journal.cheats.speed': 'ゲーム速度: x{speed}',
        'journal.progress': '{kills}/{total} 体を記録',
        'journal.tier.fast': '速い',
        'journal.tier.high': '高い',
        'journal.tier.low': '低い',
        'journal.tier.medium': '中程度',
        'journal.tier.mediumSpeed': '普通',
        'journal.tier.slow': '遅い',
        'journal.weapon.area': ' · 範囲 {radius}',
        'journal.weapon.bow': '高速の投射物を放つ軽い弓。',
        'journal.weapon.cannon': '壊滅的な爆発を起こす重い大砲。',
        'journal.weapon.crossbow': '敵を貫通するボルトを放つ強力なクロスボウ。',
        'journal.weapon.dagger': '標的へ同時に放たれる二本の素早い刃。',
        'journal.weapon.staff': '着弾時に周囲の敵へダメージを与える魔法の杖。',
        'journal.weapon.stats': 'ダメージ {damage} · 間隔 {interval} 秒\n速度 {speed} · 貫通 {piercing}{area}',
        'journal.weapon.general': 'ダメージ {damage} · 攻撃間隔 {cadence} · 投射物 {speed}',
        'journal.weapon.unknown': 'この武器で敵を倒し、情報を集めよう。',
        'language.english': 'English',
        'language.japanese': '日本語',
        'language.spanish': 'Español',
        'language.title': '言語',
        'menu.back': '戻る',
        'menu.gold': 'ゴールド: {gold}',
        'menu.main': 'メインメニュー',
        'menu.metaProgression': '強化',
        'menu.newGame': 'ニューゲーム',
        'menu.patchNotes': 'パッチノート',
        'menu.selectCharacter': 'キャラクターを選択',
        'menu.start': 'ゲーム開始',
        'menu.title': 'Rogue Heaven',
        'meta.category.baseStats': '基本ステータス',
        'meta.category.weapons': '武器',
        'meta.buy': '購入: {gold} ゴールド',
        'meta.damage.description': 'レベルごとに開始ダメージ +0.2。',
        'meta.damage.name': '力',
        'meta.level': 'レベル {current}/{total}',
        'meta.maxed': '最大',
        'meta.movementSpeed.description': 'レベルごとに移動速度 +10。',
        'meta.movementSpeed.name': '軽い足取り',
        'meta.pickupRange.description': 'レベルごとに取得範囲 +20。',
        'meta.pickupRange.name': '引き寄せ',
        'meta.purchased': '購入済み',
        'meta.singlePurchase': '一回限りの購入',
        'meta.title': 'メタプログレッション',
        'meta.vitality.description': 'レベルごとに開始時の体力 +1。',
        'meta.vitality.name': '生命力',
        'meta.weapon.description': 'ゲーム中にこの武器が出現するようにする。',
        'pause.continue': '続ける',
        'pause.restart': 'やり直す',
        'pause.restartCancel': 'いいえ、続ける',
        'pause.restartConfirm': 'はい、やり直す',
        'pause.restartQuestion': '最初からやり直しますか？',
        'pause.title': '一時停止',
        'patchNotes.title': 'パッチノート',
        'patchNotes.content': `難易度 1

- 開始時は基本の敵だけが出現します。
- 2 分目に高速の敵が出現します。
- 3 分目に遠距離の敵が出現します。
- 4 分目から装甲を持つ敵が出現します。
- 6 分目からエリートが通常のウェーブに加わり、2 分ごとにも出現します。
- 敵の数は 1:30 と 3:30 に増加します。
- 敵の体力と速度は時間とともに上昇します。
- ボスは 5 分目と 10 分目に出現します。

武器

- 新しい武器の取得にはエピックのアップグレードが必要です。
- 弓の投射物の持続時間を 800 ms に短縮しました。
- クロスボウの投射物の持続時間を 1000 ms に短縮しました。

開始キャラクター

- 短剣を装備したローグでプレイします。`,
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
        'weapon.daggers': '短剣',
        'weapon.staff': '魔術師の杖',
        'win.title': '勝利',
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
