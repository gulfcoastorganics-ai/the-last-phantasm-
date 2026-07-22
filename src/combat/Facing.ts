import type { GridPoint } from '../world/GridCoordinates'; import type { Facing } from './CombatTypes';
export type FacingRelation = 'front' | 'side' | 'rear';
export function facingFromMovement(from: GridPoint, to: GridPoint): Facing { const dx = to.x - from.x; const dy = to.y - from.y; return Math.abs(dx) >= Math.abs(dy) ? dx >= 0 ? 'east' : 'west' : dy >= 0 ? 'south' : 'north'; }
export function facingRelation(attacker: GridPoint, target: GridPoint, targetFacing: Facing): FacingRelation { const incoming = facingFromMovement(target, attacker); if (incoming === targetFacing) return 'front'; if (opposite(incoming) === targetFacing) return 'rear'; return 'side'; }
export function opposite(facing: Facing): Facing { return { north: 'south', east: 'west', south: 'north', west: 'east' }[facing] as Facing; }
