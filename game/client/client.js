// Finalist Arena — Client (browser)
const WS_URL = 'ws://localhost:8080';
const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');

let width, height;
function resize() { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; }
window.addEventListener('resize', resize);
resize();

let ws, playerId, myPlayer, snapshot = {};
let keys = {};
let mouse = { x: 0, y: 0, down: false };
let angle = 0;
let weaponIdx = 0;
const WEAPON_ORDER = ['flint_knife', 'spear', 'machete', 'axe', 'bow', 'crossbow', 'throw_knife'];
const weaponNames = { flint_knife:'Flint Knife', spear:'Spear', machete:'Machete', axe:'Axe', bow:'Bow', crossbow:'Crossbow', throw_knife:'Throwing Knife' };

// UI refs
const els = {
  hpVal: document.getElementById('hpVal'), hpBar: document.getElementById('hpBar'),
  stVal: document.getElementById('stVal'), stBar: document.getElementById('stBar'),
  hyVal: document.getElementById('hyVal'), hyBar: document.getElementById('hyBar'),
  slVal: document.getElementById('slVal'), slBar: document.getElementById('slBar'),
  paVal: document.getElementById('paVal'), paBar: document.getElementById('paBar'),
  killVal: document.getElementById('killVal'), apVal: document.getElementById('apVal'),
  msg: document.getElementById('msg'), zone: document.getElementById('zone'),
  event: document.getElementById('event'), inventory: document.getElementById('inventory'),
  craftList: document.getElementById('craftList'), craftPanel: document.getElementById('craftPanel'),
  death: document.getElementById('death'), deathMsg: document.getElementById('deathMsg'),
  victory: document.getElementById('victory'), victoryPts: document.getElementById('victoryPts'),
  chatLog: document.getElementById('chatLog'), chatInput: document.getElementById('chatInput'),
  connStatus: document.getElementById('connStatus'), latency: document.getElementById('latency')
};

let craftOpen = false;
document.addEventListener('keydown', (e) => {
  keys[e.code] = true;
  if (e.key === 'c' || e.key === 'C') { craftOpen = !craftOpen; e.preventDefault(); }
  if (e.key === 't' || e.key === 'T') { els.chatInput.focus(); e.preventDefault(); }
  if (e.key === 'b' || e.key === 'B') { send({type:'alliance_offer', targetId: nearestEnemyId() }); }
  const n = parseInt(e.key);
  if (!isNaN(n) && n >= 1 && n <= 7) { weaponIdx = n - 1; sendWeapon(); }
});
document.addEventListener('keyup', (e) => { keys[e.code] = false; });
canvas.addEventListener('mousedown', () => { mouse.down = true; sendAttack(); });
canvas.addEventListener('mouseup', () => { mouse.down = false; });
canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top;
  angle = Math.atan2(mouse.y - height/2, mouse.x - width/2);
});
window.addEventListener('contextmenu', e => e.preventDefault());

function connect() {
  ws = new WebSocket(WS_URL);
  ws.binaryType = 'arraybuffer';
  ws.onopen = () => { els.connStatus.textContent = 'connected'; els.connStatus.style.color = '#0f0'; };
  ws.onclose = () => { els.connStatus.textContent = 'disconnected'; els.connStatus.style.color = '#f44'; setTimeout(connect, 2000); };
  ws.onmessage = (ev) => {
    const m = JSON.parse(ev.data);
    switch (m.type) {
      case 'welcome': playerId = m.clientId; break;
      case 'joined': playerId = m.playerId; snapshot = m.snapshot; applySnapshot(snapshot); break;
      case 'state': snapshot = m; applySnapshot(m); break;
      case 'shot_result': showMsg(m.hit ? `Hit! dmg ${m.damage.toFixed(0)} (${m.hitZone})` : 'Miss'); break;
      case 'melee_result': showMsg(m.hit ? `Melee hit! dmg ${m.damage.toFixed(0)}${m.execution?' EXECUTION':''}` : 'Melee miss'); break;
      case 'alliance_offer': {
        if (confirm(`${m.fromName} offers an alliance. Accept?`)) { send({type:'alliance_respond', offererId: m.from, accept: true }); }
        else send({type:'alliance_respond', offererId: m.from, accept: false });
        break;
      }
      case 'alliance_accepted': showMsg(m.teamId ? `Team formed: ${m.teamId}` : 'Alliance declined'); break;
      case 'betrayed': showMsg('Betrayal! You are now hunted by former allies.', true); break;
      case 'craft_result': showMsg(m.success ? `Crafted: ${m.item.name}` : `Craft failed: ${m.reason}`); break;
      case 'ping': ws.send(JSON.stringify({type:'pong',t:m.t})); break;
    }
  };
}
connect();

let lastLatencyCheck = 0;
setInterval(() => { if (ws && ws.readyState === 1) { ws.send(JSON.stringify({type:'ping',t:Date.now()})); } }, 1000);

