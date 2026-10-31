// Copyright 1998-2026 Epic Games, Inc. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/PlayerController.h"
#include "FAPlayerController.generated.h"

/**
 * Player controller for Finalist Arena. Input only; server authoritative state lives in PlayerState/Character.
 */
UCLASS()
class FINALISTARENA_API AFAPlayerController : public APlayerController
{
	GENERATED_BODY()

public:
	AFAPlayerController();

	/** Server request to offer an alliance to another player. */
	UFUNCTION(Server, Reliable, WithValidation, Category = "Finalist Arena|Social")
	void ServerOfferAlliance(class AFAPlayerController* TargetController);

	/** Client response to an alliance offer. */
	UFUNCTION(Server, Reliable, WithValidation, Category = "Finalist Arena|Social")
	void ServerRespondToAlliance(class AFAPlayerController* Offerer, bool bAccept);

protected:
	virtual void BeginPlay() override;
	virtual void SetupInputComponent() override;
};
