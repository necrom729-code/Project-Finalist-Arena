#pragma once

#include "CoreMinimal.h"
#include "Engine/GameStateBase.h"
#include "FinalistArenaGameState.generated.h"

/**
 * GameState for Finalist Arena.
 * Replicated match state visible to all clients.
 */
UCLASS()
class FINALISTARENA_API AFinalistArenaGameState : public AGameStateBase
{
	GENERATED_BODY()

public:
	UPROPERTY(ReplicatedUsing=OnRep_MatchState, VisibleAnywhere, BlueprintReadOnly, Category = "Match")
	uint8 MatchState = 0; // 0=PreMatch, 1=InProgress, 2=Ended

	UPROPERTY(Replicated, VisibleAnywhere, BlueprintReadOnly, Category = "Match")
	float MatchTimeElapsed = 0.0f;

	UPROPERTY(Replicated, VisibleAnywhere, BlueprintReadOnly, Category = "Match")
	int32 PlayersAlive = 100;

	UPROPERTY(Replicated, VisibleAnywhere, BlueprintReadOnly, Category = "Match")
	int32 CurrentEventWave = 0;

	UFUNCTION()
	void OnRep_MatchState();
};
