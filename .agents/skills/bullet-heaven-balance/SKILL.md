---
name: bullet-heaven-balance
description: Use when asked for DPS difficulty tables, 30-second phase analysis, or difficulty scaling by percentage in this bullet-heaven project.
---

# Bullet-Heaven Balance

Use this skill for numerical enemy and difficulty work. Read the current definitions before calculating or editing:

- `src/game/difficultyLevels.ts`
- `src/systems/EnemySpawner.ts`
- `src/entities/enemyTypes.ts`
- `src/entities/createEnemy.ts`
- `src/systems/CombatSystem.ts`
- `src/game/Achievements.ts`

Consult the `phaser` skill before Phaser API changes and `game-assets` before creating enemy sprites.

## DPS Table

When the user requests a difficulty table, produce one row for every requested 30-second window, not just for each configured spawn phase.

1. Simulate scheduled spawns from `EnemySpawner` exactly: initialize at `spawnInterval.initial`, choose the active phase at each spawn time, apply the spawn interval selected by the spawner, and include elite and boss spawns at their scheduled timestamps.
2. Use the runtime scaling rule at each spawn: `1 + floor(timeMs / 60000) * healthPerMinute`. Apply a final-boss health multiplier only to the final boss.
3. Split normal wave counts by their configured weights. A fractional count is an expected count, and must be labelled as such.
4. Calculate required DPS as total effective health spawned in the window divided by the window duration. This is the sustained DPS needed to kill that window's spawns within that same window; it is not a survival guarantee.
5. For armor, report both the unarmored health and the expected effective health. Armor reduces hit damage to 80%, so armored effective health is `health / 0.8`; weight it by the armor probability at that time and only for eligible kinds.
6. Include columns for window, spawn count and mix, scaled health by kind, armor expectation, boss or elite events, total effective health, and required DPS. Show enemy damage and speed separately as threat context; neither changes DPS required.

Default exclusions: movement speed, projectile speed, projectile lifetime, accuracy, pathing, area damage, piercing, player upgrades, and enemy accumulation beyond the current window. State these assumptions. If requested, extend the model with only the requested factor.

## Difficulty Scaling

For a request such as "difficulty N is X% harder than N - 1 by HP":

1. Confirm the metric when the request is ambiguous. Do not silently treat more damage, speed, or spawn frequency as HP scaling.
2. Preserve the existing phase timings, weights, armor rules, boss schedule, and time growth unless the user explicitly changes them.
3. Express the requested HP multiplier in difficulty data so every enemy, elite, and boss inherits it. Do not mutate shared enemy definitions or duplicate the spawning algorithm.
4. Add a selectable difficulty only when the game has a selection path. Otherwise, keep the addition minimal and state that the level is data-ready but not selectable.
5. Recalculate the DPS table for the changed difficulty and run `npm run build`.
