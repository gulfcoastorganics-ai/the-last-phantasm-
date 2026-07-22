# Sprint 2 — Tactical Engine Foundation

## Objective

Finish the reusable tactical systems that every future mission, unit, combat rule, and AI controller will consume. This sprint contains no story or mission implementation.

## Deliverables

- [x] Arbitrary-size isometric grid/world/screen conversion and elevation-aware picking
- [x] Data-driven terrain definitions and resolved tile overrides
- [x] Versioned, validated external JSON maps with safe loading failures and collection defaults
- [x] Map data for terrain, elevation, spawns, objectives, decorations, triggers, encounters, weather, lighting, and metadata
- [x] Smooth camera focus/fit, follow hook, edge scrolling, inertia, zoom smoothing, and coordinate helpers
- [x] Cached A* with terrain/elevation cost, occupancy, impassability, optional diagonals, and reconstruction
- [x] Movement-budget flood fill with remaining-movement values
- [x] Layered semantic tile highlights
- [x] Ordered terrain, overlay, unit, effect, UI, and debug render passes
- [x] Extended development-only diagnostics for timing, tactical coordinates, path nodes, and draw calls
- [x] Accessible DOM status plus keyboard, pointer, and touch operation
- [x] Regression and tactical unit tests
- [ ] Browser screenshot-based visual playtest

## Explicitly out of scope

Units as gameplay entities, Charge Time, attacks, damage, abilities, enemy AI, mission scripting, story content, inventory, jobs, equipment, and production art/audio.

## Definition of done

The engine loads an external map, renders terrain/elevation, selects tiles accurately, previews movement range and paths, layers overlays deterministically, passes all automated gates, and exposes stable system contracts for Sprint 3.
