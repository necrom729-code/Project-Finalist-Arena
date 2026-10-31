// Shared data-driven items, recipes, and crates for Finalist Arena
import { TAGS, TIER, Quality } from './constants.js';

// Item template registry (data-driven, no code change to add content)
export const ITEMS = {
  // Resources
  wood: { id: 'wood', name: 'Wood', tags: ['Rigid', 'Flammable'], tier: TIER.T0, stackable: true },
  stone: { id: 'stone', name: 'Stone', tags: ['Rigid', 'Heavy', 'Blunt'], tier: TIER.T0, stackable: true },
  cloth: { id: 'cloth', name: 'Cloth', tags: ['Fiber', 'Absorbent', 'Flexible'], tier: TIER.T0, stackable: true },
  herb: { id: 'herb', name: 'Herb', tags: ['Medicinal', 'Fiber'], tier: TIER.T0, stackable: true },
  fiber: { id: 'fiber', name: 'Grass Fiber', tags: ['Fiber', 'Flexible'], tier: TIER.T0, stackable: true },
  bone: { id: 'bone', name: 'Bone', tags: ['Rigid', 'Sharp', 'Heavy'], tier: TIER.T0, stackable: true },
  hide: { id: 'hide', name: 'Hide', tags: ['Flexible', 'Waterproof', 'Fiber'], tier: TIER.T0, stackable: true },
  resin: { id: 'resin', name: 'Resin', tags: ['Sticky', 'Flammable'], tier: TIER.T0, stackable: true },
  water: { id: 'water', name: 'Water', tags: ['Absorbent'], tier: TIER.T0, stackable: true },
  berries: { id: 'berries', name: 'Berries', tags: ['Edible'], tier: TIER.T0, stackable: true },

  // Mutagens
  venom_gland: { id: 'venom_gland', name: 'Venom Gland', tags: ['Toxic', 'Mutagenic'], tier: TIER.T2, stackable: true },
  chitin_plate: { id: 'chitin_plate', name: 'Chitin Plate', tags: ['Rigid', 'Mutagenic', 'Heavy'], tier: TIER.T3, stackable: true },
  spore_sac: { id: 'spore_sac', name: 'Spore Sac', tags: ['Toxic', 'Mutagenic', 'Luminous'], tier: TIER.T2, stackable: true },
  glowcap: { id: 'glowcap', name: 'Glowcap', tags: ['Luminous', 'Mutagenic', 'Edible'], tier: TIER.T1, stackable: true },
  bone_lattice: { id: 'bone_lattice', name: 'Bone Lattice', tags: ['Rigid', 'Mutagenic', 'Light'], tier: TIER.T3, stackable: true },
  nerve_silk: { id: 'nerve_silk', name: 'Nerve Silk', tags: ['Fiber', 'Mutagenic', 'Flexible'], tier: TIER.T3, stackable: true },
  acid_bladder: { id: 'acid_bladder', name: 'Acid Bladder', tags: ['Toxic', 'Mutagenic', 'Liquid'], tier: TIER.T2, stackable: true },
  ember_heart: { id: 'ember_heart', name: 'Ember Heart', tags: ['Flammable', 'Mutagenic', 'Luminous'], tier: TIER.T3, stackable: true },
  frost_marrow: { id: 'frost_marrow', name: 'Frost Marrow', tags: ['Insulating', 'Mutagenic'], tier: TIER.T3, stackable: true },

  // Tools
  stone_axe: { id: 'stone_axe', name: 'Stone Axe', tags: ['Sharp', 'Blunt', 'Heavy'], tier: TIER.T0, durability: 50 },
  flint_knife: { id: 'flint_knife', name: 'Flint Knife', tags: ['Sharp', 'Light'], tier: TIER.T0, durability: 30 },
  bow: { id: 'bow', name: 'Bow', tags: ['Sharp', 'Flexible', 'Rigid'], tier: TIER.T1, durability: 100 },
  fishing_spear: { id: 'fishing_spear', name: 'Fishing Spear', tags: ['Sharp', 'Rigid', 'Heavy'], tier: TIER.T0, durability: 40 },
  torch: { id: 'torch', name: 'Torch', tags: ['Flammable', 'Luminous', 'Rigid'], tier: TIER.T0, durability: 20 },
  rope: { id: 'rope', name: 'Rope', tags: ['Fiber', 'Flexible', 'Heavy'], tier: TIER.T0, stackable: true },
  bandage: { id: 'bandage', name: 'Bandage', tags: ['Absorbent', 'Medicinal', 'Fiber'], tier: TIER.T0, stackable: true, consumable: true },
  poultice: { id: 'poultice', name: 'Herbal Poultice', tags: ['Medicinal', 'Absorbent'], tier: TIER.T1, stackable: true, consumable: true },
  antivenom: { id: 'antivenom', name: 'Antivenom', tags: ['Medicinal', 'Toxic'], tier: TIER.T2, stackable: true, consumable: true },
  soap: { id: 'soap', name: 'Soap', tags: ['Medicinal', 'Absorbent'], tier: TIER.T1, stackable: true },

  // Weapons
  spear: { id: 'spear', name: 'Spear', tags: ['Sharp', 'Rigid', 'Heavy'], tier: TIER.T0, durability: 60 },
  machete: { id: 'machete', name: 'Machete', tags: ['Sharp', 'Heavy'], tier: TIER.T1, durability: 70 },
  axe: { id: 'axe', name: 'Axe', tags: ['Sharp', 'Blunt', 'Heavy'], tier: TIER.T1, durability: 60 },
  club: { id: 'club', name: 'Club', tags: ['Blunt', 'Heavy'], tier: TIER.T0, durability: 50 },
  crossbow: { id: 'crossbow', name: 'Crossbow', tags: ['Sharp', 'Rigid', 'Heavy'], tier: TIER.T2, durability: 90 },
  throw_knife: { id: 'throw_knife', name: 'Throwing Knife', tags: ['Sharp', 'Light'], tier: TIER.T1, stackable: true, consumable: true },

  // Armor
  hide_vest: { id: 'hide_vest', name: 'Hide Vest', tags: ['Flexible', 'Waterproof'], tier: TIER.T0, durability: 80 },
  bone_plate_armor: { id: 'bone_plate_armor', name: 'Bone Plate Armor', tags: ['Rigid', 'Heavy', 'Sharp'], tier: TIER.T2, durability: 100 },
  gas_mask: { id: 'gas_mask', name: 'Gas Mask', tags: ['Insulating', 'Flexible'], tier: TIER.T2, durability: 60 },

  // Arena-tech crates (T4/T5)
  thermal_scope: { id: 'thermal_scope', name: 'Thermal Scope', tags: ['Conductive', 'Luminous'], tier: TIER.T4 },
  flare_gun: { id: 'flare_gun', name: 'Flare Gun', tags: ['Flammable', 'Explosive'], tier: TIER.T4, durability: 20 },
  drone_scout: { id: 'drone_scout', name: 'Drone Scout', tags: ['Conductive', 'Luminous'], tier: TIER.T5, durability: 10 },
  taser_trap: { id: 'taser_trap', name: 'Taser Trap', tags: ['Conductive', 'Explosive'], tier: TIER.T4, consumable: true },
  emp_pulse: { id: 'emp_pulse', name: 'EMP Pulse', tags: ['Conductive', 'Explosive'], tier: TIER.T5, consumable: true }
};

