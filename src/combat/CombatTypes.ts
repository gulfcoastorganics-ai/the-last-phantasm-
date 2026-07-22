import type { GridPoint } from '../world/GridCoordinates';

export type UnitId = string & { readonly __unitId: unique symbol };
export type TemplateId = string & { readonly __templateId: unique symbol };
export type WeaponId = string & { readonly __weaponId: unique symbol };
export type TeamId = 'allies' | 'enemies';
export type Facing = 'north' | 'east' | 'south' | 'west';
export type AiProfileId = 'aggressiveMelee' | 'cautiousRanged' | 'defensive';
export type StatusId = 'guard' | 'haste' | 'slow' | 'poison';
export type StackPolicy = 'refresh' | 'stack' | 'ignore';

export interface BaseStats { readonly maxHp: number; readonly maxMp: number; readonly speed: number; readonly move: number; readonly jump: number; readonly physicalAttack: number; readonly physicalDefense: number; readonly magicAttack: number; readonly magicDefense: number; readonly accuracy: number; readonly evasion: number; readonly criticalChance: number; }
export interface UnitTemplate { readonly id: TemplateId; readonly displayName: string; readonly jobId: string; readonly level: number; readonly stats: BaseStats; readonly weaponId: WeaponId; readonly abilities: readonly string[]; readonly aiProfile: AiProfileId; }
export interface WeaponProfile { readonly id: WeaponId; readonly name: string; readonly category: 'sword' | 'bow'; readonly power: number; readonly minRange: number; readonly maxRange: number; readonly maxElevationDelta: number; readonly accuracyModifier: number; readonly criticalModifier: number; readonly permitsCounter: boolean; }
export interface AbilityProfile { readonly id: string; readonly name: string; readonly mpCost: number; readonly range: number; readonly permitsCounter: boolean; }
export interface AiProfile { readonly id: AiProfileId; readonly killWeight: number; readonly damageWeight: number; readonly hitWeight: number; readonly rearWeight: number; readonly sideWeight: number; readonly hazardPenalty: number; readonly maxDestinations: number; readonly maxTargets: number; readonly maxOperations: number; }
export interface StatusDefinition { readonly id: StatusId; readonly stackPolicy: StackPolicy; readonly speedMultiplier: number; readonly damageMultiplier: number; readonly poisonDamage: number; }
export interface StatusState { readonly id: StatusId; duration: number; stacks: number; readonly sourceUnitId?: UnitId; }
export interface UnitPlacement { readonly id: UnitId; readonly templateId: TemplateId; readonly team: TeamId; readonly position: GridPoint; readonly facing: Facing; readonly controllable: boolean; readonly spawnOrder: number; }
export interface UnitBattleState { readonly id: UnitId; readonly templateId: TemplateId; readonly displayName: string; readonly team: TeamId; readonly jobId: string; readonly level: number; position: GridPoint; facing: Facing; currentHp: number; readonly maxHp: number; currentMp: number; readonly maxMp: number; readonly speed: number; chargeTime: number; readonly move: number; readonly jump: number; readonly physicalAttack: number; readonly physicalDefense: number; readonly magicAttack: number; readonly magicDefense: number; readonly accuracy: number; readonly evasion: number; readonly criticalChance: number; readonly weaponId: WeaponId; readonly abilities: readonly string[]; statuses: StatusState[]; alive: boolean; readonly controllable: boolean; readonly aiProfile: AiProfileId; readonly spawnOrder: number; }
export interface CombatData { readonly version: number; readonly templates: readonly UnitTemplate[]; readonly weapons: readonly WeaponProfile[]; readonly abilities: readonly AbilityProfile[]; readonly aiProfiles: readonly AiProfile[]; readonly statuses: readonly StatusDefinition[]; }
export interface BattleDefinition { readonly version: number; readonly id: string; readonly mapId: string; readonly units: readonly UnitPlacement[]; readonly objectives: readonly BattleObjectiveDefinition[]; readonly seed: number; }
export interface BattleObjectiveDefinition { readonly id: string; readonly type: 'defeatAllEnemies' | 'keepAllyAlive'; readonly description: string; }
export interface BattleObjectiveState extends BattleObjectiveDefinition { status: 'active' | 'completed' | 'failed'; progress: number; }
export function unitId(value: string): UnitId { if (!value) throw new Error('Unit id cannot be empty.'); return value as UnitId; }
export function templateId(value: string): TemplateId { if (!value) throw new Error('Template id cannot be empty.'); return value as TemplateId; }
export function weaponId(value: string): WeaponId { if (!value) throw new Error('Weapon id cannot be empty.'); return value as WeaponId; }
