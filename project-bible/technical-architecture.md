# Combat Technical Architecture

Combat follows a one-way dependency flow:

```text
validated external data
→ immutable templates / definitions
→ serializable unit and battle state
→ occupancy / initiative / turn machine
→ movement, LOS, formulas, resolution, objectives, AI
→ scene orchestration
→ Canvas presentation and accessible DOM HUD
```

Simulation modules do not import Canvas or DOM. `BattleController` is the deterministic facade. Sprint 2 `TacticalMap`, A*, movement range, camera, highlights, and render pipeline remain intact. The scene translates input into validated commands and owns presentation-only movement/camera timing.

Meaningful combat events use the typed event bus. Development diagnostics are disabled in production.
