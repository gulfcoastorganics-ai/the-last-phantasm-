# Technical Architecture

The browser runtime uses strict TypeScript, ES modules, Canvas 2D, Vite, and Vitest. Game state and lifecycle live outside rendering; physical input maps to semantic actions; menus and accessibility-sensitive controls use DOM; platform services expose narrow, disposable boundaries.

The source documents `developer-insights.txt` and `build-insights.txt` were unavailable during bootstrap. Their supported guidance must be normalized here when available, with conflicts preserved rather than silently resolved.

Tactical data flows in one direction: external JSON → runtime validation → resolved immutable map model → pure navigation/coordinate services → ordered render passes. The renderer never owns authoritative terrain, movement, or path state.

See `docs/architecture/sprint-1-engine-architecture.md` and `docs/architecture/sprint-2-tactical-architecture.md` for implemented structures.
