#include "FinalistArenaGameMode.h"
#include "FinalistArenaCharacter.h"
#include "FinalistArenaGameState.h"
#include "Net/UnrealNetwork.h"

AFinalistArenaGameMode::AFinalistArenaGameMode(const FObjectInitializer& ObjectInitializer)
	: Super(ObjectInitializer)
{
	PrimaryActorTick.bCanEverTick = true;
	bReplicates = true;
}

void AFinalistArenaGameMode::BeginPlay()
{
	Super::BeginPlay();
	MatchState = EMatchState::InProgress;
}

void AFinalistArenaGameMode::Tick(float DeltaSeconds)
{
	Super::Tick(DeltaSeconds);

	if (HasAuthority() && MatchState == EMatchState::InProgress)
	{
		MatchTimeElapsed += DeltaSeconds;
		EventWaveTimer += DeltaSeconds;
		ZoneTimer += DeltaSeconds;

		// Trigger event wave every 10 minutes
		if (EventWaveTimer >= EventWaveInterval && CurrentEventWave < TotalEventWaves)
		{
			CurrentEventWave++;
			TriggerEventWave(CurrentEventWave);
			EventWaveTimer = 0.0f;
		}

		// Zone shrink logic
		if (ZoneTimer >= ZoneShrinkStartTime)
		{
			// Shrink zone based on active biome (implemented in Blueprint)
			ZoneTimer = 0.0f;
		}
	}
}

void AFinalistArenaGameMode::OnRep_MatchState()
{
}

void AFinalistArenaGameMode::AwardKillPoints(AActor* Victim, AActor* Killer)
{
	if (!Killer) return;

	AFinalistArenaCharacter* KillerChar = Cast<AFinalistArenaCharacter>(Killer);
	if (KillerChar)
	{
		// Grant bonus points redeemable at crates based on tech tier
		// Implemented via Blueprint event
	}
}

void AFinalistArenaGameMode::TriggerEventWave(int32 WaveIndex)
{
	// 20 unique dangers, implemented per biome in Blueprint
	// Examples: Blood Tsunami, Acid Rain, Meteor Shower, etc.
}

void AFinalistArenaGameMode::DeclareWinner(AFinalistArenaCharacter* Winner)
{
	MatchState = EMatchState::Ended;
	// Cutscene: Gamemaker declares winner, spectators cheer
}

void AFinalistArenaGameMode::GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const
{
	Super::GetLifetimeReplicatedProps(OutLifetimeProps);
	DOREPLIFETIME(AFinalistArenaGameMode, MatchState);
	DOREPLIFETIME(AFinalistArenaGameMode, MatchTimeElapsed);
	DOREPLIFETIME(AFinalistArenaGameMode, CurrentEventWave);
}
