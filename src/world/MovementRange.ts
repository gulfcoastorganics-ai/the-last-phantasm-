import type { TacticalMap } from '../data/tactical/TacticalMap';
import { BinaryHeap } from './BinaryHeap';
import type { GridPoint } from './GridCoordinates';
import { gridKey } from './GridCoordinates';
import { gridNeighbors } from './GridNeighbors';
import { traversalCost } from './TraversalCost';

export interface ReachableTile { readonly point: GridPoint; readonly cost: number; readonly remaining: number; }
interface RangeNode { readonly point: GridPoint; readonly cost: number; }
export interface RangeOptions { readonly occupied?: ReadonlySet<string>; readonly allowDiagonal?: boolean; readonly elevationPenalty?: number; readonly maxElevationDelta?: number; }

export function movementRange(map: TacticalMap, start: GridPoint, budget: number, options: RangeOptions = {}): ReadonlyMap<string, ReachableTile> {
  const result = new Map<string, ReachableTile>(); if (budget < 0 || !map.get(start.x, start.y)?.walkable) return result;
  const occupied = options.occupied ?? new Set<string>(); const diagonal = options.allowDiagonal ?? false; const elevationPenalty = options.elevationPenalty ?? 1; const maxElevationDelta = options.maxElevationDelta ?? 1;
  const frontier = new BinaryHeap<RangeNode>((node) => node.cost); frontier.push({ point: start, cost: 0 }); result.set(gridKey(start), { point: start, cost: 0, remaining: budget });
  while (frontier.size) {
    const current = frontier.pop(); if (!current) break; const known = result.get(gridKey(current.point)); if (!known || current.cost > known.cost) continue;
    const from = map.require(current.point.x, current.point.y);
    for (const next of gridNeighbors(map, current.point, diagonal)) {
      const key = gridKey(next); const tile = map.require(next.x, next.y);
      if (!tile.walkable || occupied.has(key) || Math.abs(tile.elevation - from.elevation) > maxElevationDelta) continue;
      const cost = current.cost + traversalCost(from, tile, elevationPenalty) * (next.x !== current.point.x && next.y !== current.point.y ? Math.SQRT2 : 1);
      if (cost > budget || cost >= (result.get(key)?.cost ?? Number.POSITIVE_INFINITY)) continue;
      result.set(key, { point: next, cost, remaining: budget - cost }); frontier.push({ point: next, cost });
    }
  }
  return result;
}
