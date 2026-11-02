# Finalist Arena - Game Design Document

## Overview
- **Title:** Finalist Arena
- **Genre:** Survival Battle Royale / Hardcore Survival
- **Players:** 100 online multiplayer (dedicated server)
- **Win Condition:** Last person standing (1 survivor)
- **Engine:** Unreal Engine 5.4 (C++ + Blueprints)
- **Monetization:** None (no microtransactions, no pay-to-win)
- **Match Duration:** 20 minutes to 1 hour

## Premise
100 survivors are dropped into a dynamic arena. Each must craft their own tools, medicine, and supplies. Every kill grants bonus points redeemable at supply crates based on your tech level. Only one person survives. The arena is both hunter and spectacle for a sadistic elite audience streaming for views.

## Arenas (6 Biomes)
1. **Forest** - dense woodland, tree climbing, poison fog
2. **Safari** - open savannah, earthquake hazards
3. **Arctic** - frozen tundra, breaking ice, hypothermia
4. **Volcano** - ash fields, lava, meteor showers
5. **Desert** - sand dunes, heatstroke, sandstorms
6. **Unique Location** - biome-specific singular arena

Each biome shrinks differently:
- Forest: fire burning outward
- Safari: earthquake fissures
- Arctic: ice shelf breaking/collapse
- Volcano: eruption / meteor impacts
- Desert: sandstorm / heat dome
- Unique: biome-specific cataclysm

## Player Needs (Realism Systems)
- Health
- Stamina
- Hygiene
- Sleep

When any need reaches critical, performance degrades. Critical health triggers audio distortion and visual blood/gore vignette.

## Movement
- Climb trees
- Climb rock walls
- Swim
- Vault obstacles

## Combat & Animations
- Melee and ranged weapon execution animations
- Weapon-specific kill animations
- Proximity voice chat (team-based + neutral eavesdrop)
- Teams up to 8 players, betrayal allowed, only 1 winner

## Crafting System (Infinite / Procedural)
Players craft tools, medicine, weapons, armor, traps from gathered materials. Mutated animals/plants yield unique crafting components. Skill manuals found in world unlock crafting recipes and upgrade based on playstyle (e.g., Archery manual reduces miss chance, reveals weak spots).

Crafting tiers scale with tech level earned from kill points.

## Kill Points & Crates
- Each kill = bonus points
- Spend points at supply crates
- Available items depend on your tech tier

## The Zone (Shrinking Mechanic)
Each biome has a unique environmental shrink instead of generic fire. Players outside take escalating damage until HP reaches 0 = death. Materials and living beings in the shrink zone are destroyed.

## AI Threats
- Mutated animals (natural + mutated)
- Mutated humans (zombie-like, environment-adapted) - hunt players who stay too long
- Toxic waste undead

## Timed Event Wave (Every 10 Minutes)
20 unique escalating dangers, each requiring defense or avoidance:
1. Blood Tsunami (carnivore zombie fish-humans with fins, echolocation)
2. Acid Rain
3. Lightning Storm
4. Swarm of Mutated Wasps
5. Volcanic Ash Cloud (suffocation)
6. Sand Quicksand Pit Collapse
7. Arctic Blizzard (visibility zero)
8. Meteor Shower
9. Toxic Gas Vent
10. Predator Pack Alpha
11. Tree Collapse (Forest)
12. Fissure Opening (Safari)
13. Ice Shelf Calving (Arctic)
14. Lava Flow Surge (Volcano)
15. Sandstorm Wall (Desert)
16. Mutated Plant Bloom (spore explosion)
17. Radiation Pulse
18. Blood Moon (all AI aggro increased)
19. Echo Scream (paranoia/hallucination)
20. Final Circle Collapse

## Death & Spectating
- Killer gets unique death camera showing predator's victory pose
- Blood, gore, visceral impact effects
- Spectators watch; Gamemaker declares winner in cutscene
- Streamer integration: "Arena Hyped" based on chat hype (YouTube, Twitch, Facebook, TikTok); hyped players receive crate supplies

## Audio
- Main menu song: suspenseful, post-apocalyptic, spectators cheering, sadistic elite audience
- Audio distorts at critical health
- Dynamic combat layers amplify tension
- Heavy visceral impact sounds

## Skills (Manual Books)
Found manual books teach human traits/scavenged skills. Upgradable by playstyle:
- Archery: miss chance reduction, weak spot highlighting
- Stealth, Medicine, Crafting, Combat, Survival, etc.

## Technical Architecture
- Dedicated server for 100 players
- Low-latency replication
- C++ core + Blueprints for gameplay
- Optimized for RTX 5060, Ryzen 5 7500F, 16GB RAM

## Human Realism
- Realistic human avatars with facial expressions
- Keen sense / paranoia mechanic (being hunted makes players paranoid, affects perception)
- Betrayal within teams
- Looting corpses
