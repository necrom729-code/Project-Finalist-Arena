const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

const ROOMS = new Map();

io.on('connection', (socket) => {
  socket.on('join', ({ room, name }) => {
    socket.join(room);
    socket.room = room;
    socket.name = name;

    if (!ROOMS.has(room)) {
      ROOMS.set(room, { players: [], monsters: [], items: [], doors: [] });
    }
    const roomData = ROOMS.get(room);

    roomData.players.push({
      id: socket.id,
      name,
      x: Math.random() * 40 - 20,
      z: Math.random() * 40 - 20,
      hp: 100,
      alive: true,
      heldItem: null,
      sanity: 100,
    });

    socket.emit('joined', { id: socket.id, room, name });
    io.to(room).emit('state', roomData);
  });

  socket.on('move', ({ x, z }) => {
    const roomData = ROOMS.get(socket.room);
    if (!roomData) return;
    const player = roomData.players.find((p) => p.id === socket.id);
    if (player && player.alive) {
      player.x = x;
      player.z = z;
      player.sanity = Math.max(0, player.sanity - 0.5);
    }
    io.to(room).emit('state', roomData);
  });

  socket.on('disconnect', () => {
    const roomData = ROOMS.get(socket.room);
    if (roomData) {
      roomData.players = roomData.players.filter((p) => p.id !== socket.id);
      io.to(socket.room).emit('state', roomData);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Horror game server running on port ${PORT}`);
});
