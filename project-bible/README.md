# Project Bible

The project bible is the version-controlled source of truth for product intent, narrative, design, roadmap, technical constraints, and active scope.

## Authority and reading order

Read in this order:

1. `01-vision-and-pillars.md`
2. `02-game-design-document.md`
3. `08-current-sprint.md`
4. Documents relevant to the task

The main GDD governs product vision and roadmap. The current sprint governs immediate implementation scope. If sources conflict, preserve both positions, identify the conflict in `09-decisions-and-open-questions.md`, and do not silently decide unless the GDD clearly establishes authority.

## Maintenance

Future agents must update the current sprint as work progresses and update architecture, behavior, or narrative documents whenever those truths change. Imported source documents must remain version-controlled, and every import or transformation must be recorded in `source-manifest.md`.
