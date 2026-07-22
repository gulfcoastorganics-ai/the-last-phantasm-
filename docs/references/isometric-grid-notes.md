# Isometric Grid Reference Notes

The requested `isometric-grid.html` was unavailable during bootstrap, so its implementation could not be inspected or preserved. When supplied, copy it unchanged to `isometric-grid-foundation.html` and evaluate these reusable ideas in isolation:

- `isoToScreen` projection
- flat inverse projection
- height-aware tile picking
- depth sorting
- movement-range flood fill

The reference is not the production engine. It must not become the main application architecture unchanged; any production math should become typed, deterministic utilities with focused tests.
