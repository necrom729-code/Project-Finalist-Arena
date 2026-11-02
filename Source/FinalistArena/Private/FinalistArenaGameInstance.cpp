#include "FinalistArenaGameInstance.h"

UFinalistArenaGameInstance::UFinalistArenaGameInstance(const FObjectInitializer& ObjectInitializer)
	: Super(ObjectInitializer)
{
	AvailableBiomes.Add(TEXT("Forest"));
	AvailableBiomes.Add(TEXT("Safari"));
	AvailableBiomes.Add(TEXT("Arctic"));
	AvailableBiomes.Add(TEXT("Volcano"));
	AvailableBiomes.Add(TEXT("Desert"));
	AvailableBiomes.Add(TEXT("Unique"));
}
