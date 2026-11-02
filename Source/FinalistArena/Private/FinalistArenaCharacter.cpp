#include "FinalistArenaCharacter.h"
#include "GameFramework/CharacterMovementComponent.h"
#include "Net/UnrealNetwork.h"

AFinalistArenaCharacter::AFinalistArenaCharacter(const FObjectInitializer& ObjectInitializer)
	: Super(ObjectInitializer)
{
	PrimaryActorTick.bCanEverTick = true;
	bReplicates = true;

	Health.MaxValue = 100.0f;
	Health.CurrentValue = 100.0f;
	Health.DecayRatePerSecond = 0.0f;
	Health.CriticalThreshold = 20.0f;

	Stamina.MaxValue = 100.0f;
	Stamina.CurrentValue = 100.0f;
	Stamina.DecayRatePerSecond = 5.0f;
	Stamina.CriticalThreshold = 15.0f;

	Hygiene.MaxValue = 100.0f;
	Hygiene.CurrentValue = 100.0f;
	Hygiene.DecayRatePerSecond = 0.5f;
	Hygiene.CriticalThreshold = 25.0f;

	Sleep.MaxValue = 100.0f;
	Sleep.CurrentValue = 100.0f;
	Sleep.DecayRatePerSecond = 0.3f;
	Sleep.CriticalThreshold = 30.0f;

	GetCharacterMovement()->bOrientRotationToMovement = true;
}

void AFinalistArenaCharacter::BeginPlay()
{
	Super::BeginPlay();
}

void AFinalistArenaCharacter::Tick(float DeltaSeconds)
{
	Super::Tick(DeltaSeconds);

	if (HasAuthority())
	{
		// Decay needs over time
		ModifyNeed(ENeedType::Stamina, -Stamina.DecayRatePerSecond * DeltaSeconds);
		ModifyNeed(ENeedType::Hygiene, -Hygiene.DecayRatePerSecond * DeltaSeconds);
		ModifyNeed(ENeedType::Sleep, -Sleep.DecayRatePerSecond * DeltaSeconds);

		// Critical health damage
		if (Health.IsCritical())
		{
			ModifyNeed(ENeedType::Health, -5.0f * DeltaSeconds);
		}
	}
}

void AFinalistArenaCharacter::SetupPlayerInputComponent(UInputComponent* PlayerInputComponent)
{
	Super::SetupPlayerInputComponent(PlayerInputComponent);
}

void AFinalistArenaCharacter::ModifyNeed(ENeedType NeedType, float Amount)
{
	switch (NeedType)
	{
	case ENeedType::Health:
		Health.CurrentValue = FMath::Clamp(Health.CurrentValue + Amount, 0.0f, Health.MaxValue);
		if (Health.CurrentValue <= 0.0f && !bIsDead)
		{
			bIsDead = true;
			OnRep_bIsDead();
		}
		break;
	case ENeedType::Stamina:
		Stamina.CurrentValue = FMath::Clamp(Stamina.CurrentValue + Amount, 0.0f, Stamina.MaxValue);
		break;
	case ENeedType::Hygiene:
		Hygiene.CurrentValue = FMath::Clamp(Hygiene.CurrentValue + Amount, 0.0f, Hygiene.MaxValue);
		break;
	case ENeedType::Sleep:
		Sleep.CurrentValue = FMath::Clamp(Sleep.CurrentValue + Amount, 0.0f, Sleep.MaxValue);
		break;
	}
}

void AFinalistArenaCharacter::SetParanoia(float Amount)
{
	ParanoiaLevel = FMath::Clamp(Amount, 0.0f, 100.0f);
	bIsParanoid = ParanoiaLevel > 50.0f;
}

void AFinalistArenaCharacter::SetTeamId(int32 NewTeamId)
{
	TeamId = NewTeamId;
}

void AFinalistArenaCharacter::OnRep_TeamId()
{
}

void AFinalistArenaCharacter::OnRep_bIsDead()
{
	if (bIsDead)
	{
		GetCharacterMovement()->DisableMovement();
	}
}

void AFinalistArenaCharacter::Die(AActor* Instigator)
{
	bIsDead = true;
	OnRep_bIsDead();
	OnDeathCamera(Instigator);
}

bool AFinalistArenaCharacter::CanClimb() const
{
	return !bIsDead;
}

bool AFinalistArenaCharacter::CanSwim() const
{
	return !bIsDead;
}

void AFinalistArenaCharacter::GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const
{
	Super::GetLifetimeReplicatedProps(OutLifetimeProps);
	DOREPLIFETIME(AFinalistArenaCharacter, TeamId);
	DOREPLIFETIME(AFinalistArenaCharacter, bIsDead);
}
