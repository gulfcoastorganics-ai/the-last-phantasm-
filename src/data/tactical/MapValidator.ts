import { MAP_SCHEMA_VERSION, type CoverValue, type DecorationData, type EncounterData, type HazardFlag, type LightingData, type ObjectiveData, type SpawnPointData, type TacticalMapData, type TerrainType, type TriggerData, type WeatherData } from './TacticalSchemas';

export interface ValidationIssue { readonly path: string; readonly message: string; }
export type ValidationResult = { readonly ok: true; readonly value: TacticalMapData; readonly warnings: readonly ValidationIssue[] } | { readonly ok: false; readonly issues: readonly ValidationIssue[] };

const terrainTypes = new Set<TerrainType>(['ground', 'road', 'forest', 'water', 'stone', 'void']);
const covers = new Set<CoverValue>(['none', 'half', 'full']);
const hazards = new Set<HazardFlag>(['fire', 'poison', 'ice', 'water', 'unstable']);

export function validateMap(input: unknown): ValidationResult {
  const issues: ValidationIssue[] = [];
  if (!isRecord(input)) return { ok: false, issues: [{ path: '$', message: 'Map must be an object.' }] };
  if (input.version !== MAP_SCHEMA_VERSION) issues.push({ path: 'version', message: `Unsupported map version; expected ${MAP_SCHEMA_VERSION}.` });
  const id = stringAt(input, 'id', issues); const name = stringAt(input, 'name', issues);
  const width = positiveIntegerAt(input, 'width', issues); const height = positiveIntegerAt(input, 'height', issues);
  const tileWidth = positiveNumberAt(input, 'tileWidth', issues); const tileHeight = positiveNumberAt(input, 'tileHeight', issues);
  const elevationStep = positiveNumberAt(input, 'elevationStep', issues);
  const terrainInput = arrayAt(input, 'terrain', issues); const tilesInput = arrayAt(input, 'tiles', issues);
  const terrain = terrainInput.flatMap((value, index) => {
    if (!isRecord(value)) { issues.push({ path: `terrain[${index}]`, message: 'Terrain must be an object.' }); return []; }
    const terrainId = stringAt(value, 'id', issues, `terrain[${index}]`); const terrainName = stringAt(value, 'name', issues, `terrain[${index}]`);
    const type = value.type; const movementCost = value.movementCost; const cover = value.cover; const opacity = value.opacity;
    if (!terrainTypes.has(type as TerrainType)) issues.push({ path: `terrain[${index}].type`, message: 'Unknown terrain type.' });
    if (!isPositiveNumber(movementCost)) issues.push({ path: `terrain[${index}].movementCost`, message: 'Movement cost must be positive.' });
    if (!covers.has(cover as CoverValue)) issues.push({ path: `terrain[${index}].cover`, message: 'Unknown cover value.' });
    if (!isFiniteNumber(opacity) || opacity < 0 || opacity > 1) issues.push({ path: `terrain[${index}].opacity`, message: 'Opacity must be between 0 and 1.' });
    if (typeof value.walkable !== 'boolean' || typeof value.destructible !== 'boolean' || !isString(value.color) || !isHazards(value.hazards)) issues.push({ path: `terrain[${index}]`, message: 'Terrain flags, color, or hazards are invalid.' });
    if (!terrainId || !terrainName || !terrainTypes.has(type as TerrainType) || !isPositiveNumber(movementCost) || !covers.has(cover as CoverValue) || !isFiniteNumber(opacity) || typeof value.walkable !== 'boolean' || typeof value.destructible !== 'boolean' || !isString(value.color) || !isHazards(value.hazards)) return [];
    return [{ id: terrainId, name: terrainName, type: type as TerrainType, movementCost, walkable: value.walkable, cover: cover as CoverValue, opacity, destructible: value.destructible, hazards: value.hazards, color: value.color }];
  });
  const terrainIds = new Set(terrain.map((item) => item.id));
  if (terrainIds.size !== terrain.length) issues.push({ path: 'terrain', message: 'Terrain ids must be unique.' });
  const tiles = tilesInput.flatMap((value, index) => {
    if (!isRecord(value)) { issues.push({ path: `tiles[${index}]`, message: 'Tile must be an object.' }); return []; }
    const x = value.x; const y = value.y; const terrainId = value.terrain;
    if (!Number.isInteger(x) || !Number.isInteger(y) || (x as number) < 0 || (y as number) < 0 || (x as number) >= width || (y as number) >= height) issues.push({ path: `tiles[${index}]`, message: 'Tile coordinate is out of bounds.' });
    if (!isString(terrainId) || !terrainIds.has(terrainId)) issues.push({ path: `tiles[${index}].terrain`, message: 'Tile references unknown terrain.' });
    const elevation = value.elevation ?? 0;
    if (!Number.isInteger(elevation) || (elevation as number) < 0) issues.push({ path: `tiles[${index}].elevation`, message: 'Elevation must be a non-negative integer.' });
    const movementCost = value.movementCost; const walkable = value.walkable; const cover = value.cover; const opacity = value.opacity; const destructible = value.destructible; const tileHazards = value.hazards;
    const overridesValid = (movementCost === undefined || isPositiveNumber(movementCost)) && (walkable === undefined || typeof walkable === 'boolean') && (cover === undefined || covers.has(cover as CoverValue)) && (opacity === undefined || (isFiniteNumber(opacity) && opacity >= 0 && opacity <= 1)) && (destructible === undefined || typeof destructible === 'boolean') && (tileHazards === undefined || isHazards(tileHazards));
    if (!overridesValid) issues.push({ path: `tiles[${index}]`, message: 'Tile overrides are invalid.' });
    if (!Number.isInteger(x) || !Number.isInteger(y) || !isString(terrainId) || !terrainIds.has(terrainId) || !Number.isInteger(elevation) || !overridesValid) return [];
    return [{ x: x as number, y: y as number, terrain: terrainId, elevation: elevation as number, movementCost: movementCost as number | undefined, walkable: walkable as boolean | undefined, cover: cover as CoverValue | undefined, opacity: opacity as number | undefined, destructible: destructible as boolean | undefined, hazards: tileHazards as HazardFlag[] | undefined }];
  });
  const keys = new Set(tiles.map((tile) => `${tile.x},${tile.y}`));
  if (keys.size !== tiles.length) issues.push({ path: 'tiles', message: 'Tile coordinates must be unique.' });
  if (tiles.length !== width * height) issues.push({ path: 'tiles', message: 'Map must define exactly one tile per coordinate.' });
  if (issues.length) return { ok: false, issues };
  const spawnPoints = validatedArray(input.spawnPoints, 'spawnPoints', isSpawnPoint, issues);
  const objectives = validatedArray(input.objectives, 'objectives', isObjective, issues);
  const decorations = validatedArray(input.decorations, 'decorations', isDecoration, issues);
  const triggers = validatedArray(input.triggers, 'triggers', isTrigger, issues);
  const encounters = validatedArray(input.encounters, 'encounters', isEncounter, issues);
  for (const spawn of spawnPoints) if (spawn.x >= width || spawn.y >= height) issues.push({ path: `spawnPoints.${spawn.id}`, message: 'Spawn point is out of bounds.' });
  for (const objective of objectives) if ((objective.x !== undefined && objective.x >= width) || (objective.y !== undefined && objective.y >= height)) issues.push({ path: `objectives.${objective.id}`, message: 'Objective is out of bounds.' });
  const spawnIds = new Set(spawnPoints.map((spawn) => spawn.id)); const triggerIds = new Set(triggers.map((trigger) => trigger.id));
  for (const encounter of encounters) { for (const spawnId of encounter.spawnPointIds) if (!spawnIds.has(spawnId)) issues.push({ path: `encounters.${encounter.id}`, message: `Unknown spawn point: ${spawnId}.` }); if (encounter.activationTriggerId && !triggerIds.has(encounter.activationTriggerId)) issues.push({ path: `encounters.${encounter.id}`, message: `Unknown trigger: ${encounter.activationTriggerId}.` }); }
  const weather = isWeather(input.weather) ? input.weather : { type: 'clear' as const, intensity: 0 };
  const lighting = isLighting(input.lighting) ? input.lighting : { ambient: '#ffffff', intensity: 1, direction: 0 };
  const metadata = isRecord(input.metadata) && Object.values(input.metadata).every((item) => typeof item === 'string') ? input.metadata as Record<string, string> : {};
  if (input.weather !== undefined && !isWeather(input.weather)) issues.push({ path: 'weather', message: 'Weather definition is invalid.' });
  if (input.lighting !== undefined && !isLighting(input.lighting)) issues.push({ path: 'lighting', message: 'Lighting definition is invalid.' });
  if (input.metadata !== undefined && (!isRecord(input.metadata) || !Object.values(input.metadata).every((item) => typeof item === 'string'))) issues.push({ path: 'metadata', message: 'Metadata values must be strings.' });
  if (issues.length) return { ok: false, issues };
  const value: TacticalMapData = { version: MAP_SCHEMA_VERSION, id, name, width, height, tileWidth, tileHeight, elevationStep, terrain, tiles, spawnPoints, objectives, decorations, triggers, encounters, weather, lighting, metadata };
  return { ok: true, value, warnings: [] };
}

