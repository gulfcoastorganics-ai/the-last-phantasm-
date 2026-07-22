# Combat Specification

## Charge Time

The ready threshold is 100. Initiative advances in deterministic integer steps, adding `Speed × status multiplier` to every living unit until at least one is ready. Initiative pauses during an active turn. Completing a turn subtracts 100 CT and preserves overflow, allowing faster units to act more often.

Ties resolve by highest overflow CT, highest base Speed, lowest stable spawn order, then lexical unit id. Forecasting simulates the same gain and tie rules without mutating battle state and is bounded to 10,000 steps per requested entry.

Haste multiplies gain by 1.5; Slow multiplies it by 0.5.

## Turns and movement

Each turn tracks `hasMoved` and `hasActed`. A unit may move then attack, attack then face/wait/end, or end without either. Committed movement is not undoable. Cardinal A* and movement range use terrain cost, shared occupancy, and a maximum elevation change equal to Jump. Sprint 3 footprints occupy one tile through a footprint-capable service.

Authoritative position changes when movement commits. Interpolation and camera follow are presentation only; reduced-motion removes interpolation.

## Facing

Facings are north, east, south, and west in grid coordinates. An attacker located in the direction the defender faces is in front; the opposite is rear; perpendicular directions are side. Side attacks gain +10 hit. Rear attacks gain +20 hit and ×1.2 damage. Facing is selectable before turn completion.

## Basic attacks

Distance is cardinal Manhattan distance. A target must be alive, hostile, inside weapon minimum/maximum range and elevation limit, and visible through LOS.

```text
Hit % = clamp(70 + Accuracy - Evasion + weapon accuracy + facing + elevation, 5, 100)
Damage = max(1, floor((Physical Attack + weapon power - 0.7 × Physical Defense)
                     × rear modifier × Guard modifier))
Critical % = clamp(unit critical + weapon critical, 0, 50)
Critical damage = floor(damage × 1.5)
Expected damage = damage × hit probability × expected critical multiplier
```

Each level above the target grants +3 hit; each level below applies −5 hit. Guard multiplies incoming damage by 0.6.

Actual hit and critical rolls use the seeded PRNG only. Preview and resolution share the same formula service. Structured results record the PRNG states before and after.

## LOS and counters

LOS uses deterministic supercover grid traversal. Intermediate tiles block at opacity ≥0.5, excessive elevation blocks, and living occupied cells block by default. A living defender counters only when its weapon can legally target the attacker and the triggering weapon permits counters. Counters pass `allowCounter=false`, preventing chains.

## Status lifecycle

Statuses contain id, duration, stacks, and optional source. Guard, Haste, Slow, and Poison use refresh stacking. Poison deals four deterministic damage at turn end. All statuses decrement at turn end and expire at zero. Status state is serializable.

## Known limitations

No ability execution, reaction queue beyond one counter, line-of-sight cover modifier, large footprints, unit immunities, or mid-battle save UI is implemented.
