// Copyright 1998-2026 Epic Games, Inc. All Rights Reserved.

#include "FAGameState.h"
#include "Net/UnrealNetwork.h"

AFAGameState::AFAGameState()
{
	PrimaryActorTick.bCanEverTick = false;
}

void AFAGameState::OnRep_AliveCount() {}
void AFAGameState::OnRep_FinalistCount() {}

void AFAGameState::GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const
{
	Super::GetLifetimeReplicatedProps(OutLifetimeProps);
	DOREPLIFETIME(AFAGameState, AlivePlayerCount);
	DOREPLIFETIME(AFAGameState, FinalistCount);
}
