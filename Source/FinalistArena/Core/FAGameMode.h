// Copyright 1998-2026 Epic Games, Inc. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/GameModeBase.h"
#include "FAGameMode.generated.h"

/**
 * Match state machine for Finalist Arena: Lobby -> Countdown -> Drop -> Playing -> Final -> Victory.
 * Server authoritative.
 */
UENUM(BlueprintType)
enum class EFAMatchState : uint8
{
	None,
	Lobby,
	Countdown,
	Drop,
	Playing,
	Final,
	Victory,
	GameOver
};

UCLASS()
class FINALISTARENA_API AFAGameMode : public AGameModeBase
{
	GENERATED_BODY()

public:
	AFAGameMode();

	/** Current authoritative match state. */
	UFUNCTION(BlueprintPure, Category = "Finalist Arena|Match")
	EFAMatchState GetMatchState() const { return MatchState; }

	/** Set match state (server only). Broadcasts to clients. */
	UFUNCTION(BlueprintCallable, Category = "Finalist Arena|Match")
	void SetMatchState(EFAMatchState NewState);

	/** Total number of players in this match (target 100). */
	UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "Match")
	int32 MaxPlayers = 100;

	/** Match duration cap in seconds (20-60 minutes). */
	UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "Match")
	float MatchDurationSeconds = 3600.0f;

	/** Whether a match is currently active. */
	UFUNCTION(BlueprintPure, Category = "Finalist Arena|Match")
	bool IsMatchActive() const;

protected:
	/** Current match state, replicated. */
	UPROPERTY(ReplicatedUsing = OnRep_MatchState, BlueprintReadOnly, Category = "Match")
	EFAMatchState MatchState = EFAMatchState::Lobby;

	UFUNCTION()
	void OnRep_MatchState();

	virtual void GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const override;

	virtual void BeginPlay() override;
	virtual void Tick(float DeltaSeconds) override;

private:
	float MatchElapsed = 0.0f;
};
