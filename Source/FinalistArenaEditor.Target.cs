// Copyright 1998-2026 Epic Games, Inc. All Rights Reserved.

using UnrealBuildTool;

public class FinalistArenaEditor : TargetRules
{
	public FinalistArenaEditor(TargetInfo Target) : base(Target)
	{
		Type = TargetType.Editor;
		DefaultBuildSettings = BuildSettingsVersion.V5;
		IncludeOrderVersion = EngineIncludeOrderVersion.Unreal5_4;
		ExtraModuleNames.Add("FinalistArena");
		bUseUnityBuild = true;
	}
}
