// Finalist Arena — Server Core
// Match state machine, 100-player lobby, replication, stats, combat, crafting, zone, AI, events, alliances, hype

import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { TICK_RATE, MS_PER_TICK, MAX_PLAYERS, MATCH_DURATION_SECONDS, MatchState, LifeState, HitZone, TAGS, TIER, Quality, GoreSetting, BIOMES, EVENT_POOL, HEAT_THRESHOLDS, DEFAULT_BIOME } from '../shared/constants.js';
import { ITEMS, TAG_RECIPES, FIXED_RECIPES, CRATES, MANUALS, getItem, getTagRecipe, getAllTagRecipes, getFixedRecipe, getAllFixedRecipes, getCrate, getAllCrates, getManual } from '../shared/data.js';

// ============================================================
// UTILS
// ============================================================
function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }
function rand(min, max) { return Math.random() * (max - min) + min; }
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick(arr) { return arr[randInt(0, arr.length - 1)]; }
function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
function now() { return Date.now(); }

// ============================================================
// STATS / GAS-LIKE ATTRIBUTE SYSTEM
// ============================================================
class Attribute {
  constructor(id, max = 100, start = 100, drainPerSec = 0) {
    this.id = id;
    this.max = max;
    this.value = start;
    this.drainPerSec = drainPerSec;
  }
  set(v) { this.value = clamp(v, 0, this.max); }
  mod(d) { this.set(this.value + d); }
  drain(dt) { if (this.drainPerSec > 0) this.mod(-this.drainPerSec * dt); }
  get pct() { return this.value / this.max; }
}

class Stats {
  constructor() {
    this.health = new Attribute('health', 100, 100, 0);
    this.stamina = new Attribute('stamina', 100, 100, 0);
    this.hygiene = new Attribute('hygiene', 100, 100, 0.5);
    this.sleep = new Attribute('sleep', 100, 100, 0.3);
    this.paranoia = new Attribute('paranoia', 100, 0, 0);
    this.hunger = new Attribute('hunger', 100, 100, 0.2);
    this.thirst = new Attribute('thirst', 100, 100, 0.25);
    this.temperature = new Attribute('temperature', 100, 50, 0);
    this.bleeding = 0; // stacks
    this.infection = 0;
    this.poison = 0;
  }
  get criticalHealth() { return this.health.pct <= 0.25; }
  isAlive() { return this.health.value > 0; }
  tick(dt) {
    this.health.drain(dt);
    this.stamina.drain(dt);
    this.hygiene.drain(dt);
    this.sleep.drain(dt);
    this.hunger.drain(dt);
    this.thirst.drain(dt);
    // status effects
    if (this.bleeding > 0) this.health.mod(-this.bleeding * 0.5 * dt);
    if (this.infection > 0) this.health.mod(-this.infection * 0.3 * dt);
    if (this.poison > 0) this.health.mod(-this.poison * 0.4 * dt);
    // low sleep raises paranoia
    if (this.sleep.pct < 0.3) this.paranoia.mod(0.2 * dt);
    // low hygiene raises infection chance handled elsewhere
    clampAttr(this.health); clampAttr(this.stamina); clampAttr(this.hygiene);
    clampAttr(this.sleep); clampAttr(this.paranoia); clampAttr(this.hunger);
    clampAttr(this.thirst); clampAttr(this.temperature);
    this.bleeding = Math.max(0, this.bleeding - dt);
    this.infection = Math.max(0, this.infection - dt);
    this.poison = Math.max(0, this.poison - dt);
  }
}
function clampAttr(a) { a.set(a.value); }

// ============================================================
// ITEM / INVENTORY
// ============================================================
class ItemInstance {
  constructor(templateId, qty = 1, quality = Quality.STANDARD, durability = null) {
    const t = getItem(templateId);
    this.templateId = templateId;
    this.name = t ? t.name : templateId;
    this.tags = t ? t.tags : [];
    this.tier = t ? t.tier : TIER.T0;
    this.qty = qty;
    this.quality = quality;
    this.durability = durability !== null ? durability : (t && t.durability !== undefined ? t.durability : 100);
    this.consumable = t ? t.consumable : false;
    this.stackable = t ? t.stackable : false;
  }
}

