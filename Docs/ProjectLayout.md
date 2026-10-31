# Finalist Arena — Project Layout

## Root
- `FinalistArena.uproject` — project descriptor, plugin list
- `.gitignore` — Unreal Engine ignore rules
- `.kilocode/rules/finalist-arena.md` — master rules (PART 1)
- `AGENTS.md` (optional) — task instructions

## Source
`Source/FinalistArena/` — game module (class prefix `FA`)
  - `FinalistArena.Build.cs` — module build rules
  - `FinalistArena.h/.cpp` — module entry point
  - `Core/` — GameMode, GameState, PlayerState, PlayerController, match state machine
  - `Character/` — player character, custom movement modes (climb, swim, vault, prone), saved moves
  - `Combat/` — weapons, hit zones, damage, executions
  - `Survival/` — GAS attributes/effects (health, stamina, hygiene, sleep, temperature, hunger, thirst, paranoia), bleeding/infection/poison
  - `Items/` — item base, tags, tiers, durability, quality
  - `Crafting/` — recipes, stations, tag recipes, procedural synthesis
  - `World/` — Cataclysm/zone controller, biomes, dynamic hazards
  - `AI/` — StateTree animals/mutants/Hollowed, perception, Arena Heat
  - `Events/` — timed event director, 20-event pool assets
  - `Social/` — alliances, teams, betrayal, paranoia, proximity voice integration
  - `Audio/` — MetaSounds, dynamic music layers, critical-health distortion
  - `UI/` — Common UI HUD, menus, lobby
  - `Online/` — EOS integration, auth, sessions, `IChatProvider`, Hype Service client
  - `Data/` — DataAssets, DataTables, CSV/JSON content

## Content
`Content/Data/` — DataAssets, DataTables, recipes, biomes, crates, manuals
`Content/Blueprints/` — Blueprint-extendable subclasses of C++ base classes
`Content/Maps/` — Training Hall, biome maps, test maps

## Tools
`Tools/GenerateRecipes/` — recipe generator commandlet/tool

## Docs
- `Docs/DesignBible.md` — PART 2 design bible
- `Docs/ProjectLayout.md` — this file
- `Docs/BuildInstructions.md` — build & run instructions
- `Docs/NetworkingDecision.md` — Replication Graph vs Iris decision
- `Docs/NetworkBudget.md` — per-client bandwidth budget
- `Docs/HypeIntegration.md` — streamer hype platform API/ToS notes
- `Docs/MusicBrief.md` — main menu song brief
- `Docs/AssetRequests.md` — placeholder asset list
- `Docs/PerformanceReport.md` — optimization & soak test results
- `Docs/Phase_N_Report.md` — per-phase reports

## Binaries/Build/Intermediate/Saved
Standard Unreal build outputs (gitignored).
