# Design Bible — Finalist Arena

## 1. Core loop
100 Finalists drop into one arena. They scavenge, hunt mutated creatures, craft tools and medicine, fight, ally and betray. A shrinking **Cataclysm** forces everyone inward. Kills and hunts earn **Arena Points** that buy crates matching a tech tier. Matches last **20–60 minutes**. The last survivor is crowned the **Finalist**.

## 2. Player stats (server-authoritative)
- **Health:** damage, bleeding, infection, poison. Critical at 25% (audio distorts, vision narrows).
- **Stamina:** sprint, climb, swim, melee swing, bow draw. Drains faster when cold, hot, or sleep-deprived.
- **Hygiene:** drops with sweat, blood, mud, rot and swamp water. Low hygiene raises infection chance and attracts scavengers and insects. Restored by clean water, soap-craft, rain, rivers.
- **Sleep:** drops over time. Low sleep causes blur, aim sway, micro-sleeps, hearing errors and paranoia gain. Sleeping needs shelter, a bedroll or a hideout and leaves you vulnerable.
- **Temperature, hunger, thirst:** supporting stats that interact with biomes.
- **Paranoia (0–100):** see section 9.

## 3. Realistic human characters
- Realistic humans with facial expression: fear, pain, exhaustion, rage, grief, relief, disgust. Expression driven by gameplay state (stats, danger, hits, kills, alliances).
- Use a MetaHuman-compatible skeleton and facial rig with Control Rig/pose assets. Provide LOD rules: full facial animation under 10 m, simplified at range, none beyond 60 m.
- Visible state: dirt, blood, wounds, bandages, sunburn, frost, sweat, torn clothing. All cosmetic wear driven by stats.
- No paid cosmetics. Character creator is free.

## 4. Movement
Walk, sprint, crouch, prone, jump, vault, **climb trees, rock walls, cliffs, ruins**, ledge hang, rope climb, **swim and dive** (stamina and breath), wade, slide down slopes. Climbing uses surface tags (climbable, slippery, crumbling). Noise level depends on movement type and surface and feeds AI hearing and proximity voice detection.

## 5. Combat
- **Melee:** knife, machete, axe, spear, club, bone blade, chain weapon. Light, heavy, block, parry, shove, grapple.
- **Ranged:** bow, crossbow, sling, throwing knives, javelin, blowgun, improvised firearms from late-tech crates (rare, limited ammo).
- **Hit zones:** head, torso, limbs, weak spots. Limb damage causes limping, dropped weapons, bleeding.
- **Execution animations:** unique per weapon class (grab-and-stab, neck-snap, spear pin, axe cleave, arrow to the throat at point blank). Executions require a stagger or a stealth approach and take time, so they can be interrupted.
- **Camera:** brutal, grounded, slightly weighty. Hit-stop, camera shake and heavy impact audio.
- **Skills:** see section 8.

## 6. Biomes (arena maps, one per match, voted or random)
Each biome has its own **Cataclysm** (the shrinking zone), resources, creatures and unique crafts. When the zone closes, everything outside is destroyed (items, plants, buildings, creatures). Players outside take escalating damage and can escape if they move fast. HP 0 means death.

| Biome | Cataclysm (zone shrink) | Signature resources | Signature creatures |
|---|---|---|---|
| Whispering Forest | Wildfire wall that burns trees and ground items | wood, resin, herbs, mushrooms, berries | wolves, bears, boars, mutated stag, spore-wolf |
| Savannah Safari | Earthquakes with expanding fissures and collapsing ground | grass fiber, bone, termite clay, water holes | lions, hyenas, rhinos, mutated hyena packs, giant scorpion |
| Frozen Rim (Arctic) | Falling ice shelf breaks, ice sheets sink into black water | ice, seal fat, driftwood, bone, snow moss | polar bears, wolves, orca-mutant, frost-stalker |
| Ember Caldera (Volcano) | Eruption with meteors, lava rivers, ash clouds | obsidian, sulfur, volcanic glass, charcoal | lava lizards, magma crabs, ash-wraith |
| Dune Wastes (Desert) | Sandstorm wall plus collapsing dunes and quicksand | cactus water, sand glass, scrap, hides | snakes, scorpions, vultures, sand-burrower |
| Drowned Metropolis (unique) | Rising flood plus collapsing skyscrapers | scrap, wiring, glass, cloth, canned goods | crocodiles, giant eels, Hollowed swimmers |
| Toxic Refinery (unique) | Spreading toxic sludge and chemical fire | chemicals, pipes, filters, metal | toxic-adapted Hollowed, mutant rats, acid slugs |
| Rotting Carnival (unique) | Rides collapse, glowing blight spreads from the center | wood, rope, wire, lanterns, strongman gear | clown-mask Hollowed, mutant crows, carousel beasts |

