# Testing Strategy

Fast unit tests cover deterministic engine and combat boundaries: events, lifecycle, input, camera, saves, coordinates, maps, pathfinding, units, occupancy, initiative, turns, LOS, formulas, status effects, AI, objectives, and battle snapshot restoration.

The required gate is:

```bash
npm run typecheck
npm test
npm run build
git diff --check
```

Browser playtesting should additionally verify responsive layout, keyboard focus, pointer capture, touch dragging, wheel zoom, settings modal input isolation, hidden-tab recovery, debug overhead, and fatal-error presentation. Do not infer visual correctness from unit tests.
