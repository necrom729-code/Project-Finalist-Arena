#include "CraftingRecipe.h"

bool UCraftingRecipe::CanCraft(const TArray<FCraftingIngredient>& PlayerInventory, ETechTier PlayerTechTier, bool bHasManual) const
{
	if (!RequiredManualBook.IsNone() && !bHasManual) return false;

	int32 TierIndex = (int32)PlayerTechTier;
	int32 RequiredIndex = (int32)RequiredTechTier;
	if (TierIndex < RequiredIndex) return false;

	for (const FCraftingIngredient& Ingredient : Ingredients)
	{
		int32 Have = 0;
		for (const FCraftingIngredient& Owned : PlayerInventory)
		{
			if (Owned.Item == Ingredient.Item)
			{
				Have += Owned.Quantity;
				break;
			}
		}
		if (Have < Ingredient.Quantity) return false;
	}

	return true;
}
