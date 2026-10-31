// Copyright 1998-2026 Epic Games, Inc. All Rights Reserved.

#include "FAGameMode.h"
#include "Net/UnrealNetwork.h"

AFAGameMode::AFAGameMode()
{
	PrimaryActorTick.bCanEverTick = true;
	PrimaryActorTick.TickInterval = 1.0f / 30.0f; // target 30 Hz server tick
}

void AFAGameMode::SetMatchState(EFAMatchState NewState)
{
	if (HasAuthority() && MatchState != NewState)
	{
		MatchState = NewState;
		OnRep_MatchState();
	}
}

bool AFAGameMode::IsMatchActive() const
{
	return MatchState == EFAMatchState::Playing || MatchState == EFAMatchState::Final;
}

void AFAGameMode::OnRep_MatchState()
{
	// Clients react to state change here.
}

void AFAGameMode::GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const
{
	Super::GetLifetimeReplicatedProps(OutLifetimeProps);
	DOREPLIFETIME(AFAGameMode, MatchState);
}

void AFAGameMode::BeginPlay()
{
	Super::BeginPlay();
}

void AFAGameMode::Tick(float DeltaSeconds)
{
	Super::Tick(DeltaSeconds);

	if (HasAuthority() && IsMatchActive())
	{
		MatchElapsed += DeltaSeconds;
		if (MatchElapsed >= MatchDurationSeconds)
		{
			SetMatchState(EFAMatchState::GameOver);
		}
	}
}