class Inventory {
  constructor(capacity = 24) {
    this.capacity = capacity;
    this.slots = [];
  }
  add(item) {
    if (item.stackable) {
      const existing = this.slots.find(s => s.templateId === item.templateId && s.qty < 99);
      if (existing) { existing.qty += item.qty; return true; }
    }
    if (this.slots.length >= this.capacity) return false;
    this.slots.push(item);
    return true;
  }
  remove(templateId, qty = 1) {
    let removed = 0;
    for (let i = 0; i < this.slots.length && removed < qty; i++) {
      const s = this.slots[i];
      if (s.templateId === templateId) {
        const take = Math.min(qty - removed, s.qty);
        s.qty -= take;
        removed += take;
        if (s.qty <= 0) this.slots.splice(i, 1);
      }
    }
    return removed;
  }
  count(templateId) {
    return this.slots.reduce((sum, s) => s.templateId === templateId ? sum + s.qty : sum, 0);
  }
  has(templateId, qty = 1) { return this.count(templateId) >= qty; }
  toJSON() { return this.slots.map(s => ({ templateId: s.templateId, qty: s.qty, quality: s.quality, durability: s.durability })); }
}

// ============================================================
// CRAFTING SYSTEM
// ============================================================
class CraftingSystem {
  static canCraft(recipe, inventory, skillLevel = 1) {
    if (recipe.inputs.some(i => i.item)) {
      return recipe.inputs.every(i => inventory.has(i.item, i.qty));
    }
    // tag recipe
    return recipe.inputs.every(req => inventory.slots.some(s => s.tags.includes(req.tag)));
  }
  static craft(recipe, inventory, skillLevel = 1) {
    if (!this.canCraft(recipe, inventory, skillLevel)) return null;
    const outTpl = getItem(recipe.output);
    if (!outTpl) return null;
    // consume inputs
    if (recipe.inputs.some(i => i.item)) {
      recipe.inputs.forEach(i => inventory.remove(i.item, i.qty));
    } else {
      // tag: consume one matching item per tag (non-consumable tools kept where possible)
      recipe.inputs.forEach(req => {
        const idx = inventory.slots.findIndex(s => s.tags.includes(req.tag));
        if (idx >= 0) {
          const s = inventory.slots[idx];
          if (s.consumable) inventory.slots.splice(idx, 1);
          else { s.durability = Math.max(0, s.durability - 5); if (s.durability <= 0) inventory.slots.splice(idx, 1); }
        }
      });
    }
    // procedural synthesis quality based on skill
    const quality = skillLevel >= 4 ? Quality.MASTERWORK : skillLevel >= 3 ? Quality.FINE : skillLevel >= 2 ? Quality.STANDARD : Quality.CRUDE;
    const durability = outTpl.durability !== undefined ? outTpl.durability : 100;
    return new ItemInstance(recipe.output, 1, quality, durability);
  }
  static synthesize(tags, inventory) {
    // procedural: any combination of tags yields a deterministic result
    const tagSet = new Set(tags);
    const result = {
      name: 'Synthesized Item',
      tags: Array.from(tagSet),
      tier: TIER.T0,
      quality: Quality.CRUDE,
      durability: 50,
      description: `Procedural synthesis of ${tags.join(', ')}`
    };
    // Determine output type by dominant tags
    if (tagSet.has('Sharp') && tagSet.has('Flexible') && tagSet.has('Rigid')) {
      result.name = 'Synthesized Bow'; result.tier = TIER.T1; result.durability = 80;
    } else if (tagSet.has('Sharp') && tagSet.has('Rigid')) {
      result.name = 'Synthesized Blade'; result.tier = TIER.T0; result.durability = 60;
    } else if (tagSet.has('Toxic') && tagSet.has('Medicinal')) {
      result.name = 'Synthesized Antidote'; result.tier = TIER.T1; result.consumable = true;
    } else if (tagSet.has('Flammable') && tagSet.has('Explosive')) {
      result.name = 'Synthesized Bomb'; result.tier = TIER.T2; result.consumable = true;
    } else if (tagSet.has('Mutagenic') && tagSet.has('Rigid')) {
      result.name = 'Synthesized Mutagen Armor'; result.tier = TIER.T3; result.durability = 100;
    } else if (tagSet.has('Edible')) {
      result.name = 'Synthesized Ration'; result.tier = TIER.T0; result.consumable = true;
    }
    return result;
  }
}