function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === 'object' && value !== null && !Array.isArray(value); }
function isString(value: unknown): value is string { return typeof value === 'string' && value.length > 0; }
function isFiniteNumber(value: unknown): value is number { return typeof value === 'number' && Number.isFinite(value); }
function isPositiveNumber(value: unknown): value is number { return isFiniteNumber(value) && value > 0; }
function stringAt(record: Record<string, unknown>, key: string, issues: ValidationIssue[], base = ''): string { const value = record[key]; if (!isString(value)) { issues.push({ path: `${base ? `${base}.` : ''}${key}`, message: 'Expected a non-empty string.' }); return ''; } return value; }
function positiveIntegerAt(record: Record<string, unknown>, key: string, issues: ValidationIssue[]): number { const value = record[key]; if (!Number.isInteger(value) || (value as number) <= 0) { issues.push({ path: key, message: 'Expected a positive integer.' }); return 1; } return value as number; }
function positiveNumberAt(record: Record<string, unknown>, key: string, issues: ValidationIssue[]): number { const value = record[key]; if (!isPositiveNumber(value)) { issues.push({ path: key, message: 'Expected a positive number.' }); return 1; } return value; }
function arrayAt(record: Record<string, unknown>, key: string, issues: ValidationIssue[]): readonly unknown[] { const value = record[key]; if (!Array.isArray(value)) { issues.push({ path: key, message: 'Expected an array.' }); return []; } return value; }
function isHazards(value: unknown): value is HazardFlag[] { return Array.isArray(value) && value.every((flag) => hazards.has(flag as HazardFlag)); }
function validatedArray<T>(value: unknown, path: string, guard: (item: unknown) => item is T, issues: ValidationIssue[]): readonly T[] { if (value === undefined) return []; if (!Array.isArray(value)) { issues.push({ path, message: 'Expected an array.' }); return []; } const result: T[] = []; value.forEach((item, index) => { if (guard(item)) result.push(item); else issues.push({ path: `${path}[${index}]`, message: 'Entry is invalid.' }); }); return result; }
function isCoordinate(value: unknown): value is number { return Number.isInteger(value) && (value as number) >= 0; }
function isSpawnPoint(value: unknown): value is SpawnPointData { return isRecord(value) && isString(value.id) && isString(value.team) && isCoordinate(value.x) && isCoordinate(value.y); }
function isObjective(value: unknown): value is ObjectiveData { return isRecord(value) && isString(value.id) && ['reach', 'defend', 'defeat', 'interact'].includes(value.type as string) && typeof value.required === 'boolean' && (value.x === undefined || isCoordinate(value.x)) && (value.y === undefined || isCoordinate(value.y)); }
function isDecoration(value: unknown): value is DecorationData { return isRecord(value) && isString(value.id) && isString(value.kind) && isCoordinate(value.x) && isCoordinate(value.y) && (value.elevationOffset === undefined || isFiniteNumber(value.elevationOffset)); }
function isTrigger(value: unknown): value is TriggerData { return isRecord(value) && isString(value.id) && isString(value.event) && (value.x === undefined || isCoordinate(value.x)) && (value.y === undefined || isCoordinate(value.y)) && (value.radius === undefined || (isFiniteNumber(value.radius) && value.radius >= 0)); }
function isEncounter(value: unknown): value is EncounterData { return isRecord(value) && isString(value.id) && Array.isArray(value.spawnPointIds) && value.spawnPointIds.every(isString) && (value.activationTriggerId === undefined || isString(value.activationTriggerId)); }
function isWeather(value: unknown): value is WeatherData { return isRecord(value) && ['clear', 'rain', 'fog', 'snow'].includes(value.type as string) && isFiniteNumber(value.intensity) && value.intensity >= 0 && value.intensity <= 1; }
function isLighting(value: unknown): value is LightingData { return isRecord(value) && isString(value.ambient) && isFiniteNumber(value.intensity) && value.intensity >= 0 && isFiniteNumber(value.direction); }
