#include "FinalistArenaGameState.h"
#include "Net/UnrealNetwork.h"

void AFinalistArenaGameState::OnRep_MatchState()
{
}

void AFinalistArenaGameState::GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const
{
	Super::GetLifetimeReplicatedProps(OutLifetimeProps);
	DOREPLIFETIME(AFinalistArenaGameState, MatchState);
	DOREPLIFETIME(AFinalistArenaGameState, MatchTimeElapsed);
	DOREPLIFETIME(AFinalistArenaGameState, PlayersAlive);
	DOREPLIFETIME(AFinalistArenaGameState, CurrentEventWave);
}
