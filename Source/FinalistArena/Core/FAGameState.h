// Copyright 1998-2026 Epic Games, Inc. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/GameStateBase.h"
#include "FAGameState.generated.h"

/**
 * Replicated match-wide state: alive player count, zone phase, event state.
 */
UCLASS()
class FINALISTARENA_API AFAGameState : public AGameStateBase
{
	GENERATED_BODY()

public:
	AFAGameState();

	/** Number of players currently alive. */
	UFUNCTION(BlueprintPure, Category = "Finalist Arena|Match")
	int32 GetAlivePlayerCount() const { return AlivePlayerCount; }

	/** Number of players remaining in the final duel (when in Final state). */
	UFUNCTION(BlueprintPure, Category = "Finalist Arena|Match")
	int32 GetFinalistCount() const { return FinalistCount; }

protected:
	UPROPERTY(ReplicatedUsing = OnRep_AliveCount, BlueprintReadOnly, Category = "Match")
	int32 AlivePlayerCount = 0;

	UPROPERTY(ReplicatedUsing = OnRep_FinalistCount, BlueprintReadOnly, Category = "Match")
	int32 FinalistCount = 0;

	UFUNCTION()
	void OnRep_AliveCount();

	UFUNCTION()
	void OnRep_FinalistCount();

	virtual void GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const override;
};