// ============================================================
// PLAYER
// ============================================================
class Player {
  constructor(id, name, ws) {
    this.id = id;
    this.name = name;
    this.ws = ws;
    this.x = rand(100, 900);
    this.y = rand(100, 900);
    this.vx = 0; this.vy = 0;
    this.angle = 0;
    this.stats = new Stats();
    this.inventory = new Inventory();
    this.skills = {}; // skillId -> level 1..4
    this.manuals = [];
    this.kills = 0;
    this.arenaPoints = 0;
    this.lifeState = LifeState.ALIVE;
    this.teamId = null;
    this.betrayer = false;
    this.lastInput = 0;
    this.isBot = false;
    this.connectionQuality = 100;
    this.deathCamera = null; // { targetId, type, startTime }
  }
  get ps() { return { id:this.id, name:this.name, x:this.x, y:this.y, angle:this.angle, health:this.stats.health.value, stamina:this.stats.stamina.value, lifeState:this.lifeState, kills:this.kills, arenaPoints:this.arenaPoints, teamId:this.teamId, betrayer:this.betrayer }; }
  takeDamage(amount, instigatorId, hitZone) {
    if (this.lifeState !== LifeState.ALIVE) return false;
    let dmg = amount;
    // hit zone modifiers
    if (hitZone === HitZone.HEAD) dmg *= 2.0;
    else if (hitZone === HitZone.LIMB) dmg *= 0.7;
    // armor reduction (simplified)
    dmg = Math.max(0, dmg - 0);
    this.stats.health.mod(-dmg);
    if (hitZone === HitZone.LIMB) this.stats.bleeding = (this.stats.bleeding || 0) + 5;
    if (this.stats.health.value <= 0) {
      this.stats.health.set(0);
      this.lifeState = LifeState.DEAD;
      if (instigatorId) { /* killer set externally */ }
      return true; // died
    }
    return false;
  }
  addArenaPoints(amt) { this.arenaPoints += amt; }
  addKill() { this.kills++; this.addArenaPoints(50); }
}

// ============================================================
// TEAM / ALLIANCE
// ============================================================
class Team {
  constructor(id) { this.id = id; this.members = new Set(); this.max = 8; }
  add(p) { if (this.members.size < this.max) { this.members.add(p.id); p.teamId = this.id; return true; } return false; }
  remove(pid) { this.members.delete(pid); }
  size() { return this.members.size; }
}

// ============================================================
// AI ENTITY
// ============================================================
class AIEntity {
  constructor(id, type, x, y, biome) {
    this.id = id;
    this.type = type; // animal|mutant|hollowed|finfeaster
    this.x = x; this.y = y;
    this.vx = 0; this.vy = 0;
    this.health = type === 'hollowed' ? 80 : type === 'mutant' ? 100 : 40;
    this.maxHealth = this.health;
    this.biome = biome;
    this.state = 'idle'; // idle, wander, chase, attack, flee
    this.targetId = null;
    this.lastAttack = 0;
    this.mutationDrops = [];
  }
  get ps() { return { id:this.id, type:this.type, x:this.x, y:this.y, health:this.health, maxHealth:this.maxHealth, state:this.state, targetId:this.targetId }; }
}

// ============================================================
// CATAClYSM / ZONE
// ============================================================
class Cataclysm {
  constructor(biome) {
    this.biome = biome;
    this.center = { x: 500, y: 500 };
    this.radius = 1000;
    this.phase = 0;
    this.phaseTime = 0;
    this.nextPhaseTime = 60000; // 1 min per phase
    this.damagePerSec = 0;
  }
  update(dt) {
    this.phaseTime += dt * 1000;
    if (this.phaseTime >= this.nextPhaseTime && this.phase < 5) {
      this.phase++;
      this.phaseTime = 0;
      this.radius *= 0.7;
      this.damagePerSec = this.phase * 5;
    }
  }
  isOutside(x, y) { return dist({x,y}, this.center) > this.radius; }
  get damage() { return this.damagePerSec; }
}

// ============================================================
// EVENT DIRECTOR
// ============================================================
class EventDirector {
  constructor() {
    this.activeEvent = null;
    this.eventTime = 0;
    this.eventDuration = 0;
    this.nextEventTime = rand(600, 900) * 1000; // 10-15 min
    this.pool = [...EVENT_POOL];
  }
  update(dt, matchTime) {
    if (this.activeEvent) {
      this.eventTime += dt * 1000;
      if (this.eventTime >= this.eventDuration) this.endEvent();
    } else {
      this.nextEventTime -= dt * 1000;
      if (this.nextEventTime <= 0) this.startEvent();
    }
  }
  startEvent() {
    const e = pick(this.pool);
    this.pool = this.pool.filter(x => x !== e);
    this.activeEvent = { id: e, start: now() };
    this.eventTime = 0;
    this.eventDuration = rand(180, 300) * 1000; // 3-5 min
    return this.activeEvent;
  }
  endEvent() { this.activeEvent = null; this.eventTime = 0; this.eventDuration = 0; this.nextEventTime = rand(600, 900) * 1000; }
}

