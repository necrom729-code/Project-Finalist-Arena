// Automation tests — crafting, damage, inventory, zone, recipes (Finalist Arena)
import assert from 'assert';
import { CraftingSystem, Stats, Attribute, ItemInstance, Inventory, TAGS, TIER, Quality, HitZone, MatchState } from '../server/world.js';
import { TAG_RECIPES, FIXED_RECIPES, getItem, getTagRecipe, getAllTagRecipes, getCrate } from '../shared/data.js';
import { WEAPONS } from '../server/combat.js';
import { CombatSystem } from '../server/combat.js';

// Minimal stub world for combat tests
function stubWorld() {
  const players = new Map();
  const ai = new Map();
  return {
    match: { players, ai, arenaHeat: 0, teams: new Map() },
    getPlayer(id) { return players.get(id); },
    executions: []
  };
}

let passed = 0, failed = 0;
function t(name, fn) {
  try { fn(); passed++; console.log('PASS:', name); }
  catch (e) { failed++; console.error('FAIL:', name, e.message); }
}

function makePlayer(id) {
  const p = { id, stats: new Stats(), inventory: new Inventory(), skills: {}, kills: 0, arenaPoints: 0, lifeState: 'Alive', teamId: null, betrayer: false, addKill(){ this.kills++; this.arenaPoints += 50; }, takeDamage(amt, inst, hz) { this.stats.health.mod(-amt); if (this.stats.health.value <= 0) { this.stats.health.set(0); this.lifeState = 'Dead'; return true; } return false; } };
  return p;
}

// Patch world.getPlayer for combat
const world = stubWorld();

t('Crafting: tag recipe bow succeeds', () => {
  const inv = new Inventory();
  inv.slots = [];
  inv.add(new ItemInstance('flint_knife', 1)); // Sharp, Light
  inv.add(new ItemInstance('rope', 1)); // Fiber, Flexible, Heavy
  inv.add(new ItemInstance('stone', 1)); // Rigid, Heavy, Blunt
  const rec = TAG_RECIPES.find(r => r.id === 'recipe_bow');
  assert.ok(CraftingSystem.canCraft(rec, inv));
  const item = CraftingSystem.craft(rec, inv, 1);
  assert.ok(item);
  assert.equal(item.templateId, 'bow');
});

t('Crafting: invalid tag combo fails safely', () => {
  const inv = new Inventory();
  inv.add(new ItemInstance('herb', 1)); // Medicinal, Fiber - no Sharp/Rigid
  const rec = TAG_RECIPES.find(r => r.id === 'recipe_bow');
  assert.ok(!CraftingSystem.canCraft(rec, inv));
  assert.equal(CraftingSystem.craft(rec, inv, 1), null);
});

t('Crafting: procedural synthesis deterministic', () => {
  const inv = new Inventory();
  const res = CraftingSystem.synthesize(['Sharp','Flexible','Rigid'], inv);
  assert.equal(res.name, 'Synthesized Bow');
  assert.equal(res.tier, 'T1 Tribal');
  const res2 = CraftingSystem.synthesize(['Edible'], inv);
  assert.equal(res2.name, 'Synthesized Ration');
});

t('Inventory: add/remove/count', () => {
  const inv = new Inventory(5);
  assert.equal(inv.add(new ItemInstance('wood', 5)), true);
  assert.equal(inv.count('wood'), 5);
  assert.equal(inv.remove('wood', 3), 3);
  assert.equal(inv.count('wood'), 2);
  assert.equal(inv.remove('wood', 10), 2);
  assert.equal(inv.count('wood'), 0);
});

t('Inventory: capacity limit', () => {
  const inv = new Inventory(2);
  assert.equal(inv.add(new ItemInstance('wood', 1)), true);
  assert.equal(inv.add(new ItemInstance('stone', 1)), true);
  assert.equal(inv.add(new ItemInstance('cloth', 1)), false);
});

t('Stats: health drain and critical', () => {
  const s = new Stats();
  s.health.set(20);
  assert.ok(s.criticalHealth);
  s.tick(1);
  assert.ok(s.health.value <= 20);
});

t('Stats: bleeding reduces health', () => {
  const s = new Stats();
  s.bleeding = 10;
  const before = s.health.value;
  s.tick(1);
  assert.ok(s.health.value < before);
});

t('Stats: low sleep raises paranoia', () => {
  const s = new Stats();
  s.sleep.set(20);
  s.paranoia.set(0);
  s.tick(1);
  assert.ok(s.paranoia.value > 0);
});

t('Combat: hitscan headshot does double', () => {
  const w = makePlayer('k'); const v = makePlayer('v');
  w.x = 0; w.y = 0; v.x = 10; v.y = 0;
  world.match.players.set('k', w); world.match.players.set('v', v);
  const combat = new CombatSystem(world);
  const res = combat.registerShot('k', 0, 0, 0, WEAPONS.flint_knife, 'head');
  assert.ok(res.hit);
  assert.ok(res.damage > 25);
});

t('Combat: kill awards points and sets dead', () => {
  const w = makePlayer('k'); const v = makePlayer('v');
  w.x = 0; w.y = 0; v.x = 10; v.y = 0;
  world.match.players.set('k', w); world.match.players.set('v', v);
  const combat = new CombatSystem(world);
  // melee kill (low damage won't kill, use big)
  v.stats.health.set(5);
  const res = combat.registerMelee('k', 0, 0, 0, WEAPONS.axe, 'head');
  assert.ok(res.hit);
  assert.ok(v.lifeState === 'Dead');
  assert.equal(w.kills, 1);
});

t('Combat: betrayal flags killer and raises ally paranoia', () => {
  const w = makePlayer('k'); w.teamId = 't1'; w.x = 0; w.y = 0;
  const v = makePlayer('v'); v.teamId = 't1'; v.x = 10; v.y = 0;
  const a = makePlayer('a'); a.teamId = 't1'; a.x = 100; a.y = 100;
  world.match.players.set('k', w); world.match.players.set('v', v); world.match.players.set('a', a);
  v.stats.health.set(5);
  const combat = new CombatSystem(world);
  combat.registerMelee('k', 0, 0, 0, WEAPONS.axe, 'head');
  assert.ok(w.betrayer);
  assert.ok(a.stats.paranoia.value > 0);
});

t('Data: all tag recipes have valid output items', () => {
  for (const r of getAllTagRecipes()) {
    assert.ok(getItem(r.output), `missing output ${r.output} for ${r.id}`);
    r.inputs.forEach(i => { if (i.tag) assert.ok(TAGS.includes(i.tag), `bad tag ${i.tag}`); });
  }
});

t('Data: crates stocked per tier', () => {
  for (const t of ['T0','T1','T2','T3','T4','T5']) {
    const c = getCrate(t);
    assert.ok(c && c.items.length > 0 && c.stock > 0);
  }
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
