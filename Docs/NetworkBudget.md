# Network Budget — Finalist Arena

## Target
- 100 players per dedicated server
- 30 Hz server tick
- Clients: 60 FPS target (mid-range PC)

## Per-client bandwidth budget (goal)
| Direction | Budget | Notes |
|-----------|--------|-------|
| Downlink (server→client) | ~60–90 KB/s | state, movement, combat, zone, audio cues |
| Uplink (client→server) | ~15–25 KB/s | input, voice (compressed) |

## Significance & NetUpdateFrequency
- Local player: 30 Hz, always relevant
- Teammates / nearby players (< 100 m): 15–30 Hz
- Distant players (> 200 m): 5 Hz or dormant
- AI animals: 5–10 Hz, cull beyond relevance distance
- Props/loot: dormant until relevant, then low frequency

## Replication Graph tuning
- `NetCullDistance`: 15000 UU for players, 8000 UU for props, 6000 UU for loot
- Use `SetRelevancy` and `IsNetRelevantFor` to skip out-of-zone actors
- Dormant actors that leave the Cataclysm zone

## Voice
- Proximity voice compressed (Opus), only to players within hearing range
- Team channel: full-duplex to teammates only

## Measurement
Run the 100-bot soak test (Phase 1) and record `stat net` / `stat replicationgraph` per client. Log results in `Docs/PerformanceReport.md`.
