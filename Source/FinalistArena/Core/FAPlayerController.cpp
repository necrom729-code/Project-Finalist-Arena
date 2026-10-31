// Copyright 1998-2026 Epic Games, Inc. All Rights Reserved.

#include "FAPlayerController.h"

AFAPlayerController::AFAPlayerController()
{
}

void AFAPlayerController::BeginPlay()
{
	Super::BeginPlay();
}

void AFAPlayerController::SetupInputComponent()
{
	Super::SetupInputComponent();
}

bool AFAPlayerController::ServerOfferAlliance_Validate(class AFAPlayerController* TargetController) { return true; }
void AFAPlayerController::ServerOfferAlliance_Implementation(class AFAPlayerController* TargetController) {}

bool AFAPlayerController::ServerRespondToAlliance_Validate(class AFAPlayerController* Offerer, bool bAccept) { return true; }
void AFAPlayerController::ServerRespondToAlliance_Implementation(class AFAPlayerController* Offerer, bool bAccept) {}