// Tag-based recipes: inputs (tag requirements) -> output item id
export const TAG_RECIPES = [
  { id: 'recipe_bow', name: 'Bow (tag)', inputs: [{ tag: 'Sharp' }, { tag: 'Flexible' }, { tag: 'Rigid' }], output: 'bow', tier: TIER.T1, quality: Quality.STANDARD },
  { id: 'recipe_spear', name: 'Spear (tag)', inputs: [{ tag: 'Sharp' }, { tag: 'Rigid' }], output: 'spear', tier: TIER.T0, quality: Quality.CRUDE },
  { id: 'recipe_knife', name: 'Flint Knife (tag)', inputs: [{ tag: 'Sharp' }], output: 'flint_knife', tier: TIER.T0, quality: Quality.CRUDE },
  { id: 'recipe_axe', name: 'Stone Axe (tag)', inputs: [{ tag: 'Sharp' }, { tag: 'Blunt' }, { tag: 'Heavy' }], output: 'stone_axe', tier: TIER.T0, quality: Quality.STANDARD },
  { id: 'recipe_bandage', name: 'Bandage (tag)', inputs: [{ tag: 'Absorbent' }, { tag: 'Fiber' }], output: 'bandage', tier: TIER.T0, quality: Quality.STANDARD },
  { id: 'recipe_poultice', name: 'Poultice (tag)', inputs: [{ tag: 'Medicinal' }, { tag: 'Absorbent' }], output: 'poultice', tier: TIER.T1, quality: Quality.STANDARD },
  { id: 'recipe_hide_vest', name: 'Hide Vest (tag)', inputs: [{ tag: 'Flexible' }, { tag: 'Waterproof' }], output: 'hide_vest', tier: TIER.T0, quality: Quality.STANDARD },
  { id: 'recipe_rope', name: 'Rope (tag)', inputs: [{ tag: 'Fiber' }, { tag: 'Flexible' }, { tag: 'Heavy' }], output: 'rope', tier: TIER.T0, quality: Quality.STANDARD },
  { id: 'recipe_torch', name: 'Torch (tag)', inputs: [{ tag: 'Flammable' }, { tag: 'Luminous' }, { tag: 'Rigid' }], output: 'torch', tier: TIER.T0, quality: Quality.STANDARD },
  { id: 'recipe_soap', name: 'Soap (tag)', inputs: [{ tag: 'Absorbent' }], output: 'soap', tier: TIER.T1, quality: Quality.STANDARD },
  { id: 'recipe_bone_armor', name: 'Bone Plate Armor (tag)', inputs: [{ tag: 'Rigid' }, { tag: 'Heavy' }, { tag: 'Sharp' }], output: 'bone_plate_armor', tier: TIER.T2, quality: Quality.FINE },
  { id: 'recipe_antivenom', name: 'Antivenom (tag)', inputs: [{ tag: 'Medicinal' }, { tag: 'Toxic' }], output: 'antivenom', tier: TIER.T2, quality: Quality.FINE },
  { id: 'recipe_crossbow', name: 'Crossbow (tag)', inputs: [{ tag: 'Sharp' }, { tag: 'Rigid' }, { tag: 'Heavy' }], output: 'crossbow', tier: TIER.T2, quality: Quality.FINE },
  { id: 'recipe_flare_gun', name: 'Flare Gun (tag)', inputs: [{ tag: 'Flammable' }, { tag: 'Explosive' }], output: 'flare_gun', tier: TIER.T4, quality: Quality.FINE },
  { id: 'recipe_throw_knife', name: 'Throwing Knife (tag)', inputs: [{ tag: 'Sharp' }, { tag: 'Light' }], output: 'throw_knife', tier: TIER.T1, quality: Quality.STANDARD }
];

