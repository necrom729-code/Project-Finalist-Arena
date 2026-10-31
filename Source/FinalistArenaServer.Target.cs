// Copyright 1998-2026 Epic Games, Inc. All Rights Reserved.

using UnrealBuildTool;

public class FinalistArenaServer : TargetRules
{
	public FinalistArenaServer(TargetInfo Target) : base(Target)
	{
		Type = TargetType.Server;
		DefaultBuildSettings = BuildSettingsVersion.V5;
		IncludeOrderVersion = EngineIncludeOrderVersion.Unreal5_4;
		ExtraModuleNames.Add("FinalistArena");
		bUseUnityBuild = true;
		// Dedicated server: no editor, no Slate UI required by default.
		bBuildDeveloperTools = false;
		bCompileICU = true;
	}
}
