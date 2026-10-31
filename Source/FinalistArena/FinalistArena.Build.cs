// Copyright 1998-2026 Epic Games, Inc. All Rights Reserved.

using UnrealBuildTool;

public class FinalistArena : ModuleRules
{
	public FinalistArena(ReadOnlyTargetRules Target) : base(Target)
	{
		PCHUsage = ModuleRules.PCHUsageMode.UseExplicitOrSharedPCHs;

		PublicIncludePaths.AddRange(
			new string[] {
				// ... add public include paths required here ...
			}
			);


		PrivateIncludePaths.AddRange(
			new string[] {
				// ... add other private include paths required here ...
			}
			);


		PublicDependencyModuleNames.AddRange(
			new string[]
			{
				"Core",
				"CoreUObject",
				"Engine",
				"InputCore",
				"EnhancedInput",
				"GameplayAbilities",
				"GameplayEffectCalculator",
				"Niagara",
				"MetaSounds",
				"OnlineSubsystem",
				"OnlineSubsystemEOS",
				"OnlineSubsystemUtils",
				"Voice",
				"CommonUI",
				"WorldPartition",
				"StateTree",
				"NavigationSystem",
				"AIModule",
				"GameplayTasks",
				"Slate",
				"SlateCore"
			}
			);


		PrivateDependencyModuleNames.AddRange(
			new string[]
			{
				"CoreUObject",
				"Engine",
				"Slate",
				"SlateCore",
				"RenderCore",
				"RHI",
				"AnimationCore",
				"AnimGraphRuntime",
				"PhysicsCore",
				"Chaos"
			}
			);


		DynamicallyLoadedModuleNames.AddRange(
			new string[]
			{
				// ... add any modules that your module loads dynamically here ...
			}
			);

		if (Target.bBuildEditor)
		{
			PrivateDependencyModuleNames.Add("UnrealEd");
			PrivateDependencyModuleNames.Add("ToolMenus");
		}
	}
}
