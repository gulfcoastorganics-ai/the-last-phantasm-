# Sprint 3 — Playable Tactical Combat Prototype

## Objective

Deliver a deterministic, data-driven battle prototype on the Sprint 2 tactical engine without introducing campaign content or a runtime framework.

## Completed scope

- [x] Validated external unit templates, placements, weapons, AI profiles, statuses, battle definition, and 8×8 map
- [x] Serializable unit runtime and centralized mutations
- [x] Shared occupancy, one-tile footprints, reservations, spawn validation, and defeat removal
- [x] Deterministic CT initiative with five-turn forecast
- [x] Validated turn state machine and explicit `hasMoved`/`hasActed`
- [x] Player move, attack, wait/guard, end-turn, cancel, inspect, and facing controls
- [x] Movement range/path reuse and presentation-only interpolation
- [x] Facing, elevation, hit, damage, critical, LOS, structured results, and non-recursive counters
- [x] Guard, Haste, Slow, and Poison status foundation
- [x] Bounded deterministic enemy AI and data-driven objectives
- [x] Team/facing/HP/active/target/impact unit markers in the existing unit pass
- [x] Compact accessible battle HUD, procedural optional audio, diagnostics, and battle snapshots
- [x] Expanded unit and integration tests
- [ ] Screenshot-based browser interaction verification

## Explicitly out of scope

Final characters, story, dialogue, campaign state, inventory, job switching, equipment management, ability catalog, spell effects, sophisticated reactions, and production assets.

## Definition of done

Automated type, test, build, audit, and diff gates pass; external combat data loads; player and deterministic AI turns complete; victory/loss and restart work; battle snapshots validate and restore; documentation matches implementation.
