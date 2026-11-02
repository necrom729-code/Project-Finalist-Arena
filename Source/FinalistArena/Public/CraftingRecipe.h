#pragma once

#include "CoreMinimal.h"
#include "Items/ItemDataAsset.h"
#include "CraftingRecipe.generated.h"

UENUM(BlueprintType)
enum class ECraftingCategory : uint8
{
	Tool,
	Weapon,
	Medicine,
	Armor,
	Trap,
	Consumable,
	Unique
};

USTRUCT(BlueprintType)
struct FCraftingIngredient
{
	GENERATED_BODY()

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
	TSoftObjectPtr<class UItemDataAsset> Item;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
	int32 Quantity = 1;
};

UCLASS()
class FINALISTARENA_API UCraftingRecipe : public UPrimaryDataAsset
{
	GENERATED_BODY()

public:
	UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "Recipe")
	FName RecipeID;

	UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "Recipe")
	ECraftingCategory Category;

	UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "Recipe")
	TSoftObjectPtr<class UItemDataAsset> ResultItem;

	UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "Recipe")
	int32 ResultQuantity = 1;

	UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "Recipe")
	TArray<FCraftingIngredient> Ingredients;

	UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "Recipe")
	ETechTier RequiredTechTier = ETechTier::Scavenger;

	UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "Recipe")
	FName RequiredManualBook;

	UFUNCTION(BlueprintCallable, Category = "Crafting")
	bool CanCraft(const TArray<FCraftingIngredient>& PlayerInventory, ETechTier PlayerTechTier, bool bHasManual) const;
};