Every biome also has **dynamic hazards**: poison fog, quicksand, lava vents, thin ice, rockfalls, snares, rot pits, spore clouds, rogue lightning.

## 7. Mutation and the Hollowed
- **Mutated animals and plants** drop **Mutagen materials** (venom gland, chitin plate, spore sac, glowcap, bone-lattice, nerve silk, acid bladder, ember heart, frost marrow). Mutagens craft unique items (see section 10).
- Killing mutated animals raises the **Arena Heat** meter. When Heat is high, or the match runs long, **the Hollowed** spawn: mutated humans (zombie-like) adapted to the biome (forest: bark-skinned stalkers; arctic: frost-crawlers; volcano: ash-burnt sprinters; desert: sand-ghouls; sea: finned swimmers; refinery: toxic bloaters). They hunt players, sense sound, blood and light, and scale with time.
- **Bone Harvest event:** dead players' corpses can rise as Hollowed if not burned or looted fast.

## 8. Skills via manuals (play-style progression, per match only)
- **Manuals** are books scavenged from arena locations, graded Common/Rare/Legendary. Reading takes time and noise-free shelter is safer.
- Each manual unlocks a **trait** that levels by use: **Novice → Trained → Adept → Master**.
- Examples:
  - **Archery:** Novice = sway, long draw time, 30% miss chance on weak spots. Trained = steadier hold, bow lead indicator. Adept = wind and range compensation, weak-spot highlight. Master = quick-nock, shot-through-gap, ricochet shots.
  - **Blades, Spear, Blunt, Throwing, Traps, Herbalism and Medicine, Foraging, Fishing, Stealth, Climbing, Swimming, Fire-craft, Metalwork, Animal Tracking, Endurance, Sleep Discipline, Negotiation (better alliance offers and voice-range persuasion)**.
- XP comes from actions (shots landed, wounds treated, items crafted), so the build forms naturally from play-style. Max two Master skills per match to keep it fair.

## 9. Paranoia and Keen Sense
- **Paranoia** rises with sleep loss, being hunted, seeing allies act suspiciously (drawn weapon near you, hoarding supplies, leaving without telling you), hearing unseen footsteps, and low hygiene or illness.
- High paranoia causes: tunnel vision, whispers that are **cosmetic only** (never fake gameplay info), jittery hands, trust penalty UI on allies.
- **Keen Sense** is a perk trait (from manuals, rest, or craftable herbs). It reveals real cues: faint directional sound pings, trail marks, a subtle highlight on being watched. It must give **real** information so it is skill, not a cheat.

## 10. Crafting (infinite by design)
### 10.1 Systems
- **Material tags** on every item: `Sharp, Blunt, Flexible, Rigid, Fiber, Absorbent, Flammable, Waterproof, Toxic, Medicinal, Conductive, Insulating, Heavy, Light, Sticky, Explosive, Luminous, Mutagenic, Edible, Fermentable`.
- **Recipe types:** (a) fixed recipes, (b) **tag recipes** ("any Sharp + any Flexible + any Rigid = Bow"), (c) **procedural synthesis**: result quality, damage, durability and side effects are computed from combined material properties, so nearly any sensible combo works.
- **Discovery:** experimenting at a crafting spot reveals new recipes. Manuals and notes unlock recipe families.
- **Quality:** Crude, Standard, Fine, Masterwork, depending on skill, tools and material rating.
- **Tech tiers:** T0 Primitive, T1 Tribal, T2 Survivalist, T3 Salvage, T4 Arena-Tech (crate only), T5 Gamemaker Relics (very rare crate, strong but loud).
- **Stations:** hands, campfire, workbench, forge, still, herb table, salvage bench.
- **Infinite expansion rule:** when asked, generate 30 new recipes per category from the tag system and add them to `Content/Data/Recipes` without code changes.

