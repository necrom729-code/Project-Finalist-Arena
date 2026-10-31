// Server core: match state machine, player management, replication
import { MatchState, LifeState, MAX_PLAYERS, MATCH_DURATION_SECONDS, TICK_RATE, MS_PER_TICK, DEFAULT_BIOME, BIOMES } from '../shared/constants.js';
import { getItem, getAllTagRecipes, getAllCrates, getManual } from '../shared/data.js';

export class PlayerState {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.lifeState = LifeState.ALIVE;
    this.kills = 0;
    this.arenaPoints = 0;
    this.bIsFinalist = false;
    this.teamId = null;
    this.x = 0; this.y = 0; this.z = 0;
    this.vx = 0; this.vy = 0; this.vz = 0;
    this.health = 100;
    this.stamina = 100;
    this.hygiene = 100;
    this.sleep = 100;
    this.hunger = 0;
    this.thirst = 0;
    this.temperature = 37;
    this.paranoia = 0;
    this.lastInputSeq = -1;
    this.inputBuffer = [];
    this.aliveSince = Date.now();
    this.skills = {}; // skillId -> {level:'Novice'|'Trained'|'Adept'|'Master', xp}
    this.inventory = {}; // itemId -> qty
    this.equipped = { weapon: null, armor: null };
    this.manuals = [];
  }

  addKill(amount=1) {
    this.kills += amount;
    this.addArenaPoints(50 * amount);
  }

  addArenaPoints(amount) {
    this.arenaPoints += amount;
  }

  isAlive() { return this.lifeState === LifeState.ALIVE; }
}

export class Match {
  constructor(options = {}) {
    this.state = MatchState.LOBBY;
    this.players = new Map(); // id -> PlayerState
    this.bots = new Map();
    this.maxPlayers = options.maxPlayers || MAX_PLAYERS;
    this.biomeId = options.biomeId || DEFAULT_BIOME;
    this.biome = BIOMES.find(b=>b.id===this.biomeId) || BIOMES[0];
    this.startTime = null;
    this.elapsed = 0;
    this.matchDuration = options.matchDuration || MATCH_DURATION_SECONDS;
    this.arenaHeat = 0; // 0-100
    this.eventDirector = null;
    this.cataclysm = null;
    this.crates = {};
    this.loot = {};
    this.ai = [];
    this.tickCount = 0;
    this.lastTick = Date.now();
    this.messages = []; // Gamemaker announcements
  }

  addPlayer(id, name) {
    if (this.players.size >= this.maxPlayers) return null;
    const ps = new PlayerState(id, name);
    this.players.set(id, ps);
    this.announce(`${name} has entered the arena.`);
    return ps;
  }

  removePlayer(id) {
    this.players.delete(id);
  }

  getPlayer(id) { return this.players.get(id); }

  getAliveCount() {
    let c=0; for (const p of this.players.values()) if (p.isAlive()) c++;
    return c;
  }

  getAlivePlayers() {
    return [...this.players.values()].filter(p=>p.isAlive());
  }

  announce(text) {
    this.messages.push({t: Date.now(), text});
    if (this.messages.length > 200) this.messages.shift();
  }

  setState(newState) {
    this.state = newState;
    this.announce(`Match state: ${newState}`);
  }

  startMatch() {
    this.setState(MatchState.PLAYING);
    this.startTime = Date.now();
    // spread players randomly
    for (const p of this.players.values()) {
      p.x = Math.random() * 2000 - 1000;
      p.y = Math.random() * 2000 - 1000;
      p.z = 0;
    }
    this.initCataclysm();
    this.initCrates();
    this.initAI();
  }

  initCataclysm() {
    this.cataclysm = {
      centerX: 0, centerY: 0,
      radius: 2000,
      phase: 1,
      shrinkStart: Date.now(),
      shrinkDuration: 60000,
      damagePerSec: 1
    };
  }

  initCrates() {
    for (const tier of Object.keys(getAllCrates())) {
      this.crates[tier] = { ...getAllCrates()[tier], stock: getAllCrates()[tier].stock, lootX: Math.random()*2000-1000, lootY: Math.random()*2000-1000 };
    }
  }

  initAI() {
    // spawn some animals
    for (let i=0;i<15;i++) {
      this.ai.push({ id:'ai_'+i, type:'wolf', x: Math.random()*2000-1000, y: Math.random()*2000-1000, hp: 40, alive: true });
    }
  }

  getSnapshot() {
    // compact replicated snapshot for clients
    const players = {};
    for (const [id, p] of this.players) {
      players[id] = {
        id:p.id, name:p.name, lifeState:p.lifeState, kills:p.kills, arenaPoints:p.arenaPoints,
        teamId:p.teamId, x:p.x, y:p.y, z:p.z, health:p.health, stamina:p.stamina,
        hygiene:p.hygiene, sleep:p.sleep, paranoia:p.paranoia, bIsFinalist:p.bIsFinalist
      };
    }
    return {
      state:this.state, biome:this.biome, elapsed:this.elapsed, arenaHeat:this.arenaHeat,
      cataclysm:this.cataclysm, players, ai:this.ai.filter(a=>a.alive).map(a=>({id:a.id,type:a.type,x:a.x,y:a.y,hp:a.hp})),
      crates: Object.entries(this.crates).map(([t,c])=>({tier:t,name:c.name,stock:c.stock,x:c.lootX,y:c.lootY})),
      messages: this.messages.slice(-10)
    };
  }
}

export function createMatch(options) {
  return new Match(options);
}
