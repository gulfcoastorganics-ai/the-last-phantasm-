import type { TacticalMap } from '../data/tactical/TacticalMap';
import type { GridPoint } from './GridCoordinates';

const CARDINAL = Object.freeze([{ x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }]);
const DIAGONAL = Object.freeze([{ x: 1, y: 1 }, { x: 1, y: -1 }, { x: -1, y: 1 }, { x: -1, y: -1 }]);

export function gridNeighbors(map: TacticalMap, point: GridPoint, allowDiagonal: boolean): GridPoint[] {
  const result: GridPoint[] = [];
  for (const delta of CARDINAL) if (map.get(point.x + delta.x, point.y + delta.y)) result.push({ x: point.x + delta.x, y: point.y + delta.y });
  if (allowDiagonal) for (const delta of DIAGONAL) {
    const x = point.x + delta.x; const y = point.y + delta.y;
    if (!map.get(x, y)) continue;
    const adjacentA = map.get(point.x + delta.x, point.y); const adjacentB = map.get(point.x, point.y + delta.y);
    if (adjacentA?.walkable && adjacentB?.walkable) result.push({ x, y });
  }
  return result;
}
