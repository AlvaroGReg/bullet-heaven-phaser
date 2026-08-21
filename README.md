# Rogue Heaven with Phaser

Browser-based 2D bullet-heaven project. The goal is not to design a final architecture or optimize prematurely, but to understand the systems behind this kind of game through small, playable increments.

## Technologies

- Phaser 3
- TypeScript
- Vite

## Requirements

- Node.js 20 or later
- npm

## Run the Project

```bash
npm install
npm run dev
```

To create a production build:

```bash
npm run build
```

## Structure

```text
src/
    entities/  Physical representation of the player and enemies
    game/      Shared configuration and constants
    scenes/    Game flow and screens
    systems/   Input and combat
    ui/        In-game interface
    world/     Map creation
    main.ts    Entry point
```

The scene coordinates systems and the interface; each module holds one specific gameplay responsibility.

## Agents and Skills

Agent configuration is centralized in `.agents/`:

- `.agents/AGENTS.md`: shared instructions and skill-use policy.
- `.agents/agents/`: reusable implementation, planning, and review roles.
- `.agents/skills/`: skills installed with `npx skills add`.
- `skills-lock.json`: reproducible record of installed skills.

Available roles:

- `phaser-implementer`: implements small increments and runs the build.
- `gameplay-planner`: breaks mechanics into playable steps without editing code.
- `code-reviewer`: reviews changes for bugs, regressions, and missing tests.

OpenCode loads `.agents/AGENTS.md`, skills, and roles through `opencode.json`. Restart it after changing this configuration, roles, or skills.

## Intentional Limits

ECS, object pooling, multiplayer, and optimizations for thousands of entities will not be implemented until learning goals or a real prototype limitation require them. Meta-progression is limited to local browser storage for gold purchases; achievement-based unlocks are tracked separately and will be integrated later.
