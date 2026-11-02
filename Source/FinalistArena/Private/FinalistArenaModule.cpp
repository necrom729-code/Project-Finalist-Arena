/**=============================================================================
	FinalistArenaModule.cpp
=============================================================================*/

#include "CoreMinimal.h"
#include "Modules/ModuleManager.h"

class FFinalistArenaModule : public IModuleInterface
{
public:
	virtual void StartupModule() override {}
	virtual void ShutdownModule() override {}
};

IMPLEMENT_MODULE(FFinalistArenaModule, FinalistArena)
