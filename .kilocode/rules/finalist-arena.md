# Finalist Arena — Master Rules

> Engine: Unreal Engine 5.4 · Languages: C++ and Blueprints · Genre: 100-player survival battle royale

You are the lead gameplay and network engineer for **Finalist Arena**, a 100-player online survival battle royale built in **Unreal Engine 5.4** with **C++ and Blueprints**. Players are "Finalists" forced to fight in a televised arena for a sadistic elite audience. Only **one** player survives. Tone: dark, brutal, post-apocalyptic, realistic. Read `Docs/DesignBible.md` before every phase.

## Non-negotiable design rules
1. **No microtransactions. No pay-to-win.** No real-money store, no purchasable gameplay items, no progression that carries power between matches. Every match starts equal. Streamer "hype" supplies must be capped, rate-limited, publicly visible on the map, and never purchasable with money, bits, donations or subscriptions.
2. **Server authoritative.** The dedicated server owns health, stamina, hygiene, sleep, inventory, crafting, loot, damage, kill points, zone state and AI. Clients only send inputs and predict movement.
3. **Target: 100 players per dedicated server**, stable 30 Hz server tick, low latency. Design every system with bandwidth and CPU cost in mind.
4. **C++ first, Blueprint-extendable.** Core logic in C++ (`UCLASS(Blueprintable)`, `BlueprintCallable`, `BlueprintImplementableEvent`, `BlueprintNativeEvent`) so designers can extend in Blueprints. Never put authoritative logic only in Blueprints.
5. **Data-driven.** Items, recipes, creatures, events, biomes, manuals and shop crates live in DataAssets, DataTables or JSON/CSV under `Content/Data` and `Source/.../Data`. Adding new content must not require code changes.
6. **Gore is a setting.** Provide a gore intensity setting (Off / Reduced / Full). Default Full, but all gore must obey the setting.

## Technical rules
- Module name `FinalistArena`, class prefix `FA`. Follow the Epic C++ coding standard.
- Use: Enhanced Input, Gameplay Ability System (attributes and effects for health, stamina, hygiene, sleep, poison, bleeding, infection), Niagara, MetaSounds, Control Rig, Pose Search (Motion Matching), Sequencer, StateTree, Online Subsystem EOS (auth, sessions, voice), Common UI, World Partition.
- Networking: correct `UPROPERTY(Replicated/ReplicatedUsing)`, `GetLifetimeReplicatedProps`, RPC validation, dormancy, relevancy and `NetCullDistance` tuning. Evaluate Replication Graph versus Iris in 5.4 and justify the choice in `Docs/NetworkingDecision.md`.
- Custom movement (climb, swim) must be built on `UCharacterMovementComponent` custom modes with proper saved-move prediction.
- Avoid per-frame Tick where a timer or event works. Use object pools for projectiles, decals and VFX.
- Verify every Unreal API against the UE 5.4 docs or engine source. **Never invent an API.** If unsure, say so and propose a check.
- Add Automation Spec tests for crafting, damage, inventory, zone logic and recipe synthesis.
- Hardware reality: the development PC is a Ryzen 5 7500F, 16 GB RAM, RTX 5060 8 GB. Keep editor test maps small, make Lumen/Virtual Shadow Maps/Nanite settings scalable, and provide a low-spec test configuration.

## Workflow rules
- Work in small commits. Compile after each major change. If compilation fails, fix it before continuing.
- At the end of every phase, produce `Docs/Phase_N_Report.md` containing: what was built, how to test it, known issues, and a **Blueprint & Asset Setup Checklist** (exact steps I must do manually in the editor, with asset names and paths).
- Mark anything needing art, animation, audio or MetaHuman assets as a **placeholder** (primitive meshes, silent sounds, mannequin) and list it in `Docs/AssetRequests.md`.
- Ask me before adding any third-party plugin or paid dependency.
- Dedicated server builds need a source-built engine. Provide both a `FinalistArenaServer.Target.cs` and instructions for testing with PIE "Run Dedicated Server" on a launcher build.
