# The Last Phantasm

The Last Phantasm is a TypeScript tactical RPG prototype built around readable battlefields, deterministic combat rules, and data-driven tactical scenarios.

## Current prototype

- Charge Time turns
- Movement, melee and ranged attacks
- Line of sight, facing, counters, and statuses
- Enemy AI and objectives
- Battle UI and serializable snapshots
- External unit, weapon, AI, and map data

## Stack

Strict TypeScript, native HTML/CSS, Canvas 2D, Vite, and Vitest. The runtime has no production server requirement.

## Setup and validation

```bash
npm install
npm run dev
npm test
npm run typecheck
npm run build
npm run check
```

Use `npm run preview` to preview a production build locally.

## Architecture

- `src/core/`: lifecycle, loop, scenes, events, configuration, and logging
- `src/data/tactical/`: versioned map schemas, validation, terrain resolution, and loading
- `src/world/`: isometric math, traversal, A*, and movement-range algorithms
- `src/rendering/tactical/`: ordered terrain, overlay, unit, effect, UI, and debug passes

See [docs](docs/) and the [project bible](project-bible/README.md).

The repository documents a GitHub Pages base path, but no verified live demo URL or screenshot gallery is linked here.
