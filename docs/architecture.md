# Combat Architecture

See `docs/architecture/sprint-1-engine-architecture.md`, `sprint-2-tactical-architecture.md`, and the authoritative `project-bible/technical-architecture.md`.

Sprint 3 adds pure combat modules below `BattleController`; `EngineDemoScene` composes them with existing navigation, rendering, camera, input, audio, and DOM services. Simulation never waits for animation and serialized state excludes presentation.
