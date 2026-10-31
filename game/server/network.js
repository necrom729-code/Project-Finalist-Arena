// Networking layer — WebSocket server, client replication, input handling

import { WebSocketServer } from 'ws';
import { MatchState } from '../shared/constants.js';
import { CombatSystem, WEAPONS } from './combat.js';
import { Team, CraftingSystem } from './world.js';
import { TAG_RECIPES, FIXED_RECIPES } from '../shared/data.js';

export function createNetworkServer(world, port) {
  const combat = new CombatSystem(world);
  const wss = new WebSocketServer({ port });
  const clients = new Map(); // ws -> { playerId, lastPing }

  wss.on('connection', (ws, req) => {
    const clientId = 'client_' + Date.now() + '_' + Math.random().toString(36).slice(2);
    clients.set(ws, { playerId: null, lastPing: Date.now() });
    console.log(`[NET] Client connected: ${clientId}`);

    ws.on('message', (raw) => {
      let msg;
      try { msg = JSON.parse(raw); } catch { return; }
      handleMessage(ws, clientId, msg, world, combat, clients);
    });

    ws.on('pong', () => {
      const c = clients.get(ws); if (c) c.lastPing = Date.now();
    });

    ws.on('close', () => {
      const c = clients.get(ws);
      if (c && c.playerId) {
        const p = world.getPlayer(c.playerId);
        if (p) { p.lifeState = 'Dead'; p.ws = null; console.log(`[NET] Player disconnected: ${p.name}`); }
        world.match.removePlayer(c.playerId);
      }
      clients.delete(ws);
    });

    ws.on('error', () => { clients.delete(ws); });

    ws.send(JSON.stringify({ type: 'welcome', clientId, serverTick: world.tickCount, matchState: world.match.state }));
  });

  setInterval(() => {
    for (const ws of clients.keys()) {
      if (ws.readyState === 1) ws.send(JSON.stringify({ type: 'ping', t: Date.now() }));
    }
    const snapshot = world.getSnapshot();
    const payload = JSON.stringify({ type: 'state', tick: world.tickCount, ...snapshot });
    for (const ws of clients.keys()) {
      if (ws.readyState === 1) ws.send(payload);
    }
  }, 1000 / 30);

  return wss;
}

function handleMessage(ws, clientId, msg, world, combat, clients) {
  const c = clients.get(ws);
  const { type } = msg;

  switch (type) {
    case 'join': {
      const p = world.addPlayer(msg.playerId, msg.name || 'Player', ws);
      c.playerId = p.id;
      ws.send(JSON.stringify({ type: 'joined', playerId: p.id, snapshot: world.getSnapshot() }));
      console.log(`[NET] Player joined: ${p.name} (${p.id})`);
      break;
    }
    case 'input': {
      const p = world.getPlayer(c.playerId);
      if (!p || p.lifeState !== 'Alive') break;
      p.lastInput = Date.now();
      p.vx = msg.vx || 0; p.vy = msg.vy || 0;
      p.angle = msg.angle !== undefined ? msg.angle : p.angle;
      if (msg.sprint) p.stats.stamina.mod(-0.5);
      break;
    }
    case 'shoot': {
      const p = world.getPlayer(c.playerId);
      if (!p) break;
      const weapon = WEAPONS[msg.weapon] || WEAPONS.flint_knife;
      const res = combat.registerShot(c.playerId, p.x, p.y, p.angle, weapon, msg.hitZone || 'torso');
      ws.send(JSON.stringify({ type: 'shot_result', ...res }));
      break;
    }
    case 'melee': {
      const p = world.getPlayer(c.playerId);
      if (!p) break;
      const weapon = WEAPONS[msg.weapon] || WEAPONS.flint_knife;
      const res = combat.registerMelee(c.playerId, p.x, p.y, p.angle, weapon, msg.hitZone || 'torso');
      ws.send(JSON.stringify({ type: 'melee_result', ...res }));
      break;
    }
    case 'alliance_offer': {
      const target = msg.targetId;
      const targetPlayer = world.getPlayer(target);
      if (targetPlayer && targetPlayer.ws) {
        targetPlayer.ws.send(JSON.stringify({ type: 'alliance_offer', from: c.playerId, fromName: world.getPlayer(c.playerId).name }));
      }
      break;
    }
    case 'alliance_respond': {
      const offerer = msg.offererId; const accept = msg.accept;
      const offererPlayer = world.getPlayer(offerer);
      const targetPlayer = world.getPlayer(c.playerId);
      if (!offererPlayer || !targetPlayer) break;
      if (accept) {
        let team = null;
        if (!targetPlayer.teamId) {
          team = new Team('team_' + Date.now());
          world.match.teams.set(team.id, team);
          team.add(targetPlayer);
        } else {
          team = world.match.teams.get(targetPlayer.teamId);
        }
        if (team) team.add(offererPlayer);
        ws.send(JSON.stringify({ type: 'alliance_accepted', teamId: team ? team.id : null }));
        if (offererPlayer.ws) offererPlayer.ws.send(JSON.stringify({ type: 'alliance_accepted', teamId: team ? team.id : null }));
      }
      break;
    }
    case 'betray': {
      const p = world.getPlayer(c.playerId);
      if (!p || !p.teamId) break;
      p.betrayer = true;
      const team = world.match.teams.get(p.teamId);
      if (team) team.remove(p.id);
      p.teamId = null;
      for (const tp of world.match.players.values()) {
        if (tp.teamId === p.teamId && tp.id !== p.id) tp.stats.paranoia.mod(40);
      }
      ws.send(JSON.stringify({ type: 'betrayed', playerId: c.playerId }));
      break;
    }
    case 'craft': {
      const p = world.getPlayer(c.playerId);
      if (!p) break;
      const recipe = [...TAG_RECIPES, ...FIXED_RECIPES].find(r => r.id === msg.recipeId);
      if (!recipe) { ws.send(JSON.stringify({ type: 'craft_result', success: false })); break; }
      const skillLevel = p.skills[recipe.skill || 'Crafting'] || 1;
      const item = CraftingSystem.craft(recipe, p.inventory, skillLevel);
      if (item) { p.inventory.add(item); ws.send(JSON.stringify({ type: 'craft_result', success: true, item })); }
      else ws.send(JSON.stringify({ type: 'craft_result', success: false, reason: 'missing_materials' }));
      break;
    }
    case 'loot': {
      ws.send(JSON.stringify({ type: 'loot_result', success: true }));
      break;
    }
    case 'hype_chat': {
      world.hype.ingestChat(msg.message, msg.platform || 'twitch');
      break;
    }
    case 'panic': {
      world.hype.setPanic(msg.enabled);
      break;
    }
  }
}
