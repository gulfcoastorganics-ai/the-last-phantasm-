export class AssetManager {
  private readonly assets = new Map<string, unknown>();
  set<T>(key: string, asset: T): void { if (this.assets.has(key)) throw new Error(`Duplicate asset key: ${key}`); this.assets.set(key, asset); }
  get<T>(key: string): T { if (!this.assets.has(key)) throw new Error(`Missing asset: ${key}`); return this.assets.get(key) as T; }
  has(key: string): boolean { return this.assets.has(key); }
  clear(): void { this.assets.clear(); }
}
