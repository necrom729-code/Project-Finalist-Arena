// Copyright 1998-2026 Epic Games, Inc. All Rights Reserved.

#include "FAPlayerState.h"
#include "Net/UnrealNetwork.h"

AFAPlayerState::AFAPlayerState()
{
}

void AFAPlayerState::AddKill(int32 Amount)
{
	if (!HasAuthority()) return;
	Kills += Amount;
	AddArenaPoints(50 * Amount);
}

void AFAPlayerState::AddArenaPoints(int32 Amount)
{
	if (!HasAuthority()) return;
	ArenaPoints += Amount;
}

void AFAPlayerState::OnRep_Kills() {}
void AFAPlayerState::OnRep_ArenaPoints() {}
void AFAPlayerState::OnRep_LifeState() {}
void AFAPlayerState::OnRep_IsFinalist() {}

void AFAPlayerState::GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const
{
	Super::GetLifetimeReplicatedProps(OutLifetimeProps);
	DOREPLIFETIME(AFAPlayerState, Kills);
	DOREPLIFETIME(AFAPlayerState, ArenaPoints);
	DOREPLIFETIME(AFAPlayerState, LifeState);
	DOREPLIFETIME(AFAPlayerState, bIsFinalist);
}