### 10.2 Starter crafting ideas (extend infinitely)
**Tools:** stone axe, flint knife, bone needle, fishing spear, fish trap, bow drill, hand drill, torch, lantern, rope, net, grappling hook from hook and rope, climbing spikes, ice picks, snow shoes, sled, raft, kayak, shovel, whistle, signal mirror, compass from magnet and needle, water filter, canteen, bark bucket, sling pouch, backpack, binoculars from lens set, snare kit.
**Weapons:** sharpened stick spear, fire-hardened spear, bow, recurve bow, crossbow, sling, bola, throwing knives, atlatl, blowgun with poison darts, club with spikes, bone machete, obsidian blade, chain flail, shield from planks or hide, tripwire spike trap, bear trap, pit trap, rock-fall trap, fire-bomb from flammable oil, smoke bomb, flash powder, acid flask, arrow variants (flint, bone, fire, poison, net, whistle, tracker).
**Medicine and sanitation:** bandage from cloth, tourniquet, splint, poultice from herbs, antiseptic from alcohol and honey, antivenom from venom gland, painkiller tea, fever tea, charcoal anti-toxin, sleep-aid herb, stimulant brew, soap from fat and ash, disinfection kit, sutures from nerve silk, burn gel from aloe, frostbite salve, mushroom antidote, cleansing steam hut.
**Food and water:** boiled water, solar still, snow melt, cactus water, smoked meat, jerky, bone broth, roasted roots, fish stew, berry cakes, energy paste, fermented drink (risky), insect protein.
**Shelter and survival:** lean-to, debris hut, snow cave, bedroll, hammock in trees, treehouse platform, camouflage net, ghillie suit, campfire pit, smoke-less fire, hidden stash, barricade, watchtower, rope bridge, decoy dummy, alarm clacker line.
**Clothing and armor:** hide vest, bark armor, bone-plate armor, scale armor from fish scales, insulated coat, frost boots, desert robe, gas mask from charcoal and cloth, ash mask, gloves for climbing, boots with spikes, fire-resist cloak, wet-cloth fire shield.
**Mutagen crafts:** neurotoxin arrowheads (venom gland), chitin plate armor, spore bombs (spore sac), glowcap flares and light markers, bone-lattice bow (strong, silent), nerve-silk rope (unbreakable climbing), acid-bladder grenades, ember-heart torch (never goes out, attracts Hollowed), frost-marrow cooling cloak, mutant pheromone lure, predator-scent mask (animals ignore you briefly), regeneration salve (risk: mutation sickness).
**Arena-tech from crates (Tier 4–5):** thermal scope, drone scout (limited), emergency flare gun, taser trap, EMP pulse, glider kite, rebreather, tracker dart, gamemaker beacon.

## 11. Arena Points, crates and hype-ready supply drops
- **Arena Points:** player kill, mutated animal kill, apex kill, successful rescue, heal of ally, surviving a timed event, escaping the zone.
- **Provision Crates** (sky pods and fixed depots) sell items by **tech tier you need**. Stock is limited per match. Crates are visible on the map and can be contested and looted.
- **Hype Supplies:** see section 12.
- **Looting:** loot bodies, crates, ruins, camps, wrecks, caves. Looting takes time and is interruptible. Bodies show the cause of death.

