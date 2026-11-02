#include "FinalistArenaPlayerState.h"
#include "Net/UnrealNetwork.h"

AFinalistArenaPlayerState::AFinalistArenaPlayerState(const FObjectInitializer& ObjectInitializer)
	: Super(ObjectInitializer)
{
}

void AFinalistArenaPlayerState::AddKillPoints(int32 Amount)
{
	KillPoints += Amount;
	// Tech tier advances based on points
	if (KillPoints >= 500) TechTier = ETechTier::Master;
	else if (KillPoints >= 300) TechTier = ETechTier::Engineer;
	else if (KillPoints >= 150) TechTier = ETechTier::Technician;
	else if (KillPoints >= 50) TechTier = ETechTier::Survivor;
}

void AFinalistArenaPlayerState::AddKill()
{
	Kills++;
	AddKillPoints(25);
}

void AFinalistArenaPlayerState::AddDeath()
{
	Deaths++;
}

void AFinalistArenaPlayerState::SetStreamer(bool bStreamer, float InitialHype)
{
	bIsStreamer = bStreamer;
	HypeLevel = InitialHype;
}

void AFinalistArenaPlayerState::OnRep_KillPoints() {}
void AFinalistArenaPlayerState::OnRep_TechTier() {}
void AFinalistArenaPlayerState::OnRep_Kills() {}
void AFinalistArenaPlayerState::OnRep_Deaths() {}
void AFinalistArenaPlayerState::OnRep_HypeLevel() {}
void AFinalistArenaPlayerState::OnRep_bIsStreamer() {}

void AFinalistArenaPlayerState::GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const
{
	Super::GetLifetimeReplicatedProps(OutLifetimeProps);
	DOREPLIFETIME(AFinalistArenaPlayerState, KillPoints);
	DOREPLIFETIME(AFinalistArenaPlayerState, TechTier);
	DOREPLIFETIME(AFinalistArenaPlayerState, Kills);
	DOREPLIFETIME(AFinalistArenaPlayerState, Deaths);
	DOREPLIFETIME(AFinalistArenaPlayerState, HypeLevel);
	DOREPLIFETIME(AFinalistArenaPlayerState, bIsStreamer);
}
