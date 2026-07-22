export const MAP_SCHEMA_VERSION = 1;

export type TerrainType = 'ground' | 'road' | 'forest' | 'water' | 'stone' | 'void';
export type CoverValue = 'none' | 'half' | 'full';
export type HazardFlag = 'fire' | 'poison' | 'ice' | 'water' | 'unstable';

export interface TerrainDefinition {
  readonly id: string;
  readonly name: string;
  readonly type: TerrainType;
  readonly movementCost: number;
  readonly walkable: boolean;
  readonly cover: CoverValue;
  readonly opacity: number;
  readonly destructible: boolean;
  readonly hazards: readonly HazardFlag[];
  readonly color: string;
}

export interface TileData {
  readonly x: number;
  readonly y: number;
  readonly terrain: string;
  readonly elevation?: number;
  readonly movementCost?: number;
  readonly walkable?: boolean;
  readonly cover?: CoverValue;
  readonly opacity?: number;
  readonly destructible?: boolean;
  readonly hazards?: readonly HazardFlag[];
}

export interface SpawnPointData { readonly id: string; readonly team: string; readonly x: number; readonly y: number; }
export interface ObjectiveData { readonly id: string; readonly type: 'reach' | 'defend' | 'defeat' | 'interact'; readonly x?: number; readonly y?: number; readonly required: boolean; }
export interface DecorationData { readonly id: string; readonly kind: string; readonly x: number; readonly y: number; readonly elevationOffset?: number; }
export interface TriggerData { readonly id: string; readonly event: string; readonly x?: number; readonly y?: number; readonly radius?: number; }
export interface EncounterData { readonly id: string; readonly spawnPointIds: readonly string[]; readonly activationTriggerId?: string; }
export interface WeatherData { readonly type: 'clear' | 'rain' | 'fog' | 'snow'; readonly intensity: number; }
export interface LightingData { readonly ambient: string; readonly intensity: number; readonly direction: number; }

export interface TacticalMapData {
  readonly version: number;
  readonly id: string;
  readonly name: string;
  readonly width: number;
  readonly height: number;
  readonly tileWidth: number;
  readonly tileHeight: number;
  readonly elevationStep: number;
  readonly terrain: readonly TerrainDefinition[];
  readonly tiles: readonly TileData[];
  readonly spawnPoints: readonly SpawnPointData[];
  readonly objectives: readonly ObjectiveData[];
  readonly decorations: readonly DecorationData[];
  readonly triggers: readonly TriggerData[];
  readonly encounters: readonly EncounterData[];
  readonly weather: WeatherData;
  readonly lighting: LightingData;
  readonly metadata: Readonly<Record<string, string>>;
}

export interface ResolvedTile {
  readonly x: number;
  readonly y: number;
  readonly elevation: number;
  readonly terrain: TerrainDefinition;
  readonly movementCost: number;
  readonly walkable: boolean;
  readonly cover: CoverValue;
  readonly opacity: number;
  readonly destructible: boolean;
  readonly hazards: readonly HazardFlag[];
}