// ============================================================
// HYPE SERVICE CLIENT (mock + real interface)
// ============================================================
class HypeService {
  constructor() {
    this.enabled = true;
    this.panicSwitch = false;
    this.hypeLevel = 0; // 0 Murmur,1 Buzz,2 Roar,3 Frenzy
    this.chatVelocity = 0;
    this.uniqueChatters = 0;
    this.cooldownUntil = 0;
    this.dropsThisMatch = 0;
    this.maxDrops = 5;
  }
  setPanic(v) { this.panicSwitch = !!v; }
  ingestChat(msg, platform) {
    if (this.panicSwitch || !this.enabled) return;
    this.chatVelocity += 1;
    this.uniqueChatters += 1;
    this.updateHype();
  }
  updateHype() {
    const cv = this.chatVelocity;
    this.hypeLevel = cv < 5 ? 0 : cv < 20 ? 1 : cv < 50 ? 2 : 3;
    // decay
    this.chatVelocity *= 0.95;
  }
  canDrop() {
    return this.enabled && !this.panicSwitch && now() > this.cooldownUntil && this.dropsThisMatch < this.maxDrops;
  }
  awardDrop(playerId) {
    if (!this.canDrop()) return null;
    this.dropsThisMatch++;
    this.cooldownUntil = now() + 300000; // 5 min cooldown
    return { playerId, tier: pick(['T1','T2']), announced: true };
  }
}

// ============================================================
// MATCH / WORLD
// ============================================================
class Match {
  constructor() {
    this.id = 'match_' + Date.now();
    this.state = MatchState.LOBBY;
    this.players = new Map(); // id -> Player
    this.bots = new Map();
    this.ai = new Map(); // id -> AIEntity
    this.teams = new Map(); // id -> Team
    this.inventory = new Map(); // id -> Inventory (ground loot)
    this.cataclysm = new Cataclysm(DEFAULT_BIOME);
    this.eventDirector = new EventDirector();
    this.hype = new HypeService();
    this.matchStartTime = 0;
    this.matchTime = 0;
    this.arenaHeat = 0;
    this.nextAiId = 10000;
    this.nextLootId = 20000;
    this.biome = DEFAULT_BIOME;
    this.worldSize = 1000;
  }
  addPlayer(p) { this.players.set(p.id, p); }
  removePlayer(id) { this.players.delete(id); }
  getPlayer(id) { return this.players.get(id); }
  getAlivePlayers() { return [...this.players.values()].filter(p => p.lifeState === LifeState.ALIVE); }
  spawnAI(type, x, y) {
    const id = 'ai_' + this.nextAiId++;
    const ai = new AIEntity(id, type, x, y, this.biome);
    this.ai.set(id, ai);
    return ai;
  }
  spawnStarterAI() {
    const types = ['wolf','boar','bear','mutant_stag','hollowed_stalker'];
    for (let i = 0; i < 40; i++) {
      const t = pick(types);
      this.spawnAI(t, rand(0, this.worldSize), rand(0, this.worldSize));
    }
  }
  getSnapshot() {
    return {
      state: this.state,
      matchTime: this.matchTime,
      aliveCount: this.getAlivePlayers().length,
      cataclysm: { center:this.cataclysm.center, radius:this.cataclysm.radius, phase:this.cataclysm.phase, damage:this.cataclysm.damage },
      event: this.eventDirector.activeEvent,
      hype: { level: this.hype.hypeLevel, panic: this.hype.panicSwitch },
      players: [...this.players.values()].map(p => p.ps),
      ai: [...this.ai.values()].filter(a => a.health > 0).map(a => a.ps)
    };
  }
}

