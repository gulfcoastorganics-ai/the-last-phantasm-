import type { TacticalMap } from '../data/tactical/TacticalMap';
import type { Occupancy } from './Occupancy';
import type { SeededRandom } from './SeededRandom';
import type { StatusSystem } from './StatusSystem';
import type { UnitBattleState, UnitId, WeaponProfile } from './CombatTypes';
import { applyDamage } from './UnitModel';
import { COMBAT_RULES, previewAttack, type AttackPreview } from './CombatFormula';
import { lineOfSight, type LineOfSightResult } from './LineOfSight';

export interface ActionResult { readonly actorId: UnitId; readonly targetId: UnitId; readonly actionId: string; readonly hit: boolean; readonly critical: boolean; readonly damage: number; readonly targetHpBefore: number; readonly targetHpAfter: number; readonly defeated: boolean; readonly counterattack?: ActionResult; readonly events: readonly string[]; readonly randomStateBefore: number; readonly randomStateAfter: number; }

export class CombatResolver {
  lastLineOfSight: LineOfSightResult | undefined;
  constructor(private readonly map: TacticalMap, private readonly weapons: ReadonlyMap<string, WeaponProfile>, private readonly occupancy: Occupancy, private readonly statuses: StatusSystem, private readonly random: SeededRandom) {}
  preview(actor: UnitBattleState, target: UnitBattleState): AttackPreview { const weapon = this.requireWeapon(actor.weaponId); const los = lineOfSight(this.map, actor.position, target.position, this.occupancy.blockedKeys(actor.id)); this.lastLineOfSight = los; return previewAttack(actor, target, weapon, this.map.require(actor.position.x, actor.position.y), this.map.require(target.position.x, target.position.y), los.clear, this.statuses.damageMultiplier(target), this.canCounter(target, actor)); }
  resolve(actor: UnitBattleState, target: UnitBattleState, allowCounter = true): ActionResult {
    const stateBefore = this.random.state; const weapon = this.requireWeapon(actor.weaponId); const preview = this.preview(actor, target); if (!preview.valid) throw new Error(preview.reason ?? 'Invalid attack.');
    const events: string[] = []; const hit = this.random.roll(preview.hitChance / 100); let critical = false; let dealt = 0; const hpBefore = target.currentHp;
    if (hit) { critical = this.random.roll(preview.criticalChance / 100); dealt = applyDamage(target, critical ? Math.floor(preview.damage * COMBAT_RULES.criticalMultiplier) : preview.damage); events.push(`${actor.displayName} hits ${target.displayName} for ${dealt} damage${critical ? ' (critical)' : ''}.`); if (!target.alive) { this.occupancy.remove(target.id); events.push(`${target.displayName} is defeated.`); } } else events.push(`${actor.displayName} misses ${target.displayName}.`);
    let counterattack: ActionResult | undefined; if (allowCounter && weapon.permitsCounter && hit && target.alive && this.canCounter(target, actor)) { counterattack = this.resolve(target, actor, false); events.push(...counterattack.events.map((event) => `Counter: ${event}`)); }
    return { actorId: actor.id, targetId: target.id, actionId: actor.weaponId, hit, critical, damage: dealt, targetHpBefore: hpBefore, targetHpAfter: target.currentHp, defeated: !target.alive, counterattack, events, randomStateBefore: stateBefore, randomStateAfter: this.random.state };
  }
  private canCounter(defender: UnitBattleState, attacker: UnitBattleState): boolean { if (!defender.alive) return false; const weapon = this.requireWeapon(defender.weaponId); const los = lineOfSight(this.map, defender.position, attacker.position, this.occupancy.blockedKeys(defender.id)); return previewAttack(defender, attacker, weapon, this.map.require(defender.position.x, defender.position.y), this.map.require(attacker.position.x, attacker.position.y), los.clear, this.statuses.damageMultiplier(attacker), false).valid; }
  private requireWeapon(id: string): WeaponProfile { const weapon = this.weapons.get(id); if (!weapon) throw new Error(`Missing weapon: ${id}`); return weapon; }
}
