// Shared game constants and data for Finalist Arena (standalone build)

export const TICK_RATE = 30;
export const MS_PER_TICK = 1000 / TICK_RATE;
export const MAX_PLAYERS = 100;
export const MATCH_DURATION_SECONDS = 60 * 60; // cap 60 min

export const MatchState = {
  LOBBY: 'Lobby',
  COUNTDOWN: 'Countdown',
  DROP: 'Drop',
  PLAYING: 'Playing',
  FINAL: 'Final',
  VICTORY: 'Victory',
  GAME_OVER: 'GameOver'
};

export const LifeState = {
  ALIVE: 'Alive',
  DOWNED: 'Downed',
  DEAD: 'Dead',
  SPECTATING: 'Spectating'
};

// Stat ranges
export const STAT_MAX = 100;
export const CRITICAL_HEALTH_PCT = 0.25;

// Hit zones
export const HitZone = {
  HEAD: 'head',
  TORSO: 'torso',
  LIMB: 'limb'
};

// Material tags for crafting
export const TAGS = [
  'Sharp','Blunt','Flexible','Rigid','Fiber','Absorbent','Flammable',
  'Waterproof','Toxic','Medicinal','Conductive','Insulating','Heavy','Light',
  'Sticky','Explosive','Luminous','Mutagenic','Edible','Fermentable'
];

// Tech tiers
export const TIER = {
  T0: 'T0 Primitive',
  T1: 'T1 Tribal',
  T2: 'T2 Survivalist',
  T3: 'T3 Salvage',
  T4: 'T4 Arena-Tech',
  T5: 'T5 Gamemaker Relic'
};

// Quality
export const Quality = { CRUDE:'Crude', STANDARD:'Standard', FINE:'Fine', MASTERWORK:'Masterwork' };

// Gore setting
export const GoreSetting = { OFF:'Off', REDUCED:'Reduced', FULL:'Full' };

// Biomes
export const BIOMES = [
  { id:'forest', name:'Whispering Forest', cataclysm:'Wildfire' },
  { id:'savannah', name:'Savannah Safari', cataclysm:'Earthquake' },
  { id:'arctic', name:'Frozen Rim (Arctic)', cataclysm:'Ice Break' },
  { id:'volcano', name:'Ember Caldera (Volcano)', cataclysm:'Eruption' },
  { id:'desert', name:'Dune Wastes (Desert)', cataclysm:'Sandstorm' },
  { id:'drowned', name:'Drowned Metropolis', cataclysm:'Flood' },
  { id:'refinery', name:'Toxic Refinery', cataclysm:'Toxic Sludge' },
  { id:'carnival', name:'Rotting Carnival', cataclysm:'Blight' }
];

// Timed event pool (20)
export const EVENT_POOL = [
  'Blood Tsunami','Ashfall Whiteout','Greenveil Poison Fog','Stampede of Titans',
  'Hollow Night','Locust Rain','Sinkhole Cascade','Magnetic Storm',
  "Gamemaker's Feast","Rotting Rain","Predator Release","Plague Bloom",
  'Flash Flood','Wildfire Wheel','Echo Hunters','Meteor Storm',
  'Frozen Silence','Tar Mire','Bone Harvest','Audience Vote'
];

// Arena Heat thresholds for Hollowed spawn
export const HEAT_THRESHOLDS = { LOW: 20, MEDIUM: 50, HIGH: 80 };

// Default biome for test map
export const DEFAULT_BIOME = 'forest';
