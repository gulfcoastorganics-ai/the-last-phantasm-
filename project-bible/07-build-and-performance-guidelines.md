# Build and Performance Guidelines

- Target Chromebook-class systems, 60 FPS where possible, and graceful degradation.
- Cap frame delta and device pixel ratio; pause simulation while hidden.
- Minimize hot-path allocation and debug overhead.
- Prefer Canvas 2D, native browser APIs, and no runtime dependencies.
- Use localStorage for the initial versioned save foundation. Do not add IndexedDB or a service worker without a tested decision.
- Production output must remain compatible with GitHub Pages.

The requested `developer-insights.txt` and `build-insights.txt` imports remain blocked because `/mnt/data` was unavailable on 2026-07-21.
