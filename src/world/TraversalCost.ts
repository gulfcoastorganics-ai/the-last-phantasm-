import type { ResolvedTile } from '../data/tactical/TacticalSchemas';
export function traversalCost(from: ResolvedTile, to: ResolvedTile, elevationPenalty: number): number { return to.movementCost + Math.abs(to.elevation - from.elevation) * elevationPenalty; }
