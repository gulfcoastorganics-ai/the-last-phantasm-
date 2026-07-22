import type { Camera, Point } from '../rendering/Camera';
import type { TacticalMap } from '../data/tactical/TacticalMap';
import type { GridPoint, GridPoint3 } from './GridCoordinates';

export interface IsometricGridOptions { readonly tileWidth: number; readonly tileHeight: number; readonly elevationStep: number; readonly originX?: number; readonly originY?: number; }

export class IsometricGrid {
  readonly halfWidth: number; readonly halfHeight: number; readonly originX: number; readonly originY: number;
  constructor(readonly options: IsometricGridOptions) { if (options.tileWidth <= 0 || options.tileHeight <= 0 || options.elevationStep <= 0) throw new Error('Isometric dimensions must be positive.'); this.halfWidth = options.tileWidth / 2; this.halfHeight = options.tileHeight / 2; this.originX = options.originX ?? 0; this.originY = options.originY ?? 0; }
  gridToWorld(point: GridPoint3): Point { return { x: this.originX + (point.x - point.y) * this.halfWidth, y: this.originY + (point.x + point.y) * this.halfHeight - point.elevation * this.options.elevationStep }; }
  worldToGridFlat(point: Point): { readonly x: number; readonly y: number } { const px = point.x - this.originX; const py = point.y - this.originY; return { x: (px / this.halfWidth + py / this.halfHeight) / 2, y: (py / this.halfHeight - px / this.halfWidth) / 2 }; }
  tileOrigin(point: GridPoint3): Point { const center = this.gridToWorld(point); return { x: center.x - this.halfWidth, y: center.y - this.halfHeight }; }
  tilePolygon(point: GridPoint3): readonly Point[] { const center = this.gridToWorld(point); return [{ x: center.x, y: center.y - this.halfHeight }, { x: center.x + this.halfWidth, y: center.y }, { x: center.x, y: center.y + this.halfHeight }, { x: center.x - this.halfWidth, y: center.y }]; }
  screenToGrid(screen: Point, viewport: Point, camera: Camera, map: TacticalMap): GridPoint | undefined { return this.pickTile(camera.screenToWorld(screen, viewport), map); }
  gridToScreen(point: GridPoint3, viewport: Point, camera: Camera): Point { return camera.worldToScreen(this.gridToWorld(point), viewport); }
  pickTile(world: Point, map: TacticalMap): GridPoint | undefined {
    let selected: GridPoint | undefined; let bestDepth = Number.NEGATIVE_INFINITY;
    map.forEach((tile) => { const polygon = this.tilePolygon(tile); if (pointInDiamond(world, polygon)) { const depth = tile.x + tile.y + tile.elevation * .001; if (depth >= bestDepth) { bestDepth = depth; selected = { x: tile.x, y: tile.y }; } } });
    return selected;
  }
}
function pointInDiamond(point: Point, polygon: readonly Point[]): boolean { let inside = false; for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) { const a = polygon[i]; const b = polygon[j]; if (!a || !b) continue; const crosses = (a.y > point.y) !== (b.y > point.y) && point.x < ((b.x - a.x) * (point.y - a.y)) / (b.y - a.y) + a.x; if (crosses) inside = !inside; } return inside; }
