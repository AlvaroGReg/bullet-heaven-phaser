---
name: bullet-heaven-stats
description: Use when adding or changing a player or enemy statistic, luck, status effect, in-game upgrade, meta-game upgrade, character modifier, stat achievement, or stat localization in this bullet-heaven project.
---

# Bullet-Heaven Statistics

Implement a statistic as a complete gameplay contract, not as an unused field. First trace the requested stat through the current systems:

- Definition: `src/game/PlayerStats.ts` or `src/entities/enemyTypes.ts`
- Runtime use: `src/systems/CombatSystem.ts`, `src/systems/ExperienceSystem.ts`, `src/systems/CurrencySystem.ts`, `src/systems/WeaponSystem.ts`, and `src/systems/PlayerController.ts`
- In-game choices: `src/systems/UpgradeSystem.ts`
- Achievements: `src/game/Achievements.ts` and `src/scenes/MenuScene.ts`
- Meta progression: `src/game/MetaProgress.ts` and `src/scenes/MenuScene.ts`
- Player or character setup: `src/entities/createPlayer.ts`, `src/game/constants.ts`, and character selection
- Localization: `src/i18n/index.ts`

Consult the `phaser` skill when the statistic changes Phaser behavior or collision handling.

## Workflow

1. Define the stat's unit, base value, valid range, stacking rule, and exact outcome before editing. Identify whether it applies to players, enemies, or both.
2. Add it to the appropriate typed model and one runtime calculation that makes it observable. Avoid a field that is only displayed or persisted.
3. If requested, add an in-game upgrade by extending `UpgradeType`, its count record, choice generation, effect, and all localized name and description keys.
4. If requested, add a meta-game upgrade only after checking whether purchase and unlock application are implemented. `META_UPGRADES` is currently a displayed catalogue, not a purchase or gameplay-effect system. Do not claim a meta upgrade works until those systems exist.
5. Apply character-specific modifiers at character initialization or a dedicated character definition, not by scattering class-name conditionals through combat or upgrade code.
6. If requested, add stat achievements through the existing `stat` metric. The stat must be a `keyof PlayerStats`, progress must be recorded after every source that can change it, and menu labels plus all supported locales must be present.
7. For chance-based effects, clamp probability to `[0, 1]`, state the roll point, and preserve a predictable default. For luck, define separate formulas for rarity, extra experience, and extra gold rather than one vague multiplier.
8. Run `npm run build`. Report the initial value, every modifier, probability formula, and any requested but unavailable meta-progression behavior.

## Luck Example Requirements

For a luck request that affects rarity, bonus experience, and bonus gold:

- Treat upgrade rarity, experience bonus, and gold bonus as separate effects with separate configured rates.
- Apply rarity only in `UpgradeSystem.chooseRarity`; rebalance weights while retaining a non-zero common fallback.
- Roll extra experience where gems are collected and extra gold where currency is awarded or collected. Do not alter enemy base drops unless explicitly requested.
- Add the rogue's 1.5 modifier as a documented initial stat or character multiplier, with the stacking order made explicit.
- Add requested in-game and meta-game upgrades, achievements at exactly the supplied thresholds, and translations for all locales.
