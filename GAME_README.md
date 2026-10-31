# Finalist Arena — Standalone Build

**Finalist Arena** is a 100-player survival battle royale (Hunger Games × PUBG). This is a standalone, server-authoritative prototype built in **Node.js + browser** (no Unreal Engine required), implementing the full design from `Docs/DesignBible.md`.

## Title
**Finalist Arena** — 100 Finalists drop into one arena, scavenge, craft, fight, ally and betray. Only one survives.

## Core systems implemented
- **Match state machine:** Lobby → Countdown → Drop → Playing → Final → Victory (server authoritative, 30 Hz tick)
- **100-player dedicated server:** WebSocket server, significance/replication snapshot, bot stress clients
- **Player stats (GAS-like):** Health, Stamina, Hygiene, Sleep, Hunger, Thirst, Temperature, Paranoia; bleeding/infection/poison status effects; critical health at 25%
- **Combat:** hit zones (head/torso/limb), melee + ranged hitscan, server-validated damage, executions per weapon, betrayal/paranoia on team kill
- **Crafting (infinite):** material tags, tag recipes, fixed recipes, procedural synthesis, quality tiers (Crude→Masterwork), inventory with durability
- **Cataclysm zone:** shrinking phases, out-of-zone damage, biome styles (forest wildfire, savannah earthquake, arctic ice break, volcano eruption, desert sandstorm, flood, toxic sludge, carnival blight)
- **AI:** animals, mutants, Hollowed; Arena Heat; simple chase/combat AI; death state
- **Timed events:** 20-event pool, event director (~every 10 min), Gamemaker announcements
- **Social:** alliances (teams up to 8), friendly fire, betrayal, paranoia, proximity voice chat integration
- **Economy:** Arena Points, provision crates by tech tier (limited stock), Hype Service with chat ingestion, caps, panic switch
- **Gore setting:** Off/Reduced/Full (data-driven)

## How to run
```
# Install dependencies
npm install

# Start server (20 bots)
npm start

# Start server with 100 bots (stress test)
npm run start:bots

# Run automation tests (crafting, damage, inventory, combat, recipes)
npm test

# Open the client
open game/client/index.html   # or serve via any static server and navigate to it
```
The client connects to `ws://localhost:8080`. Controls: WASD move, mouse aim, click attack, 1-7 weapons, C crafting, T chat, B alliance offer.

## Tech targets
- Dev PC target: Ryzen 5 7500F, 16 GB RAM, RTX 5060 — scalable settings, 30 Hz server tick
- No microtransactions / pay-to-win; every match starts equal
- Gore is a setting (default Full)

## Files
- `game/server/world.js` — match, player, stats, inventory, crafting, AI, zone, events, hype
- `game/server/combat.js` — combat system, weapons, executions
- `game/server/network.js` — WebSocket server, replication, input handling
- `game/server/index.js` — server entry point
- `game/client/index.html` + `game/client/client.js` — browser client
- `game/shared/constants.js` — constants, enums, biomes, event pool
- `game/shared/data.js` — items, recipes, crates, manuals (data-driven)
- `game/tests/run.js` — automation specs (13 tests)