// ============================================================
// WORLD SIMULATION
// ============================================================
class World {
  constructor() {
    this.match = new Match();
    this.tickCount = 0;
    this.lastTime = now();
    this.botClients = 0;
  }
  startMatch() {
    this.match.state = MatchState.PLAYING;
    this.match.matchStartTime = now();
    this.match.spawnStarterAI();
  }
  addBot(count) {
    for (let i = 0; i < count; i++) {
      const p = new Player('bot_' + i, 'Bot' + i, null);
      p.isBot = true;
      p.x = rand(0, this.match.worldSize);
      p.y = rand(0, this.match.worldSize);
      this.match.addPlayer(p);
    }
    this.botClients = count;
  }
  addPlayer(id, name, ws) {
    const p = new Player(id, name, ws);
    this.match.addPlayer(p);
    return p;
  }
  removePlayer(id) { this.match.removePlayer(id); }
  getPlayer(id) { return this.match.getPlayer(id); }
  update(dt) {
    this.tickCount++;
    this.match.matchTime += dt * 1000;
    const mt = this.match.matchTime / 1000;
    if (this.match.state === MatchState.PLAYING && mt >= MATCH_DURATION_SECONDS) {
      this.match.state = MatchState.GAME_OVER;
    }
    // cataclysm
    this.match.cataclysm.update(dt);
    // events
    this.match.eventDirector.update(dt, mt);
    // players
    for (const p of this.match.players.values()) {
      if (p.lifeState !== LifeState.ALIVE) continue;
      p.stats.tick(dt);
      // zone damage
      if (this.match.cataclysm.isOutside(p.x, p.y)) {
        p.stats.health.mod(-this.match.cataclysm.damage * dt);
        if (p.stats.health.value <= 0) { p.stats.health.set(0); p.lifeState = LifeState.DEAD; }
      }
      // movement
      p.x += p.vx * dt; p.y += p.vy * dt;
      p.x = clamp(p.x, 0, this.match.worldSize);
      p.y = clamp(p.y, 0, this.match.worldSize);
      // bot AI simple
      if (p.isBot) this.updateBot(p, dt);
    }
    // AI
    for (const ai of this.match.ai.values()) {
      if (ai.health <= 0) continue;
      this.updateAI(ai, dt);
    }
    // combat / damage resolution handled via events
    // cleanup dead AI
    for (const [id, ai] of this.match.ai) {
      if (ai.health <= 0) {
        // drop mutagen
        this.match.ai.delete(id);
      }
    }
    // victory check
    const alive = this.match.getAlivePlayers();
    if (alive.length <= 1 && this.match.state === MatchState.PLAYING) {
      this.match.state = alive.length === 1 ? MatchState.VICTORY : MatchState.GAME_OVER;
      if (alive.length === 1) alive[0].addArenaPoints(500);
    }
  }
  updateBot(p, dt) {
    // simple wandering + occasional combat
    if (Math.random() < 0.02) {
      p.vx = rand(-2, 2); p.vy = rand(-2, 2);
    }
    // attack nearest player
    const nearest = this.nearestPlayer(p.x, p.y, p.id);
    if (nearest && dist({x:p.x,y:p.y}, nearest) < 30) {
      // deal damage
      nearest.player.stats.health.mod(-10 * dt);
      if (nearest.player.stats.health.value <= 0) { nearest.player.stats.health.set(0); nearest.player.lifeState = LifeState.DEAD; p.addKill(); }
    }
  }
  updateAI(ai, dt) {
    // simple chase nearest player
    const nearest = this.nearestPlayer(ai.x, ai.y, null);
    if (nearest) {
      const dx = nearest.x - ai.x, dy = nearest.y - ai.y;
      const d = Math.hypot(dx, dy);
      if (d < 40) {
        if (now() - ai.lastAttack > 1000) {
          nearest.player.stats.health.mod(-15 * dt);
          ai.lastAttack = now();
          if (nearest.player.stats.health.value <= 0) { nearest.player.stats.health.set(0); nearest.player.lifeState = LifeState.DEAD; }
        }
      } else {
        ai.x += (dx / d) * 1.5 * dt; ai.y += (dy / d) * 1.5 * dt;
      }
    } else {
      ai.x += rand(-1,1) * dt; ai.y += rand(-1,1) * dt;
    }
  }
  nearestPlayer(x, y, excludeId) {
    let best = null, bestD = 1e9;
    for (const p of this.match.players.values()) {
      if (p.id === excludeId || p.lifeState !== LifeState.ALIVE) continue;
      const d = dist({x,y}, p);
      if (d < bestD) { bestD = d; best = p; }
    }
    return best ? { player: best, x: best.x, y: best.y } : null;
  }
  getSnapshot() { return this.match.getSnapshot(); }
}

export { Match, Player, Team, AIEntity, Cataclysm, EventDirector, HypeService, Inventory, ItemInstance, CraftingSystem, Stats, Attribute, World, MatchState, LifeState, HitZone, TAGS, TIER, Quality, GoreSetting };
