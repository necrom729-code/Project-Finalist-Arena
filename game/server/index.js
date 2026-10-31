// Finalist Arena — Server entry point
import { World } from './world.js';
import { createNetworkServer } from './network.js';

const PORT = process.env.PORT || 8080;

const world = new World();

// Add bots for stress test (100-player target)
const BOT_COUNT = parseInt(process.env.BOT_COUNT) || 20;
world.addBot(BOT_COUNT);

// Auto-start match after short lobby
setTimeout(() => {
  world.startMatch();
  console.log(`[SERVER] Match started with ${BOT_COUNT} bots`);
}, 3000);

const wss = createNetworkServer(world, PORT);

// Game loop — fixed 30 Hz
let last = Date.now();
function loop() {
  const now = Date.now();
  const dt = (now - last) / 1000;
  last = now;
  world.update(dt);
  setImmediate(loop);
}

console.log(`[SERVER] Finalist Arena listening on ws://localhost:${PORT}`);
console.log(`[SERVER] Bots: ${BOT_COUNT} / Target 100`);
loop();
