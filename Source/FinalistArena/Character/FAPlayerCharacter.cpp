// Copyright 1998-2026 Epic Games, Inc. All Rights Reserved.

#include "FAPlayerCharacter.h"
#include "Net/UnrealNetwork.h"

AFAPlayerCharacter::AFAPlayerCharacter()
{
	PrimaryActorTick.bCanEverTick = true;
}

void AFAPlayerCharacter::ServerTakeDamage_Implementation(float Amount, AController* Instigator, FName BoneName)
{
	Health = FMath::Clamp(Health - Amount, 0.0f, 100.0f);
	OnRep_Health();
}

bool AFAPlayerCharacter::ServerTakeDamage_Validate(float Amount, AController* Instigator, FName BoneName)
{
	return Amount >= 0.0f;
}

void AFAPlayerCharacter::OnRep_Health() {}
void AFAPlayerCharacter::OnRep_Stamina() {}

void AFAPlayerCharacter::GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const
{
	Super::GetLifetimeReplicatedProps(OutLifetimeProps);
	DOREPLIFETIME(AFAPlayerCharacter, Health);
	DOREPLIFETIME(AFAPlayerCharacter, Stamina);
}

void AFAPlayerCharacter::BeginPlay()
{
	Super::BeginPlay();
}
