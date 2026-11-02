# Finalist Arena - Dedicated Server Architecture

## Overview
- 100-player online multiplayer matches
- Dedicated server (headless Linux build) for authoritative gameplay
- C++ core for performance-critical systems (movement, combat, replication)
- Blueprints for gameplay logic, UI, and biome-specific events

## Network Model
- Server-authoritative: server validates all movement, combat, crafting, zone state
- Client-side prediction for movement and shooting (low latency feel)
- Interest management: players only replicate data for nearby actors (cull distance)
- Replication graph for 100-player scalability

## Server Build
- Target: `Server` (headless, no renderer)
- Tick rate: 30-60 Hz
- Use Unreal's Dedicated Server executable

## Client Build
- Target: `Game` or `Editor`
- Optimized for RTX 5060 / Ryzen 5 7500F / 16GB RAM

## Scalability Strategies
- Level streaming: load/unload biome chunks dynamically
- Occlusion culling: don't render what's not visible
- LODs: mesh and texture LODs for distance
- Niagara particle limits: cap max particles for gore/weather
- Audio concurrency limits: prioritize nearby sounds

## Low Latency
- Enable TCP/UDP socket tuning
- Use Unreal's network profiling tools
- Proximity voice chat uses compressed audio with distance attenuation

## Match Flow (Server)
1. Pre-match lobby (100 players)
2. Drop into arena biome
3. Match in progress: needs decay, zone shrinks, event waves every 10 min
4. Kill points awarded, crates restock based on tech tier
5. Last survivor wins → Gamemaker cutscene → return to lobby

## No Monetization
- No microtransactions
- No pay-to-win
- All progression via in-game manuals and kill points
