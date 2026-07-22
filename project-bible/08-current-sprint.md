# Sprint 1 — Core Engine Foundation

## Objective

Build a stable, testable, lightweight application shell for future rendering, tactical combat, story, and UI systems.

## Deliverables

- [x] Application bootstrap, `Game`, bounded semi-fixed loop, and time service
- [x] Scene contract/manager plus loading, main-menu, and engine-demo scenes
- [x] Typed event bus and semantic keyboard/pointer/touch input
- [x] Canvas renderer, responsive viewport, DPR cap, and pan/zoom camera
- [x] Configuration, logging, asset, audio, and versioned localStorage save foundations
- [x] DOM main menu/settings, debug overlay, performance monitor, and fatal-error surface
- [x] Unit tests and setup/build documentation
- [ ] Browser visual playtest (requires an available browser automation session)

## Demonstration acceptance

The app opens at a main menu with New Game, Engine Demo, and Settings actions. The demo exposes responsive Canvas 2D rendering, drag/keyboard pan, wheel/button zoom, input feedback, focus, diagnostics, a save smoke test, and safe platform fallbacks.

## Explicitly out of scope

CT combat, enemy AI, jobs, inventory, equipment, full dialogue, mission scripting, the full Silent Convoy battle, production asset pipelines, complex particles, service workers, and IndexedDB persistence.

## Validation gate

Sprint work is complete only when `npm test`, `npm run typecheck`, and `npm run build` pass and `git diff --check` is clean.
