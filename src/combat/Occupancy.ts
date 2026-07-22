import type { GridPoint } from '../world/GridCoordinates'; import { gridKey } from '../world/GridCoordinates'; import type { UnitBattleState, UnitId } from './CombatTypes';
export interface Footprint { readonly offsets: readonly GridPoint[]; }
export const SINGLE_TILE_FOOTPRINT: Footprint = Object.freeze({ offsets: Object.freeze([{ x: 0, y: 0 }]) });
export class Occupancy {
  private readonly occupied = new Map<string, UnitId>(); private readonly reserved = new Map<string, UnitId>();
  rebuild(units: readonly UnitBattleState[], footprint: Footprint = SINGLE_TILE_FOOTPRINT): void { this.occupied.clear(); for (const unit of units) if (unit.alive) this.place(unit.id, unit.position, footprint); }
  place(id: UnitId, origin: GridPoint, footprint: Footprint = SINGLE_TILE_FOOTPRINT): void { for (const offset of footprint.offsets) { const key = gridKey({ x: origin.x + offset.x, y: origin.y + offset.y }); if (this.occupied.has(key)) throw new Error(`Occupied spawn tile: ${key}`); this.occupied.set(key, id); } }
  reserve(id: UnitId, destination: GridPoint): void { const key = gridKey(destination); if (this.isBlocked(destination, id)) throw new Error(`Cannot reserve occupied tile: ${key}`); this.reserved.set(key, id); }
  commitMove(id: UnitId, from: GridPoint, to: GridPoint): void { const destination = gridKey(to); if (this.reserved.get(destination) !== id && this.isBlocked(to, id)) throw new Error('Destination became occupied.'); this.occupied.delete(gridKey(from)); this.reserved.delete(destination); this.occupied.set(destination, id); }
  releaseReservations(id: UnitId): void { for (const [key, owner] of this.reserved) if (owner === id) this.reserved.delete(key); }
  remove(id: UnitId): void { for (const [key, owner] of this.occupied) if (owner === id) this.occupied.delete(key); this.releaseReservations(id); }
  unitAt(point: GridPoint): UnitId | undefined { return this.occupied.get(gridKey(point)); }
  isBlocked(point: GridPoint, except?: UnitId): boolean { const owner = this.occupied.get(gridKey(point)) ?? this.reserved.get(gridKey(point)); return owner !== undefined && owner !== except; }
  blockedKeys(except?: UnitId): ReadonlySet<string> { const result = new Set<string>(); for (const [key, owner] of [...this.occupied, ...this.reserved]) if (owner !== except) result.add(key); return result; }
  snapshot(): Readonly<Record<string, UnitId>> { return Object.fromEntries(this.occupied); }
}