## 12. Streamer "Arena Hype" system
- Optional **Streamer Mode** (OAuth link to YouTube, Twitch, Facebook, TikTok and others via an `IChatProvider` interface; use only official APIs or approved third-party APIs and follow each platform's terms).
- A backend **Hype Service** measures chat velocity compared to baseline, unique chatters, emotes and clip-worthy moments detected in-game (multikills, clutch escapes, betrayals, predator close calls). Hype tiers: Murmur, Buzz, Roar, Frenzy.
- Hype unlocks **Spectator Gifts**: a small supply drop for that streamer, announced to the whole arena so others can contest it. **Caps:** cooldown, per-match limit, small value, no weapons above the current tier. Nothing is purchasable. No donation, bit, sub or cash ever feeds hype.
- Chat can also take part in an **Audience Vote** timed event (see section 13, event 20), with the vote result capped to prevent abuse.
- Abuse controls: bot-detection, per-account weighting, server-side validation, panic switch to disable the system.

## 13. Timed events (pool of 20; each match draws 3–6 by length, one about every 10 minutes)
Each event has: warning stinger, a Gamemaker announcement, duration, a "survive/avoid" objective and a "defend" option.
1. **Blood Tsunami:** a wave of blood sweeps in with **Finfeasters**, carnivorous fish fused with zombie humans that have fins and sense vibrations and blood. Climb high, stay still, or fight on rooftops and trees.
2. **Ashfall Whiteout:** visibility collapses, lungs fill. Needs a mask or you cough and reveal yourself.
3. **Greenveil Poison Fog:** rolling toxic fog and spore life. Filters and high ground help.
4. **Stampede of Titans:** mutated herds charge across the map in lanes. Dodge, climb or redirect them with fire and noise.
5. **Hollow Night:** eternal dark and a Hollowed horde. Light attracts them, darkness hides you.
6. **Locust Rain:** insect swarms strip stamina and hygiene. Smoke and fire repel them.
7. **Sinkhole Cascade:** ground collapses in rings and drops players into caves with hazards and loot.
8. **Magnetic Storm:** HUD noise, compasses spin, electric arcs hit metal weapons and armor.
9. **Gamemaker's Feast:** a rich loot cache spawns at the center to bait players into a bloodbath.
10. **Rotting Rain:** acid rain corrodes gear durability and drops hygiene fast. Shelter or cloaks needed.
11. **Predator Release:** the Gamemaker frees an apex mutant that hunts the top kill-point players.
12. **Plague Bloom:** spore plants infect. Needs cures, hygiene and isolation.
13. **Flash Flood:** rapid rising water forces swimming and climbing. Rafts become valuable.
14. **Wildfire Wheel:** a rotating wall of flame sweeps the map.
15. **Echo Hunters:** blind mutants hunt by sound. **Proximity voice chat noise attracts them**, so teams must whisper or stay silent.
16. **Meteor Storm:** meteors rain with impact craters and shock waves.
17. **Frozen Silence:** blizzard, hypothermia, ice storms. Fire and insulation decide who lives.
18. **Tar Mire:** sticky tar rises, slows movement and traps loot and bodies.
19. **Bone Harvest:** corpses rise as Hollowed unless burned or looted fast.
20. **Audience Vote:** spectators (via hype and chat) pick one of two hazards. The Gamemaker teases the choice on screen.

## 14. Teams, alliances, betrayal, voice
- Anyone can offer an **alliance** (hands-up gesture plus prompt). The other player accepts or refuses. **Teams up to 8.** Friendly fire is ON.
- **Proximity voice chat for everyone** (positional audio). When accepted as teammates, a **team channel** opens. Neutral players nearby can still hear someone asking to join.
- Betrayal is allowed: a teammate can kill another. Teammate kill gives points but triggers Paranoia on remaining allies and a public "Betrayer" mark visible only to the audience (and revealed to the team when it happens).
- Only one player wins. When teammates remain at the end, the Gamemaker forces a final duel.

## 15. Death cameras, gore, audio
- **Death cam:** when a player is killed by an animal, mutant or Hollowed, show the **predator's victory camera** (slow-mo orbit, snarl, feeding). After that, free spectate.
- **Gore:** blood decals, wound meshes, arterial sprays, dismemberment-lite (limbs) governed by the gore setting. Niagara blood, bone shards, mud and ash.
- **Audio:** heavy visceral impacts, wet hits, bone cracks, strained breathing, heartbeat. **Dynamic music layers** (ambient → tension → combat → critical). **Audio distorts at critical health** (low-pass, pitch warp, heartbeat dominant, tinnitus).
- **Main menu song:** suspenseful and post-apocalyptic, with a distant crowd cheering like a glorified spectacle that sounds sinister (see `Docs/MusicBrief.md`).

## 16. Spectators, Gamemaker and cutscenes
- A sadistic elite audience watches in a luxurious tower. The **Gamemaker** (calm, theatrical) announces events and kills.
- **Victory cutscene** (Sequencer, short): spectators stand and applaud, camera pushes on the survivor, the Gamemaker says "You are the Finalist. You have survived." then stats and Arena Points summary.
- **Intro cutscene:** the countdown, platform rise, cheers. Skippable.

## 17. Tutorial
**Training Hall**: a solo or bot-filled practice arena guided by the Gamemaker. Steps: move, climb, swim → gather → craft → stats (health, stamina, hygiene, sleep) → loot → manuals → combat (melee, ranged, execution) → crates and Arena Points → alliances and voice → the Cataclysm and timed events. Skippable and replayable.

## 18. Technical targets
- 100 players, dedicated servers, server tick 30 Hz, client 60 FPS target on mid-range PCs, scalable settings.
- Bandwidth budget per client in `Docs/NetworkBudget.md`. Significance-based tick and net update frequency for players, AI and props.
- Anti-cheat: server authority, input validation, EOS Anti-Cheat integration.
- Matchmaking, lobby, region selection, server fleet autoscaling (Agones, Multiplay or GameLift: ask me which).
