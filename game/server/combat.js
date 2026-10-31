// Combat system — server authoritative hit resolution, lag-compensated hitscan/projectile

import { HitZone } from '../shared/constants.js';

function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
function now() { return Date.now(); }

export class CombatSystem {
  constructor(world) {
    this.world = world;
    this.projectiles = []; // {id, x, y, vx, vy, ownerId, damage, hitZone, range, traveled, type}
    this.meleeHits = []; // pending melee swings
    this.executions = []; // {id, victimId, killerId, weapon, startTime, duration, interruptible}
  }
  // Server receives a shot (client-authoritative aim, server-validated)
  registerShot(ownerId, x, y, angle, weapon, hitZone = HitZone.TORSO) {
    const owner = this.world.getPlayer(ownerId);
    if (!owner || owner.lifeState !== 'Alive') return null;
    // hitscan
    const range = weapon.range || 300;
    const dx = Math.cos(angle), dy = Math.sin(angle);
    let hit = null, bestD = range;
    for (const p of this.world.match.players.values()) {
      if (p.id === ownerId || p.lifeState !== 'Alive') continue;
      const d = this.pointToSegmentDist({x:owner.x,y:owner.y}, {x:owner.x+dx*range,y:owner.y+dy*range}, p);
      if (d < 25 && d < bestD) { bestD = d; hit = p; }
    }
    for (const ai of this.world.match.ai.values()) {
      if (ai.health <= 0) continue;
      const d = this.pointToSegmentDist({x:owner.x,y:owner.y}, {x:owner.x+dx*range,y:owner.y+dy*range}, ai);
      if (d < 30 && d < bestD) { bestD = d; hit = { type:'ai', id:ai.id, entity:ai }; }
    }
    if (hit) {
      const damage = this.weaponDamage(weapon, hitZone, owner);
      if (hit.type === 'ai') {
        hit.entity.health -= damage;
      if (hit.entity.health <= 0) {
        hit.entity.health = 0;
        owner.addKill();
        this.world.match.arenaHeat += 10;
      }
      } else {
        const died = hit.takeDamage(damage, ownerId, hitZone);
        if (died) {
          owner.addKill();
          // check betrayal
          if (hit.teamId && hit.teamId === owner.teamId && hit.teamId !== null) {
            owner.betrayer = true;
            // paranoia on remaining allies
            for (const p of this.world.match.players.values()) {
              if (p.teamId === hit.teamId && p.id !== owner.id && p.id !== hit.id) p.stats.paranoia.mod(30);
            }
          }
        }
      }
      return { hit: true, target: hit.type === 'ai' ? hit.entity : hit, damage, hitZone, killerId: ownerId };
    }
    return { hit: false };
  }
  registerMelee(ownerId, x, y, angle, weapon, hitZone = HitZone.TORSO) {
    const owner = this.world.getPlayer(ownerId);
    if (!owner) return null;
    const range = weapon.meleeRange || 60;
    const dx = Math.cos(angle), dy = Math.sin(angle);
    let hit = null, bestD = range;
    for (const p of this.world.match.players.values()) {
      if (p.id === ownerId || p.lifeState !== 'Alive') continue;
      const d = dist({x:owner.x,y:owner.y}, p);
      if (d < range) { bestD = d; hit = p; }
    }
    if (hit) {
      const damage = this.weaponDamage(weapon, hitZone, owner);
      const died = hit.takeDamage(damage, ownerId, hitZone);
      if (died) owner.addKill();
      // execution check
      if (died && weapon.execution) {
        this.startExecution(ownerId, hit.id, weapon);
      }
      if (died && hit.teamId && hit.teamId === owner.teamId) {
        owner.betrayer = true;
        for (const p of this.world.match.players.values()) {
          if (p.teamId === hit.teamId && p.id !== owner.id && p.id !== hit.id) p.stats.paranoia.mod(30);
        }
      }
      return { hit: true, target: hit, damage, hitZone, killerId: ownerId, died, execution: !!weapon.execution };
    }
    return { hit: false };
  }
  startExecution(killerId, victimId, weapon) {
    const exec = { id: 'exec_' + Date.now(), killerId, victimId, weapon: weapon.id, startTime: now(), duration: 2000, interruptible: true };
    this.world.executions = this.world.executions || [];
    this.world.executions.push(exec);
    return exec;
  }
  interruptExecution(execId) {
    const idx = (this.world.executions || []).findIndex(e => e.id === execId);
    if (idx >= 0) (this.world.executions || []).splice(idx, 1);
  }
  weaponDamage(weapon, hitZone, owner) {
    let dmg = weapon.baseDamage || 20;
    // skill modifier
    const skill = owner.skills && owner.skills[weapon.skill];
    if (skill) dmg *= (1 + (skill - 1) * 0.15);
    // hit zone
    if (hitZone === HitZone.HEAD) dmg *= 2.0;
    else if (hitZone === HitZone.LIMB) dmg *= 0.7;
    return Math.max(1, dmg);
  }
  pointToSegmentDist(p, lineStart, lineEnd) {
    const L2 = Math.hypot(lineEnd.x - lineStart.x, lineEnd.y - lineStart.y);
    if (L2 === 0) return dist(p, lineStart);
    const t = Math.max(0, Math.min(1, ((p.x - lineStart.x) * (lineEnd.x - lineStart.x) + (p.y - lineStart.y) * (lineEnd.y - lineStart.y)) / (L2 * L2)));
    return dist(p, { x: lineStart.x + t * (lineEnd.x - lineStart.x), y: lineStart.y + t * (lineEnd.y - lineStart.y) });
  }
  update(dt) {
    // projectiles move
    this.projectiles = this.projectiles.filter(p => {
      p.x += p.vx * dt; p.y += p.vy * dt;
      p.traveled += Math.hypot(p.vx, p.vy) * dt;
      return p.traveled < p.range;
    });
    // executions: auto-complete after duration unless interrupted
    this.world.executions = (this.world.executions || []).filter(e => {
      if (now() - e.startTime > e.duration) {
        // kill victim
        const v = this.world.getPlayer(e.victimId);
        if (v && v.lifeState === 'Alive') { v.stats.health.set(0); v.lifeState = 'Dead'; const k = this.world.getPlayer(e.killerId); if (k) k.addKill(); }
        return false;
      }
      return true;
    });
  }
}

export const WEAPONS = {
  flint_knife: { id:'flint_knife', name:'Flint Knife', baseDamage:25, meleeRange:70, skill:'Blades' },
  spear: { id:'spear', name:'Spear', baseDamage:35, meleeRange:110, skill:'Spear', range:150 },
  machete: { id:'machete', name:'Machete', baseDamage:40, meleeRange:85, skill:'Blades', execution:'neck_snap' },
  axe: { id:'axe', name:'Axe', baseDamage:50, meleeRange:80, skill:'Blunt', execution:'cleave' },
  club: { id:'club', name:'Club', baseDamage:30, meleeRange:75, skill:'Blunt', execution:'shove' },
  bow: { id:'bow', name:'Bow', baseDamage:45, range:400, skill:'Archery', projectile:true },
  crossbow: { id:'crossbow', name:'Crossbow', baseDamage:70, range:350, skill:'Archery', projectile:true },
  throw_knife: { id:'throw_knife', name:'Throwing Knife', baseDamage:35, range:120, skill:'Throwing', projectile:true },
  flare_gun: { id:'flare_gun', name:'Flare Gun', baseDamage:20, range:300, skill:'Fire-craft', projectile:true }
};
