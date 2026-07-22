# The Last Phantasm

The Last Phantasm is an original political dark-fantasy tactical RPG built around cinematic, handcrafted missions, consequential relationships, and readable battlefields without required grinding.

## Status

Sprint 1 establishes a lightweight, testable browser engine shell: a responsive Canvas 2D playfield, DOM menus and settings, scenes, input, camera controls, configuration, saves, audio, diagnostics, and error presentation. Tactical combat is intentionally outside this sprint.

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
- `src/save`, `src/audio`, `src/debug`: platform foundations
- `project-bible`: authoritative product and active-sprint documents
- `docs`: architecture, setup, testing, deployment, and preserved references
- `assets`: versioned game assets grouped by domain

## Deployment

Production builds use `/the-last-phantasm-/` as the GitHub Pages base path while local development uses `/`. Publish `dist/` through a Pages workflow; do not commit it by default. See [GitHub Pages deployment](docs/deployment/github-pages.md).

## Documentation workflow

Agents and contributors must follow [AGENTS.md](AGENTS.md), then read the [project bible](project-bible/README.md). Architecture or behavior changes must update the corresponding documentation and current sprint record.

## Sprint 1

The implementation and automated checks are complete. Browser visual QA remains environment-dependent; current scope and validation evidence belong in [the current sprint](project-bible/08-current-sprint.md).
