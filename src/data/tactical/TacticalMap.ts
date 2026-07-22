import type { ResolvedTile, TacticalMapData } from './TacticalSchemas';
import { TerrainCatalog } from './TerrainCatalog';

export class TacticalMap {
  readonly terrain: TerrainCatalog;
  private readonly tiles: Array<ResolvedTile | undefined>;
  constructor(readonly data: TacticalMapData) {
    this.terrain = new TerrainCatalog(data.terrain);
    this.tiles = new Array<ResolvedTile | undefined>(data.width * data.height);
    for (const tile of data.tiles) {
      const base = this.terrain.get(tile.terrain);
      this.tiles[this.index(tile.x, tile.y)] = {
        x: tile.x, y: tile.y, elevation: tile.elevation ?? 0, terrain: base,
        movementCost: tile.movementCost ?? base.movementCost,
        walkable: tile.walkable ?? base.walkable,
        cover: tile.cover ?? base.cover,
        opacity: tile.opacity ?? base.opacity,
        destructible: tile.destructible ?? base.destructible,
        hazards: tile.hazards ?? base.hazards,
      };
    }
  }
  inBounds(x: number, y: number): boolean { return Number.isInteger(x) && Number.isInteger(y) && x >= 0 && y >= 0 && x < this.data.width && y < this.data.height; }
  get(x: number, y: number): ResolvedTile | undefined { return this.inBounds(x, y) ? this.tiles[y * this.data.width + x] : undefined; }
  require(x: number, y: number): ResolvedTile { const tile = this.get(x, y); if (!tile) throw new Error(`Missing tile at ${x},${y}`); return tile; }
  forEach(callback: (tile: ResolvedTile) => void): void { for (const tile of this.tiles) if (tile) callback(tile); }
  private index(x: number, y: number): number { if (!this.inBounds(x, y)) throw new Error(`Tile out of bounds: ${x},${y}`); return y * this.data.width + x; }
}
