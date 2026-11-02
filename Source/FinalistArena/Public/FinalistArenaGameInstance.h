#include "CoreMinimal.h"
#include "Engine/GameInstance.h"
#include "FinalistArenaGameInstance.generated.h"

/**
 * GameInstance for Finalist Arena.
 * Holds persistent match data, server config, and player progression.
 */
UCLASS()
class FINALISTARENA_API UFinalistArenaGameInstance : public UGameInstance
{
	GENERATED_BODY()

public:
	UFinalistArenaGameInstance(const FObjectInitializer& ObjectInitializer);

	// Match settings
	UPROPERTY(EditDefaultsOnly, Category = "Match")
	int32 MaxPlayers = 100;

	UPROPERTY(EditDefaultsOnly, Category = "Match")
	float MatchDurationMin = 20.0f;

	UPROPERTY(EditDefaultsOnly, Category = "Match")
	float MatchDurationMax = 60.0f;

	// Server architecture
	UPROPERTY(EditDefaultsOnly, Category = "Server")
	bool bUseDedicatedServer = true;

	UPROPERTY(EditDefaultsOnly, Category = "Server")
	int32 ServerTickRate = 60;

	// Monetization
	UPROPERTY(EditDefaultsOnly, Category = "Monetization")
	bool bAllowMicrotransactions = false;

	UPROPERTY(EditDefaultsOnly, Category = "Monetization")
	bool bAllowPayToWin = false;

	// Biomes
	UPROPERTY(EditDefaultsOnly, Category = "Arena")
	TArray<FName> AvailableBiomes;

	UFUNCTION(BlueprintCallable, Category = "Match")
	bool IsDedicatedServer() const { return bUseDedicatedServer; }

	UFUNCTION(BlueprintCallable, Category = "Match")
	int32 GetMaxPlayers() const { return MaxPlayers; }
};
