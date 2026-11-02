/*=============================================================================
	FinalistArenaTarget.cs
=============================================================================*/

using UnrealBuildTool;
using System.Collections.Generic;

public class FinalistArenaTarget : TargetRules
{
	public FinalistArenaTarget(TargetInfo Target) : base(Target)
	{
		Type = TargetType.Game;
		DefaultBuildSettings = BuildSettingsVersion.V5;
		IncludeOrderVersion = EngineIncludeOrderVersion.Unreal5_4;
		ExtraModuleNames.AddRange( new string[] { "FinalistArena" } );
	}
}
