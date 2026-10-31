// Copyright 1998-2026 Epic Games, Inc. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/PlayerState.h"
#include "FAPlayerState.generated.h"

UENUM(BlueprintType)
enum class EFALifeState : uint8
{
	Alive,
	Downed,
	Dead,
	Spectating
};

UCLASS()
class FINALISTARENA_API AFAPlayerState : public APlayerState
{
	GENERATED_BODY()

public:
	AFAPlayerState();

	/** Total kills this match. */
	UPROPERTY(ReplicatedUsing = OnRep_Kills, BlueprintReadOnly, Category = "Finalist Arena|Player")
	int32 Kills = 0;

	/** Arena Points earned this match. */
	UPROPERTY(ReplicatedUsing = OnRep_ArenaPoints, BlueprintReadOnly, Category = "Finalist Arena|Player")
	int32 ArenaPoints = 0;

	/** Current life state. */
	UPROPERTY(ReplicatedUsing = OnRep_LifeState, BlueprintReadOnly, Category = "Finalist Arena|Player")
	EFALifeState LifeState = EFALifeState::Alive;

	/** Is this player the last survivor? */
	UPROPERTY(ReplicatedUsing = OnRep_IsFinalist, BlueprintReadOnly, Category = "Finalist Arena|Player")
	bool bIsFinalist = false;

	UFUNCTION(BlueprintCallable, Category = "Finalist Arena|Player")
	void AddKill(int32 Amount = 1);

	UFUNCTION(BlueprintCallable, Category = "Finalist Arena|Player")
	void AddArenaPoints(int32 Amount);

	UFUNCTION(BlueprintPure, Category = "Finalist Arena|Player")
	bool IsAlive() const { return LifeState == EFALifeState::Alive; }

protected:
	UFUNCTION()
	void OnRep_Kills();

	UFUNCTION()
	void OnRep_ArenaPoints();

	UFUNCTION()
	void OnRep_LifeState();

	UFUNCTION()
	void OnRep_IsFinalist();

	virtual void GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const override;
};
