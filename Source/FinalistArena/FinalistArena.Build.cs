using UnrealBuildTool;

public class FinalistArena : ModuleRules
{
	public FinalistArena(ReadOnlyTargetRules Target) : base(Target)
	{
		PCHUsage = PCHUsageMode::UseExplicitOrSharedPCHs;

		PublicIncludePaths.AddRange(
			new string[] {
				"FinalistArena/Public"
			}
		);

		PrivateIncludePaths.AddRange(
			new string[] {
				"FinalistArena/Private"
			}
		);

		PublicDependencyModuleNames.AddRange(
			new string[] {
				"Core",
				"CoreUObject",
				"Engine",
				"InputCore",
				"EnhancedInput",
				"NavigationSystem",
				"AIModule",
				"GameplayAbilities",
				"GameplayTags",
				"GameplayTasks",
				"Slate",
				"SlateCore",
				"UMG",
				"Niagara",
				"Chaos",
				"ChaosVehicles",
				"ClothingSystemRuntimeNv"
			}
		);

		PrivateDependencyModuleNames.AddRange(
			new string[] {
				"CoreUObject",
				"Engine",
				"Slate",
				"SlateCore",
				"UMG",
				"OnlineSubsystem",
				"OnlineSubsystemUtils",
				"Sockets",
				"Networking"
			}
		);

		DynamicallyLoadedModuleNames.AddRange(
			new string[] {
			}
		);

		bUsePrecompiled = true;
	}
}
