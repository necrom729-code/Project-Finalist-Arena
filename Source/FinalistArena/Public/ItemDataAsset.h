#pragma once

#include "CoreMinimal.h"
#include "Items/ItemDataAsset.h"
#include "ItemDataAsset.generated.h"

UENUM(BlueprintType)
enum class EItemType : uint8
{
	Resource,
	Tool,
	Weapon,
	Medicine,
	Armor,
	Trap,
	Consumable,
	MutatedMaterial,
	ManualBook
};

UCLASS()
class FINALISTARENA_API UItemDataAsset : public UPrimaryDataAsset
{
	GENERATED_BODY()

public:
	UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "Item")
	FName ItemID;

	UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "Item")
	FText DisplayName;

	UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "Item")
	EItemType ItemType;

	UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "Item")
	int32 StackSize = 1;

	UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "Item")
	float Weight = 1.0f;

	UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "Item")
	UTexture2D* Icon = nullptr;
};
