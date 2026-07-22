# Combat System Boundary

Sprint 2 does not implement combat. It establishes the contracts Sprint 3 may consume without coupling tactical space to combat rules.

## Available tactical contracts

- `TacticalMap` resolves terrain, elevation, walkability, cost, cover, opacity, destructibility, and hazards.
- `GridPoint` is the stable unit-position coordinate.
- `Pathfinder` accepts occupied tiles and movement constraints but does not know units or teams.
- `movementRange` returns cost and remaining budget but does not decide whose turn it is.
- `TileHighlights` provides semantic attack, ability, danger, objective, spawn, invalid, hover, selection, and movement layers without calculating them.
- The unit/effects render passes are ordering boundaries, not completed gameplay systems.

## Sprint 3 decisions required

Charge Time semantics, unit statistics and footprints, line-of-sight, target validation, damage/resistance, ability shapes, reactions, AI planning, encounter state, and save representation must be specified before implementation. These decisions must remain outside render code.
