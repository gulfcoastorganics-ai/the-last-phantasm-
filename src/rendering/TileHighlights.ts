import type { GridPoint } from '../world/GridCoordinates'; import { gridKey } from '../world/GridCoordinates';
export type HighlightKind = 'hover' | 'selection' | 'movement' | 'attack' | 'ability' | 'danger' | 'objective' | 'spawn' | 'invalid';
const priority: Readonly<Record<HighlightKind, number>> = { movement: 1, spawn: 2, objective: 3, danger: 4, attack: 5, ability: 6, hover: 7, selection: 8, invalid: 9 };
export interface TileHighlight { readonly point: GridPoint; readonly kind: HighlightKind; readonly intensity?: number; readonly label?: string; }
export class TileHighlights {
  private readonly layers = new Map<string, TileHighlight[]>();
  set(layer: string, highlights: readonly TileHighlight[]): void { this.layers.set(layer, [...highlights]); }
  clear(layer?: string): void { if (layer) this.layers.delete(layer); else this.layers.clear(); }
  ordered(): readonly TileHighlight[] { const merged = new Map<string, TileHighlight>(); for (const highlights of this.layers.values()) for (const highlight of highlights) { const key = gridKey(highlight.point); const current = merged.get(key); if (!current || priority[highlight.kind] >= priority[current.kind]) merged.set(key, highlight); } return [...merged.values()].sort((a, b) => priority[a.kind] - priority[b.kind]); }
}
