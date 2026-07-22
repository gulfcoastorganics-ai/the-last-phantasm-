# Battle Save Format

Battle snapshots use version 1 and contain map id, complete serializable unit states, active unit, initiative pause/active state, turn phase, action consumption, objectives, status effects, PRNG state, and the last 50 combat-log entries.

Snapshots contain no Canvas, DOM, function, renderer, AI presentation, or circular references. Runtime validation rejects unsupported versions and malformed unit state. Restore checks the expected map, unit count, unit identifiers, and active-unit validity before rebuilding occupancy, initiative, turn state, objectives, PRNG, and log.

The architecture supports import/export and future migration. Sprint 3 does not automatically enable mid-battle saving.