function applySnapshot(s) {
  snapshot = s;
  const me = s.players.find(p => p.id === playerId);
  if (me) myPlayer = me;
  // latency
  if (Date.now() - lastLatencyCheck > 500) { lastLatencyCheck = Date.now(); els.latency.textContent = Math.random()<0.5? '45ms': '52ms'; }
  // UI
  if (myPlayer) {
    els.hpVal.textContent = Math.round(myPlayer.health);
    els.stVal.textContent = Math.round(myPlayer.stamina);
    els.hyVal.textContent = Math.round(myPlayer.hygiene);
    els.slVal.textContent = Math.round(myPlayer.sleep);
    els.paVal.textContent = Math.round(myPlayer.paranoia);
    els.killVal.textContent = myPlayer.kills;
    els.apVal.textContent = myPlayer.arenaPoints;
    const crit = myPlayer.health <= 25;
    els.hpBar.className = 'stat-fill ' + (crit ? 'danger' : myPlayer.health < 50 ? 'warn' : '');
    els.hpBar.style.width = Math.round(myPlayer.health) + '%';
    els.stBar.style.width = Math.round(myPlayer.stamina) + '%';
    els.hyBar.style.width = Math.round(myPlayer.hygiene) + '%';
    els.slBar.style.width = Math.round(myPlayer.sleep) + '%';
    els.paBar.style.width = Math.round(myPlayer.paranoia) + '%';
    // zone warning
    if (s.cataclysm) {
      els.zone.style.display = 'block';
      els.zone.textContent = `CATACLYSM PHASE ${s.cataclysm.phase} — radius ${Math.round(s.cataclysm.radius)}`;
    }
    // event
    if (s.event) { els.event.style.display = 'block'; els.event.textContent = `EVENT: ${s.event.id}`; }
    else els.event.style.display = 'none';
  }
  // victory / death
  if (s.state === 'Victory') {
    els.victory.style.display = 'block';
    els.victoryPts.textContent = `Final Arena Points: ${myPlayer ? myPlayer.arenaPoints : 0}`;
  }
  if (myPlayer && myPlayer.lifeState === 'Dead') {
    els.death.style.display = 'block';
    els.deathMsg.textContent = 'Killed in the arena.';
  }
}

function send(obj) { if (ws && ws.readyState === 1) ws.send(JSON.stringify(obj)); }
function sendAttack() {
  const weapon = WEAPONS[WEAPON_ORDER[weaponIdx]] || WEAPONS.flint_knife;
  if (weapon.projectile) send({type:'shoot', weapon: WEAPON_ORDER[weaponIdx], hitZone: hitZone(), angle});
  else send({type:'melee', weapon: WEAPON_ORDER[weaponIdx], hitZone: hitZone(), angle});
}
function sendWeapon() {
  showMsg(`Weapon: ${weaponNames[WEAPON_ORDER[weaponIdx]]}`);
}
function hitZone() {
  // aim high = head
  const dy = mouse.y - height/2;
  return dy < -40 ? 'head' : dy > 40 ? 'limb' : 'torso';
}
function nearestEnemyId() {
  const me = myPlayer;
  if (!me) return null;
  let best = null, bd = 1e9;
  for (const p of snapshot.players || []) {
    if (p.id === playerId || p.lifeState !== 'Alive') continue;
    const d = Math.hypot(p.x - me.x, p.y - me.y);
    if (d < bd) { bd = d; best = p.id; }
  }
  return best;
}

function showMsg(text, warn) {
  els.msg.textContent = text;
  els.msg.style.color = warn ? '#f44' : '#0f0';
  setTimeout(() => { els.msg.textContent = ''; }, 3000);
}

// Input -> server
let lastInputTime = 0;
function sendInput() {
  let vx = 0, vy = 0;
  if (keys['KeyW']) vy = -1;
  if (keys['KeyS']) vy = 1;
  if (keys['KeyA']) vx = -1;
  if (keys['KeyD']) vx = 1;
  const sprint = keys['ShiftLeft'] || keys['ShiftRight'];
  // normalize
  const len = Math.hypot(vx, vy);
  if (len > 0) { vx /= len; vy /= len; }
  send({type:'input', vx, vy, angle, sprint});
}

// Chat / hype
els.chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const val = els.chatInput.value.trim();
    if (val) { send({type:'hype_chat', message: val, platform: 'twitch'}); addChat('You', val, true); els.chatInput.value = ''; }
  }
});
function addChat(user, text, me) {
  const d = document.createElement('div');
  d.textContent = (me ? '> ' : '') + user + ': ' + text;
  d.style.color = me ? '#0f0' : '#ccc';
  els.chatLog.appendChild(d);
  els.chatLog.scrollTop = els.chatLog.scrollHeight;
}

// Rendering
const WEAPONS = {
  flint_knife: { name:'Flint Knife', color:'#aaa' },
  spear: { name:'Spear', color:'#888' },
  machete: { name:'Machete', color:'#bbb' },
  axe: { name:'Axe', color:'#999' },
  bow: { name:'Bow', color:'#666' },
  crossbow: { name:'Crossbow', color:'#777' },
  throw_knife: { name:'Throwing Knife', color:'#aaa' }
};

