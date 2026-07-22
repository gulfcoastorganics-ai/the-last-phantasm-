# Decisions and Open Questions

## Decisions

- **2026-07-21 — Rendering foundation:** Canvas 2D with a DOM UI overlay. This follows the stated stack and protects accessible, semantic controls.
- **2026-07-21 — Runtime dependencies:** none for Sprint 1; browser APIs are sufficient.
- **2026-07-21 — Persistence:** versioned localStorage envelopes with settings separated from campaign data.

## Open questions and blocked imports

- All eight expected `/mnt/data` source documents and any concept images were absent during bootstrap. Their content, conflicts, and provenance cannot be assessed until provided.
- Confirm the campaign, character, mechanics, and post-Sprint-1 roadmap from the authoritative GDD and companion documents before implementing those areas.
- Decide whether a later measured workload justifies WebGL; Canvas 2D remains the default until then.
