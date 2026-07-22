# AI Agent Workflow

This file governs all work in **The Last Phantasm** repository.

## Required workflow

1. Read this file.
2. Read `project-bible/README.md`.
3. Read `project-bible/08-current-sprint.md`.
4. Read every project-bible document relevant to the requested task.
5. Inspect the repository and `git status` before editing.
6. Produce a short implementation plan.
7. Implement only the active sprint or explicitly requested scope.
8. Preserve existing working behavior.
9. Run tests, type checks, builds, and relevant audits.
10. Update documentation when architecture or behavior changes.
11. Review the final diff.
12. Commit intentionally with a conventional commit message.
13. Push only when credentials and network access are available and pushing is explicitly in scope.

## Project identity

- This is original intellectual property: a cinematic, story-driven tactical RPG.
- Missions are handcrafted; choices and character relationships are meaningful.
- The tone is political dark fantasy.
- Progression must not require grinding.
- Battlefield readability always wins over visual clutter.

## Technical stack

- TypeScript, strict mode; modular ES modules; HTML5 Canvas; Vite; Vitest or an equally lightweight runner.
- No heavy framework without a recorded architecture decision. Avoid unnecessary runtime dependencies.
- Normal gameplay requires no server. Production output must be GitHub Pages-compatible.
- Prefer an offline-capable architecture where practical, but do not add a service worker before caching is deliberately designed and tested.

## Hardware and performance

Optimize for Chromebook-class hardware and limited RAM. Prefer Canvas 2D unless evidence establishes that WebGL is necessary. Target 60 FPS with graceful degradation. Maintain responsive keyboard, mouse, and touch input.

Avoid unnecessary IndexedDB, heavy background processing, uncontrolled particles, excessive animation, memory leaks, per-frame allocations in hot paths, and large libraries for small utilities. Cap device pixel ratio and measure before optimizing.

## Coding standards

- Use strict TypeScript and explicit types at system boundaries.
- Build small, focused, data-driven modules. Separate rendering from state and physical input from actions.
- Do not use global mutable game state, circular dependencies, import-time side effects, dead code, unexplained magic numbers, or silent error swallowing.
- Use defensive error handling, accessible DOM UI, and deterministic logic where practical.
- Do not present placeholders as complete. Finished sprint deliverables contain no TODO comments.

## Testing requirements

At minimum, cover engine lifecycle, scene transitions, event bus behavior, time-step behavior, input mapping, isometric conversion when production code exists, save validation/serialization, configuration, and practical error boundaries.

Every completed sprint must pass:

```bash
npm test
npm run typecheck
npm run build
```

Add targeted validation scripts when useful.

## Git rules

- Inspect `git status` before and after work. Do not modify unrelated files.
- Do not commit generated output unless repository policy explicitly requires it.
- Use conventional commits and run `git diff --check`.
- Never rewrite published history, force-push, expose secrets, or claim a push succeeded unless it did.

## Documentation rules

- `project-bible/` is the product and design source of truth; `docs/` holds implementation and operational references.
- Record architectural decisions and unresolved design questions instead of inventing answers.
- Update `project-bible/08-current-sprint.md` as work progresses.
- Keep imported source documents version-controlled and update `source-manifest.md` when they move or change form.