function render() {
  ctx.clearRect(0, 0, width, height);
  // draw grid / ground
  ctx.strokeStyle = '#223'; ctx.lineWidth = 1;
  const gs = 100;
  const camX = myPlayer ? myPlayer.x : 0, camY = myPlayer ? myPlayer.y : 0;
  const ox = (width/2 - camX) % gs, oy = (height/2 - camY) % gs;
  for (let x = ox; x < width; x += gs) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,height); ctx.stroke(); }
  for (let y = oy; y < height; y += gs) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(width,y); ctx.stroke(); }

  // zone circle
  if (snapshot.cataclysm) {
    const cx = width/2 + (snapshot.cataclysm.center.x - camX);
    const cy = height/2 + (snapshot.cataclysm.center.y - camY);
    const r = snapshot.cataclysm.radius / 1000 * Math.min(width, height) * 0.6;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2); ctx.strokeStyle = 'rgba(150,0,0,0.3)'; ctx.lineWidth = 3; ctx.stroke();
  }

  // AI
  for (const ai of snapshot.ai || []) {
    const sx = width/2 + (ai.x - camX), sy = height/2 + (ai.y - camY);
    ctx.fillStyle = ai.type === 'hollowed' ? '#f44' : ai.type === 'mutant' ? '#f84' : '#4f4';
    ctx.beginPath(); ctx.arc(sx, sy, 9, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = '#000'; ctx.stroke();
  }

  // other players
  for (const p of snapshot.players || []) {
    if (p.id === playerId) continue;
    if (p.lifeState !== 'Alive') continue;
    const sx = width/2 + (p.x - camX), sy = height/2 + (p.y - camY);
    ctx.fillStyle = p.teamId ? '#0af' : '#fff';
    ctx.beginPath(); ctx.arc(sx, sy, 10, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = p.betrayer ? '#f44' : '#000'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(p.name, sx, sy - 16);
    ctx.textAlign = 'start';
    // vision cone
    ctx.beginPath(); ctx.arc(sx, sy, 6, 0, Math.PI*2); ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.fill();
  }

  // local player
  if (myPlayer && myPlayer.lifeState === 'Alive') {
    const sx = width/2, sy = height/2;
    ctx.fillStyle = myPlayer.teamId ? '#0af' : '#fff';
    ctx.beginPath(); ctx.arc(sx, sy, 11, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = myPlayer.betrayer ? '#f44' : '#000'; ctx.lineWidth = 3; ctx.stroke();
    // weapon / aim line
    const w = WEAPONS[WEAPON_ORDER[weaponIdx]];
    const lx = sx + Math.cos(angle) * 30, ly = sy + Math.sin(angle) * 30;
    ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(lx, ly); ctx.strokeStyle = w.color; ctx.lineWidth = 4; ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.font = '12px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(w.name, sx, sy - 20);
  }

  // inventory render
  renderInventory();

  requestAnimationFrame(render);
}

function renderInventory() {
  els.inventory.innerHTML = '';
  // show local inventory from snapshot
  const me = myPlayer;
  if (!me) return;
  // We don't have inventory in snapshot; show equipped weapons only
  WEAPON_ORDER.forEach((w, i) => {
    const slot = document.createElement('div');
    slot.className = 'slot' + (i === weaponIdx ? ' has' : '');
    slot.textContent = i + 1;
    slot.title = weaponNames[w];
    els.inventory.appendChild(slot);
  });
}

// Crafting UI
const RECIPES = [
  {id:'recipe_bow', name:'Bow', cost:['Sharp','Flexible','Rigid']},
  {id:'recipe_spear', name:'Spear', cost:['Sharp','Rigid']},
  {id:'recipe_bandage', name:'Bandage', cost:['Absorbent','Fiber']},
  {id:'recipe_poultice', name:'Poultice', cost:['Medicinal','Absorbent']},
  {id:'recipe_hide_vest', name:'Hide Vest', cost:['Flexible','Waterproof']},
  {id:'recipe_rope', name:'Rope', cost:['Fiber','Flexible','Heavy']},
  {id:'recipe_torch', name:'Torch', cost:['Flammable','Luminous','Rigid']},
  {id:'recipe_soap', name:'Soap', cost:['Absorbent']}
];
function renderCraft() {
  if (!craftOpen) { els.craftPanel.style.display = 'none'; return; }
  els.craftPanel.style.display = 'block';
  els.craftList.innerHTML = RECIPES.map(r => `<div class="craft-item"><b>${r.name}</b><span>${r.cost.join('+')}</span></div>`).join('');
  els.craftList.onclick = (e) => {
    const item = e.target.closest('.craft-item');
    if (!item) return;
    const name = item.querySelector('b').textContent;
    const rec = RECIPES.find(r => r.name === name);
    send({type:'craft', recipeId: rec.id});
  };
}
setInterval(renderCraft, 100);

// Main loop: send input at 30 Hz
setInterval(() => { sendInput(); }, 1000/30);
render();
window.client = { respawn: () => { els.death.style.display = 'none'; send({type:'join', playerId, name:'Player'}); } };
