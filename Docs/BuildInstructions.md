# Build Instructions — Finalist Arena

## Prerequisites
- Unreal Engine 5.4 source-built (source-built engine required for dedicated server targets).
- Windows + Visual Studio 2022 (or Linux with Clang for server builds).
- Git LFS recommended for binary assets.

## Generate project files
1. Right-click `FinalistArena.uproject` → "Generate Visual Studio project files", or run:
   ```
   {UE_ROOT}/Build/BatchFiles/RunUAT.bat GenerateProjectFiles -Project="FinalistArena.uproject"
   ```
2. Open `FinalistArena.sln` in Visual Studio 2022.

## Build targets
- `FinalistArenaEditor` — editor (Win64 Development)
- `FinalistArenaClient` — client build (Win64)
- `FinalistArenaServer` — dedicated server (Win64 or Linux)

### Server build
```
{UE_ROOT}/Engine/Build/BatchFiles/RunUAT.bat BuildCookRun -project="FinalistArena.uproject" -target="FinalistArenaServer" -platform=Win64 -server -noconsole -build -cook -stage -pak
```

## Running
### PIE with dedicated server + 4 clients
1. Open the editor.
2. Set "Number of Players" to 5 (1 server + 4 clients) in Play settings.
3. Click the dropdown on Play → "Run Dedicated Server".
4. Observe server window + 4 client windows.

### Dedicated server standalone
Run the cooked server binary with the desired map:
```
FinalistArenaServer.exe /Game/Maps/TestMap -log
```

### Low-spec test configuration
See `Config/DefaultServer.ini` (Lumen/VSM/Nanite disabled, fixed 30 Hz frame rate).

## Verification
- Phase 0 acceptance: Editor target compiles cleanly in Visual Studio.
- Run `FinalistArenaEditor` target and confirm the module loads without errors.
