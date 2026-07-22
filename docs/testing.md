# Combat Testing

Unit tests cover validation, unit mutation, occupancy, CT ordering/forecast, statuses, turn transitions, LOS, formulas, seeded results, counters, objectives, AI bounds, and snapshots. Integration tests run complete player and enemy turns plus snapshot restoration.

Required gate: `npm run check`, `npm audit --audit-level=high`, and `git diff --check`. Browser visual claims require screenshot-backed automation.
