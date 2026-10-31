# Networking Decision — Replication Graph vs Iris (UE 5.4)

## Recommendation: Replication Graph

For a 100-player dedicated-server battle royale on the target hardware (Ryzen 5 7500F, 16 GB RAM), we use **Replication Graph** in UE 5.4 rather than Iris.

### Rationale
1. **Maturity & tooling.** Replication Graph is production-proven and fully documented in UE 5.4. Iris is still maturing; debug tooling and replication graph visualization are less complete.
2. **Spatial culling.** Battle royale relevance is inherently spatial (players/AI/props near each other). Replication Graph's `ReplicationConnection` + `AlwaysRelevant`/`NetCullDistance` / `Relevancy` node model maps cleanly to zone-based significance.
3. **Server CPU budget.** At 30 Hz server tick with 100 clients, per-client relevance iteration in Replication Graph is predictable and tunable. Iris's finer-grained replication would require more validation before trusting it at this scale.
4. **EOS integration.** Replication Graph integrates with the existing networking stack we already use for EOS sessions/voice without new abstractions.

### When to reconsider Iris
If profiling shows replication is the CPU bottleneck and Iris demonstrates lower per-replication cost in UE 5.4, migrate incrementally. Iris is opt-in per-class, so a hybrid is possible.

### Tuning levers (see Docs/NetworkBudget.md)
- `NetCullDistance` per class
- Significance-based tick rates
- `AActor::SetReplicateMovement` / `SetReplicates`
- Dormancy for sleeping / out-of-zone actors
