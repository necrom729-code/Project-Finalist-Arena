#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Character.h"
#include "FinalistArenaCharacter.generated.h"

UENUM(BlueprintType)
enum class ENeedType : uint8
{
	Health,
	Stamina,
	Hygiene,
	Sleep
};

USTRUCT(BlueprintType)
struct FNeedStats
{
	GENERATED_BODY()

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
	float CurrentValue = 100.0f;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
	float MaxValue = 100.0f;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
	float DecayRatePerSecond = 1.0f;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
	float CriticalThreshold = 20.0f;

	UFUNCTION(BlueprintPure, Category = "Needs")
	bool IsCritical() const { return CurrentValue <= CriticalThreshold; }

	UFUNCTION(BlueprintPure, Category = "Needs")
	float GetNormalized() const { return FMath::Clamp(CurrentValue / MaxValue, 0.0f, 1.0f); }
};

UCLASS()
class FINALISTARENA_API AFinalistArenaCharacter : public ACharacter
{
	GENERATED_BODY()

public:
	AFinalistArenaCharacter(const FObjectInitializer& ObjectInitializer);

protected:
	virtual void BeginPlay() override;
	virtual void Tick(float DeltaSeconds) override;

	// Needs
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Needs")
	FNeedStats Health;

	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Needs")
	FNeedStats Stamina;

	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Needs")
	FNeedStats Hygiene;

	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Needs")
	FNeedStats Sleep;

	// Paranoia / Keen Sense
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Senses")
	float ParanoiaLevel = 0.0f;

	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Senses")
	bool bIsParanoid = false;

	// Team
	UPROPERTY(ReplicatedUsing=OnRep_TeamId, VisibleAnywhere, BlueprintReadOnly, Category = "Team")
	int32 TeamId = -1;

	UFUNCTION()
	void OnRep_TeamId();

	// Death camera
	UPROPERTY(ReplicatedUsing=OnRep_bIsDead, VisibleAnywhere, BlueprintReadOnly, Category = "Combat")
	bool bIsDead = false;

	UFUNCTION()
	void OnRep_bIsDead();

	UFUNCTION(BlueprintCallable, Category = "Needs")
	void ModifyNeed(ENeedType NeedType, float Amount);

	UFUNCTION(BlueprintCallable, Category = "Senses")
	void SetParanoia(float Amount);

	UFUNCTION(BlueprintCallable, Category = "Team")
	void SetTeamId(int32 NewTeamId);

	UFUNCTION(BlueprintCallable, Category = "Combat")
	void Die(AActor* Instigator);

	UFUNCTION(BlueprintNativeEvent, Category = "Combat")
	void OnDeathCamera(AActor* Killer);

	// Movement abilities
	UFUNCTION(BlueprintCallable, Category = "Movement")
	bool CanClimb() const;

	UFUNCTION(BlueprintCallable, Category = "Movement")
	bool CanSwim() const;

protected:
	virtual void SetupPlayerInputComponent(class UInputComponent* PlayerInputComponent) override;
};