// Fixed recipes (exact item inputs)
export const FIXED_RECIPES = [
  { id: 'fixed_smoke_bomb', name: 'Smoke Bomb', inputs: [{ item: 'cloth', qty: 2 }, { item: 'herb', qty: 1 }], output: 'bandage', tier: TIER.T1 },
  { id: 'fixed_acid_flask', name: 'Acid Flask', inputs: [{ item: 'acid_bladder', qty: 1 }, { item: 'cloth', qty: 1 }], output: 'acid_bladder', tier: TIER.T2 }
];

// Provision crates by tech tier (stock limited per match)
export const CRATES = {
  T0: { name: 'Primitive Crate', items: ['wood', 'stone', 'cloth', 'herb', 'fiber', 'bone', 'hide', 'resin'], stock: 20 },
  T1: { name: 'Tribal Crate', items: ['bow', 'spear', 'flint_knife', 'torch', 'rope', 'bandage', 'hide_vest', 'soap'], stock: 15 },
  T2: { name: 'Survivalist Crate', items: ['machete', 'axe', 'crossbow', 'poultice', 'antivenom', 'gas_mask', 'bone', 'venom_gland'], stock: 10 },
  T3: { name: 'Salvage Crate', items: ['bone_plate_armor', 'chitin_plate', 'bone_lattice', 'nerve_silk', 'acid_bladder', 'ember_heart', 'frost_marrow'], stock: 6 },
  T4: { name: 'Arena-Tech Crate', items: ['thermal_scope', 'flare_gun', 'taser_trap'], stock: 3 },
  T5: { name: 'Gamemaker Relic', items: ['drone_scout', 'emp_pulse'], stock: 1 }
};

// Manuals (skills)
export const MANUALS = [
  { id: 'manual_archery', name: 'Archery Manual', tier: 'Common', skill: 'Archery' },
  { id: 'manual_blades', name: 'Blades Manual', tier: 'Common', skill: 'Blades' },
  { id: 'manual_herbalism', name: 'Herbalism & Medicine Manual', tier: 'Rare', skill: 'Herbalism' },
  { id: 'manual_stealth', name: 'Stealth Manual', tier: 'Common', skill: 'Stealth' },
  { id: 'manual_climbing', name: 'Climbing Manual', tier: 'Common', skill: 'Climbing' },
  { id: 'manual_swimming', name: 'Swimming Manual', tier: 'Common', skill: 'Swimming' },
  { id: 'manual_firecraft', name: 'Fire-craft Manual', tier: 'Common', skill: 'Fire-craft' },
  { id: 'manual_negotiation', name: 'Negotiation Manual', tier: 'Legendary', skill: 'Negotiation' }
];

export function getItem(id) { return ITEMS[id]; }
export function getTagRecipe(id) { return TAG_RECIPES.find(r => r.id === id); }
export function getAllTagRecipes() { return TAG_RECIPES; }
export function getFixedRecipe(id) { return FIXED_RECIPES.find(r => r.id === id); }
export function getAllFixedRecipes() { return FIXED_RECIPES; }
export function getCrate(tier) { return CRATES[tier]; }
export function getAllCrates() { return CRATES; }
export function getManual(id) { return MANUALS.find(m => m.id === id); }
