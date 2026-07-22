import type { TerrainDefinition } from './TacticalSchemas';

export class TerrainCatalog {
  private readonly definitions = new Map<string, TerrainDefinition>();
  constructor(definitions: readonly TerrainDefinition[]) {
    for (const definition of definitions) {
      if (this.definitions.has(definition.id)) throw new Error(`Duplicate terrain definition: ${definition.id}`);
      this.definitions.set(definition.id, definition);
    }
  }
  get(id: string): TerrainDefinition { const terrain = this.definitions.get(id); if (!terrain) throw new Error(`Unknown terrain: ${id}`); return terrain; }
  has(id: string): boolean { return this.definitions.has(id); }
  get size(): number { return this.definitions.size; }
}
