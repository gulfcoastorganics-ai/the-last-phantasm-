# The Last Phantasm

The Last Phantasm is an original political dark-fantasy tactical RPG built around cinematic, handcrafted missions, consequential relationships, and readable battlefields without required grinding.

## Status

Sprint 3 provides a deterministic playable combat prototype on the tactical foundation: external unit/weapon/AI data, Charge Time turns, movement, melee/ranged attacks, LOS, facing, counters, statuses, enemy AI, objectives, battle UI, and serializable snapshots.

## Stack

Strict TypeScript, native HTML/CSS, Canvas 2D, Vite, and Vitest. The runtime has no production dependencies or server requirement.

## Setup

```bash
npm install
npm run dev
```

Open the URL printed by Vite. Use `npm test`, `npm run typecheck`, `npm run build`, or `npm run check` for validation. Preview production output with `npm run preview`.

## Project map

- `src/core`: lifecycle, loop, scenes, events, configuration, logging
- `src/rendering`: Canvas, viewport, and camera boundaries
- `src/input`: physical inputs mapped to actions
- `src/scenes`: loading, main menu, and engine demonstration
- `src/data/tactical`: versioned map schemas, validation, terrain resolution, and loading
- `src/world`: isometric math, traversal, A*, and movement-range algorithms
- `src/rendering/tactical`: ordered terrain, overlay, unit, effect, UI, and debug passes
- `src/save`, `src/audio`, `src/debug`: platform foundations
- `project-bible`: authoritative product and active-sprint documents
- `docs`: architecture, setup, testing, deployment, and preserved references
- `assets`: versioned game assets grouped by domain

## Deployment

Production builds use `/the-last-phantasm-/` as the GitHub Pages base path while local development uses `/`. Publish `dist/` through a Pages workflow; do not commit it by default. See [GitHub Pages deployment](docs/deployment/github-pages.md).

## Documentation workflow

Agents and contributors must follow [AGENTS.md](AGENTS.md), then read the [project bible](project-bible/README.md). Architecture or behavior changes must update the corresponding documentation and current sprint record.

## Sprint 3

The combat prototype loads the external 8×8 map and five development units. Use the accessible command menu or keyboard shortcuts documented in [combat accessibility](docs/accessibility.md). Current rules and scope live in [the current sprint](project-bible/08-current-sprint.md) and [combat specification](project-bible/combat-spec.md).
