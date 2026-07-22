# Sprint 3 Data Schemas

External `combat-prototype.json` defines immutable templates, weapons, abilities, AI profiles, and status definitions. `battle-prototype.json` defines unit instances, team, placement, facing, controllability, spawn order, objectives, and seed. `combat-prototype.json` map data remains under the Sprint 2 versioned map schema.

Unit runtime state contains all required identity, job/level, HP/MP, Speed/CT, Move/Jump, attack/defense/accuracy/evasion/critical stats, weapon/abilities, statuses, facing, position, team, alive/controllable flags, AI profile, and stable spawn order. Branded string types constrain unit, template, and weapon identifiers at TypeScript boundaries.

Validators reject unsupported versions, invalid numeric bounds, duplicates, missing template/weapon/AI references, duplicate spawns, and malformed placements before constructing battle state.
