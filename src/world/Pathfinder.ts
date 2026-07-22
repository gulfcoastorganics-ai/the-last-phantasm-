import type { TacticalMap } from '../data/tactical/TacticalMap';
import { BinaryHeap } from './BinaryHeap';
import type { GridPoint } from './GridCoordinates';
import { gridKey, parseGridKey } from './GridCoordinates';
import { gridNeighbors } from './GridNeighbors';
import { traversalCost } from './TraversalCost';

export interface PathOptions { readonly occupied?: ReadonlySet<string>; readonly allowDiagonal?: boolean; readonly elevationPenalty?: number; readonly maxElevationDelta?: number; }
export interface PathResult { readonly found: boolean; readonly path: readonly GridPoint[]; readonly cost: number; readonly visited: number; }
interface Node { readonly point: GridPoint; readonly priority: number; }

export class Pathfinder {
  private readonly cache = new Map<string, PathResult>();
  constructor(private readonly maxCacheEntries = 64) {}
  find(map: TacticalMap, start: GridPoint, goal: GridPoint, options: PathOptions = {}): PathResult {
    const occupied = options.occupied ?? new Set<string>(); const diagonal = options.allowDiagonal ?? false; const elevationPenalty = options.elevationPenalty ?? 1; const maxElevationDelta = options.maxElevationDelta ?? 1;
    const cacheKey = `${map.data.id}:${gridKey(start)}>${gridKey(goal)}:${diagonal}:${elevationPenalty}:${maxElevationDelta}:${[...occupied].sort().join(';')}`;
    const cached = this.cache.get(cacheKey); if (cached) return cached;
    const startTile = map.get(start.x, start.y); const goalTile = map.get(goal.x, goal.y);
    if (!startTile?.walkable || !goalTile?.walkable || occupied.has(gridKey(goal))) return this.remember(cacheKey, { found: false, path: [], cost: Number.POSITIVE_INFINITY, visited: 0 });
    const frontier = new BinaryHeap<Node>((node) => node.priority); frontier.push({ point: start, priority: 0 });
    const cameFrom = new Map<string, string>(); const costs = new Map<string, number>([[gridKey(start), 0]]); let visited = 0;
    while (frontier.size) {
      const current = frontier.pop(); if (!current) break; visited += 1;
      if (current.point.x === goal.x && current.point.y === goal.y) return this.remember(cacheKey, { found: true, path: reconstruct(cameFrom, start, goal), cost: costs.get(gridKey(goal)) ?? 0, visited });
      const fromTile = map.require(current.point.x, current.point.y);
      for (const next of gridNeighbors(map, current.point, diagonal)) {
        const key = gridKey(next); const tile = map.require(next.x, next.y);
        if (!tile.walkable || occupied.has(key) || Math.abs(tile.elevation - fromTile.elevation) > maxElevationDelta) continue;
        const nextCost = (costs.get(gridKey(current.point)) ?? 0) + traversalCost(fromTile, tile, elevationPenalty) * (next.x !== current.point.x && next.y !== current.point.y ? Math.SQRT2 : 1);
        if (nextCost >= (costs.get(key) ?? Number.POSITIVE_INFINITY)) continue;
        costs.set(key, nextCost); cameFrom.set(key, gridKey(current.point)); frontier.push({ point: next, priority: nextCost + heuristic(next, goal, diagonal) });
      }
    }
    return this.remember(cacheKey, { found: false, path: [], cost: Number.POSITIVE_INFINITY, visited });
  }
  clearCache(): void { this.cache.clear(); }
  private remember(key: string, result: PathResult): PathResult { if (this.cache.size >= this.maxCacheEntries) { const oldest = this.cache.keys().next().value as string | undefined; if (oldest) this.cache.delete(oldest); } this.cache.set(key, result); return result; }
}
function heuristic(a: GridPoint, b: GridPoint, diagonal: boolean): number { const dx = Math.abs(a.x - b.x); const dy = Math.abs(a.y - b.y); return diagonal ? Math.max(dx, dy) : dx + dy; }
function reconstruct(cameFrom: ReadonlyMap<string, string>, start: GridPoint, goal: GridPoint): GridPoint[] { const result = [goal]; let key = gridKey(goal); const startKey = gridKey(start); while (key !== startKey) { const previous = cameFrom.get(key); if (!previous) return []; result.push(parseGridKey(previous)); key = previous; } return result.reverse(); }
