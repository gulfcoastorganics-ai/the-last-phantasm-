# Source Manifest

Import date: 2026-07-21. `/mnt/data` did not exist in the execution environment, so no source was copied or transformed. The expected imports remain recorded below to prevent false provenance claims.

| Original filename | Original path | Destination | Purpose | Status / treatment |
|---|---|---|---|---|
| `GDD.txt` | `/mnt/data/GDD.txt` | `02-game-design-document.md`; `01-vision-and-pillars.md` | Authoritative product vision and roadmap | Unavailable; destination has only brief-supported synthesis |
| `storyline.txt` | `/mnt/data/storyline.txt` | `03-story-and-campaign.md` | Campaign narrative | Unavailable; not imported |
| `character-bios.txt` | `/mnt/data/character-bios.txt` | `04-character-bible.md` | Character source | Unavailable; not imported |
| `demo-roadmap.txt` | `/mnt/data/demo-roadmap.txt` | `05-vertical-slice-roadmap.md`; `08-current-sprint.md` | Vertical-slice and sprint scope | Unavailable; Sprint 1 normalized from repository brief only |
| `developer-insights.txt` | `/mnt/data/developer-insights.txt` | `06-technical-architecture.md` | Engineering guidance | Unavailable; not imported |
| `build-insights.txt` | `/mnt/data/build-insights.txt` | `07-build-and-performance-guidelines.md` | Build/performance guidance | Unavailable; not imported |
| `isometric-grid.html` | `/mnt/data/isometric-grid.html` | `docs/references/isometric-grid-foundation.html` | Preserve prototype reference | Unavailable; not imported |
| `git-repo.txt` | `/mnt/data/git-repo.txt` | `docs/development/repository-origin.md` | Repository provenance | Unavailable; origin verified directly |

Concept images: none could be inspected because `/mnt/data` was absent.

## Repository-authored Sprint 3 data

| Source | Destination/purpose | Treatment |
|---|---|---|
| Sprint 3 implementation brief | `public/data/combat-prototype.json` | Synthesized non-canonical prototype unit, weapon, AI, and status data |
| Sprint 3 implementation brief | `public/data/battle-prototype.json` | Synthesized non-canonical battle placement, objective, and seed data |
| Sprint 3 implementation brief | `public/maps/combat-prototype.json` | Synthesized 8×8 combat-validation map using the version 1 map schema |
