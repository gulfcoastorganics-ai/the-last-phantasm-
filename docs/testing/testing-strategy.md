# Testing Strategy

Fast unit tests cover deterministic boundaries: events, time clamping, scene lifecycle/disposal, input action transitions, camera transforms/limits, save validation and recovery, and configuration merging.

The required gate is:

```bash
npm run typecheck
npm test
npm run build
git diff --check
```

Browser playtesting should additionally verify responsive layout, keyboard focus, pointer capture, touch dragging, wheel zoom, settings modal input isolation, hidden-tab recovery, debug overhead, and fatal-error presentation. Do not infer visual correctness from unit tests.
