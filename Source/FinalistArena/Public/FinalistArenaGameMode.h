#pragma once

#include "CoreMinimal.h"
#include "GameModeBase.h"
#include "FinalistArenaGameMode.generated.h"

/**
 * GameMode handling match flow, zone shrinking, 10-minute event waves,
 * kill points, crate rewards, and the final winner declaration.
 */
UCLASS()
class FINALISTARENA_API AFinalistArenaGameMode : public AGameModeBase
{
	GENERATED_BODY()

public:
	AFinalistArenaGameMode(const FObjectInitializer& ObjectInitializer);

protected:
	virtual void BeginPlay() override;
	virtual void Tick(float DeltaSeconds) override;

	UPROPERTY(ReplicatedUsing=OnRep_MatchState, VisibleAnywhere, BlueprintReadOnly, Category = "Match")
	enum class EMatchState : uint8
	{
		PreMatch,
		InProgress,
		Ended
	} MatchState = EMatchState::PreMatch;

	UFUNCTION()
	void OnRep_MatchState();

	// Match timers
	UPROPERTY(Replicated, VisibleAnywhere, BlueprintReadOnly, Category = "Match")
	float MatchTimeElapsed = 0.0f;

	UPROPERTY(EditDefaultsOnly, Category = "Match")
	float EventWaveInterval = 600.0f; // 10 minutes

	UPROPERTY(EditDefaultsOnly, Category = "Match")
	int32 TotalEventWaves = 20;

	UPROPERTY(Replicated, VisibleAnywhere, BlueprintReadOnly, Category = "Match")
	int32 CurrentEventWave = 0;

	// Zone
	UPROPERTY(EditDefaultsOnly, Category = "Zone")
	float ZoneShrinkStartTime = 60.0f;

	UPROPERTY(EditDefaultsOnly, Category = "Zone")
	float ZoneShrinkDuration = 600.0f;

	// Kill points
	UFUNCTION(BlueprintCallable, Category = "Combat")
	void AwardKillPoints(AActor* Victim, AActor* Killer);

	// Event waves
	UFUNCTION(BlueprintCallable, Category = "Events")
	void TriggerEventWave(int32 WaveIndex);

	UFUNCTION(BlueprintCallable, Category = "Match")
	void DeclareWinner(AFinalistArenaCharacter* Winner);

	UFUNCTION(BlueprintCallable, Category = "Match")
	bool IsMatchActive() const { return MatchState == EMatchState::InProgress; }

	UFUNCTION(BlueprintPure, Category = "Match")
	float GetMatchTimeElapsed() const { return MatchTimeElapsed; }

protected:
	virtual void GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) override;

private:
	float EventWaveTimer = 0.0f;
	float ZoneTimer = 0.0f;
};
