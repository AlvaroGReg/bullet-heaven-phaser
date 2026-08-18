---
name: bullet-heaven-enemies
description: Use when adding a new enemy type, enemy sprite, enemy special ability, enemy stats, spawn phase, enemy achievement, or enemy localization to this Phaser bullet-heaven project.
---

# Bullet-Heaven Enemies

Use this skill for the complete implementation of a new enemy. Read these files before changing anything:

- `src/entities/enemyTypes.ts`
- `src/entities/createEnemy.ts`
- `src/systems/EnemySpawner.ts`
- `src/systems/CombatSystem.ts`
- `src/game/difficultyLevels.ts`
- `src/game/Achievements.ts`
- `src/i18n/index.ts`
- `src/sprites/pixelRenderer.ts`

Consult `game-assets` before designing the sprite and `phaser` before changing Phaser objects, physics, or collisions.

## Workflow

1. Classify the requested role against the existing `normal`, `fast`, `heavy`, `ranged`, `elite`, and `boss` enemies. Propose health, damage, speed, radius, experience, and gold values relative to the nearest role before editing.
2. Add the new `EnemyKind` and its typed `EnemyDefinition`. Keep base definitions difficulty-independent; time and difficulty multipliers belong in the spawning and difficulty data.
3. Create a distinct grim pixel-art texture using `renderSpriteSheet`. Use a bold silhouette, near-black outline, restrained shading, and a readable gameplay color at the existing 2x scale. Do not use a circle placeholder when the request requires a sprite.
4. Update enemy creation to instantiate the texture while retaining the correct Arcade Physics body, radius, armor treatment, scaling, and typed runtime fields.
5. Implement special abilities as observable, bounded combat behavior. Specify their trigger, range, cooldown, duration, damage or status effect, and cleanup on enemy death or scene restart. Do not represent a status effect with an unrelated numeric stat.
6. Add the kind only to the requested difficulty phases. Update weights deliberately and state the resulting mix, entry time, and expected role in the encounter.
7. Add a stable kill achievement for a regular new enemy unless the user excludes achievements. Extend localization for the enemy and achievement labels in every supported locale.
8. Run `npm run build` and verify a new run can spawn, damage, kill, award experience and gold for, and restart after the enemy.

## Stat Guidelines

- A tank should gain most of its threat from health and size, not unexpectedly high damage or speed.
- A fast enemy should trade durability and contact damage for speed.
- A ranged enemy needs defined attack range, interval, projectile speed, and projectile cleanup.
- An elite or boss should be scheduled deliberately rather than diluted into an early normal wave.
- If the enemy changes required player DPS materially, use `bullet-heaven-balance` to report the resulting phase impact.

## Required Summary

Report the role comparison, final stat table, special-ability rules, spawn locations and weights, achievement added, visual design, and verification. State assumptions rather than presenting subjective balance choices as measured facts.
