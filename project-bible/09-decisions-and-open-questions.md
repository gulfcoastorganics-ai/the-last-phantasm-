# Decisions and Open Questions

## Decisions

- **2026-07-21 — Rendering foundation:** Canvas 2D with a DOM UI overlay. This follows the stated stack and protects accessible, semantic controls.
- **2026-07-21 — Runtime dependencies:** none for Sprint 1; browser APIs are sufficient.
- **2026-07-21 — Persistence:** versioned localStorage envelopes with settings separated from campaign data.
- **2026-07-21 — Tactical coordinates:** integer square-grid coordinates are authoritative; isometric world/screen coordinates are projections only.
- **2026-07-21 — Map format:** versioned JSON is validated at runtime and resolved into a read-only tactical map boundary.
- **2026-07-21 — Navigation:** cardinal movement is the default. Diagonals are an explicit option and cannot cut impassable corners.
- **2026-07-21 — Rendering:** fixed Canvas 2D passes render terrain, overlays, units, effects, UI, then development diagnostics. Simulation remains renderer-independent.
- **2026-07-21 — Debug shipping:** tactical debug rendering and the diagnostic overlay remain disabled in production builds.

## Open questions and blocked imports

- All eight expected `/mnt/data` source documents and any concept images were absent during bootstrap. Their content, conflicts, and provenance cannot be assessed until provided.
- Confirm the campaign, character, mechanics, and post-Sprint-1 roadmap from the authoritative GDD and companion documents before implementing those areas.
- Decide whether a later measured workload justifies WebGL; Canvas 2D remains the default until then.
- Define Sprint 3 Charge Time timing, unit footprint rules, line-of-sight, attack range, and combat resolution before implementing combat.
