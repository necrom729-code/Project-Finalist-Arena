#pragma once

#include "CoreMinimal.h"
#include "GameFramework/PlayerState.h"
#include "FinalistArenaPlayerState.generated.h"

UENUM(BlueprintType)
enum class ETechTier : uint8
{
	Scavenger,
	Survivor,
	Technician,
	Engineer,
	Master
};

UCLASS()
class FINALISTARENA_API AFinalistArenaPlayerState : public APlayerState
{
	GENERATED_BODY()

public:
	AFinalistArenaPlayerState(const FObjectInitializer& ObjectInitializer);

	UPROPERTY(ReplicatedUsing=OnRep_KillPoints, VisibleAnywhere, BlueprintReadOnly, Category = "Progression")
	int32 KillPoints = 0;

	UPROPERTY(ReplicatedUsing=OnRep_TechTier, VisibleAnywhere, BlueprintReadOnly, Category = "Progression")
	ETechTier TechTier = ETechTier::Scavenger;

	UPROPERTY(ReplicatedUsing=OnRep_Kills, VisibleAnywhere, BlueprintReadOnly, Category = "Combat")
	int32 Kills = 0;

	UPROPERTY(ReplicatedUsing=OnRep_Deaths, VisibleAnywhere, BlueprintReadOnly, Category = "Combat")
	int32 Deaths = 0;

	// Streamer hype integration
	UPROPERTY(ReplicatedUsing=OnRep_HypeLevel, VisibleAnywhere, BlueprintReadOnly, Category = "Streamer")
	float HypeLevel = 0.0f;

	UPROPERTY(ReplicatedUsing=OnRep_bIsStreamer, VisibleAnywhere, BlueprintReadOnly, Category = "Streamer")
	bool bIsStreamer = false;

	UFUNCTION()
	void OnRep_KillPoints();

	UFUNCTION()
	void OnRep_TechTier();

	UFUNCTION()
	void OnRep_Kills();

	UFUNCTION()
	void OnRep_Deaths();

	UFUNCTION()
	void OnRep_HypeLevel();

	UFUNCTION()
	void OnRep_bIsStreamer();

	UFUNCTION(BlueprintCallable, Category = "Progression")
	void AddKillPoints(int32 Amount);

	UFUNCTION(BlueprintCallable, Category = "Combat")
	void AddKill();

	UFUNCTION(BlueprintCallable, Category = "Combat")
	void AddDeath();

	UFUNCTION(BlueprintCallable, Category = "Streamer")
	void SetStreamer(bool bStreamer, float InitialHype);

protected:
	virtual void GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) override;
};
