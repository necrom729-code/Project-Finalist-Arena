# Finalist Arena - Hardware Optimization Notes

## Target Hardware
- **CPU:** AMD Ryzen 5 7500F 6-Core (3.70 GHz)
- **GPU:** NVIDIA GeForce RTX 5060 (8 GB VRAM)
- **RAM:** 16.0 GB (15.6 GB usable)
- **Storage:** ~180 GB free

## Recommended UE 5.4 Settings for This Hardware

### Scalability (Engine.ini)
```
[SystemSettings]
r.Shadow.MaxCSMCascades=4
r.Shadow.RadiusThreshold=0.03
r.Shadow.DistanceScale=1.0
r.Shadow.MaxResolution=2048
r.Lumen.MaxTraceDistance=5000.0
r.Lumen.Scene.FireflyThreshold=0.01
r.VolumetricFog.GridPixelSize=8
r.MotionBlurQuality=0
r.PostProcessAAQuality=3
r.TextureStreaming=1
r.TexturePoolSize=2048
```

### Memory Management
- 16 GB RAM is sufficient for UE 5.4 dedicated server + client on one machine for testing
- For production dedicated servers, use headless Linux builds with no renderer
- Enable texture streaming and occlusion culling

### Network (100 Players)
- Server tick rate: 30-60 Hz
- Use interest management / relevancy to limit replication to nearby players
- Enable cull distance volumes
- Use level streaming for the 6 biomes

### Build Recommendations
- **Cooked + Packaged build** for testing (not Editor)
- Dedicated server: `TargetType.Server` build
- Client: `TargetType.Game` build

### Performance Warnings
- Gore/Niagara particles: limit max particle count
- Dynamic shadows: use stationary lights where possible
- Lumen: enable only on high settings; use baked lighting for low
- Voice chat: compress audio, use proximity-based muting
