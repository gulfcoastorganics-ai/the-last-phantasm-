# Enemy AI Specification

Sprint 3 uses deterministic bounded utility scoring and the same movement, occupancy, targeting, LOS, and preview services as the player.

For each reachable destination and target, score:

```text
kill bonus
+ expected damage × damage weight
+ hit chance × hit weight
+ rear/side bonus
− hazardous-destination penalty
```

Profiles provide every weight. `aggressiveMelee` values kills and rear attacks; `cautiousRanged` weighs hit chance and hazards more heavily. Ties use a stable destination/target key. When no attack exists, AI chooses a reachable tile minimizing path cost toward a hostile unit, or stays safely idle.

Prototype limits are 32 destinations, 8 targets, and 256 operations for complete profiles. Diagnostics expose candidate count, chosen score, and operation count.
