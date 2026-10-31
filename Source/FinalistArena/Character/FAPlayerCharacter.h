// Copyright 1998-2026 Epic Games, Inc. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Character.h"
#include "FAPlayerCharacter.generated.h"

UCLASS()
class FINALISTARENA_API AFAPlayerCharacter : public ACharacter
{
	GENERATED_BODY()

public:
	AFAPlayerCharacter();

	/** Current health (0-100). Server authoritative, replicated. */
	UPROPERTY(ReplicatedUsing = OnRep_Health, BlueprintReadOnly, Category = "Finalist Arena|Stats")
	float Health = 100.0f;

	/** Current stamina (0-100). */
	UPROPERTY(ReplicatedUsing = OnRep_Stamina, BlueprintReadOnly, Category = "Finalist Arena|Stats")
	float Stamina = 100.0f;

	UFUNCTION(BlueprintPure, Category = "Finalist Arena|Stats")
	float GetHealth() const { return Health; }

	UFUNCTION(BlueprintPure, Category = "Finalist Arena|Stats")
	float GetStamina() const { return Stamina; }

	/** Apply damage (server only). Returns true if still alive. */
	UFUNCTION(Server, Reliable, WithValidation, Category = "Finalist Arena|Combat")
	void ServerTakeDamage(float Amount, class AController* Instigator, FName BoneName);

protected:
	UFUNCTION()
	void OnRep_Health();
	UFUNCTION()
	void OnRep_Stamina();

	virtual void GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const override;
	virtual void BeginPlay() override;

private:
};
