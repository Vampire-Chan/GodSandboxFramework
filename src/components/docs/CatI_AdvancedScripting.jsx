// CatI_AdvancedScripting.jsx
// Category I: Advanced Scripting Reference
import React from 'react';
import { GodCodeBlock } from './docsHelpers';

export function renderPage(docId) {
  switch (docId) {

    case 'script_native':
      return (
        <article className="doc-article">
          <header className="doc-header">
            <span className="doc-category-tag">Advanced Scripting Reference</span>
            <h1 className="doc-main-title">Native Binding &amp; Auto-Binder</h1>
            <p className="doc-lead-para">
              Native functions are C++ functions exposed to the ScriptVM. The <code>ScriptAutoBinder</code> system uses UFunction reflection to auto-register all functions marked with the <code>meta=(ScriptBind="true")</code> specifier.
            </p>
          </header>

          <section className="doc-section">
            <h2 id="native-bind-pattern">Defining a Native Binding</h2>
            <p>To bind a C++ function to the VM, define it inside an autodetected library class with the appropriate metadata:</p>
            <GodCodeBlock
              language="cpp"
              code={`// ScriptLibrary.h — mark function for auto-binding
UFUNCTION(BlueprintCallable, 
    meta=(ScriptBind="true", ScriptName="SetWeather", ScriptCategory="World"),
    Category = "Script|World")
static void SetWeather(const FString& WeatherId, float TransitionTime);`}
            />
          </section>

          <section className="doc-section">
            <h2 id="native-categories">Standard Native Function Categories</h2>
            <table className="doc-table">
              <thead><tr><th>Category</th><th>Example Functions</th><th>Backend</th></tr></thead>
              <tbody>
                <tr><td>World</td><td>SetWeather, SetTimeOfDay, SetFog</td><td>WorldCycleManager</td></tr>
                <tr><td>Peds</td><td>SpawnPed, DeletePed, SetPedTask, SetPedHealth</td><td>PedManager / PedTaskManager</td></tr>
                <tr><td>Weapons</td><td>GivePedWeapon, SetPedAmmo, RemovePedWeapon</td><td>InventoryComponent</td></tr>
                <tr><td>Audio</td><td>PlayAudio, PlayAudioAt, StopAudio</td><td>AudioManager</td></tr>
                <tr><td>UI</td><td>UI_CreateMenu, UI_AddMenuItem, UI_PushMenu</td><td>URuntimeUISubsystem</td></tr>
                <tr><td>Camera</td><td>SetCameraTarget, LockCamera, UnlockCamera</td><td>GodDirectorComponent</td></tr>
                <tr><td>Economy</td><td>GiveMoney, TakeMoney, GetPlayerBalance</td><td>InventoryComponent (Currency)</td></tr>
              </tbody>
            </table>
          </section>

          <section className="doc-section">
            <h2 id="script-native-sig">FScriptNativeSignatureInfo</h2>
            <p>Every registered native function is described by an <code>FScriptNativeSignatureInfo</code> struct — used for in-editor documentation and mod tooling introspection.</p>
            <GodCodeBlock
              language="cpp"
              code={`USTRUCT(BlueprintType)
struct FScriptNativeSignatureInfo
{
    FString Name;         // Function name as called from script
    FString Category;     // Group ("World", "Peds", "Audio", etc.)
    FString Signature;    // Short signature: "SpawnPed(string, float, float, float)"
    FString FullSignature;// Full C++ style with param names and types
};`}
            />
          </section>
        </article>
      );

    case 'script_fibers':
      return (
        <article className="doc-article">
          <header className="doc-header">
            <span className="doc-category-tag">Advanced Scripting Reference</span>
            <h1 className="doc-main-title">Fiber Execution &amp; Latency</h1>
            <p className="doc-lead-para">
              The ScriptVM uses a cooperative multitasking model based on lightweight execution threads (fibers). Scripts yield back to the main game loop on <code>WAIT()</code> and <code>AWAIT_TASK()</code> calls, ensuring that complex mission scripting never stalls the main thread.
            </p>
          </header>

          <section className="doc-section">
            <h2 id="fiber-model">Fiber Model Overview</h2>
            <p>Each script instance has an <code>ActiveFiberID</code> managed by <code>ScriptLatentManager</code>. This is the same cooperative architecture as Unreal's <code>FLatentActionManager</code> but custom-built for the ScriptVM.</p>
            <div className="flow-visual-box">
              <div className="flow-node"><span className="node-num">RUN</span><div className="node-info"><h5>Script Executes</h5><p>VM runs bytecode instructions until it hits a yield point (<code>WAIT</code>, <code>AWAIT_TASK</code>, or a native call that is marked latent).</p></div></div>
              <div className="flow-arrow">→</div>
              <div className="flow-node"><span className="node-num">YLD</span><div className="node-info"><h5>Yield to Game Loop</h5><p>VM saves its stack state. Control returns to Unreal's main loop. Zero blocking.</p></div></div>
              <div className="flow-arrow">→</div>
              <div className="flow-node"><span className="node-num">WKE</span><div className="node-info"><h5>Wake-up Condition Met</h5><p>Timer elapsed or awaited task completed. ScriptLatentManager resumes the fiber from its saved state.</p></div></div>
            </div>
          </section>

          <section className="doc-section">
            <h2 id="fiber-script-syntax">Script Syntax for Latent Operations</h2>
            <p>Use yield functions to suspend script execution cleanly:</p>
            <GodCodeBlock
              language="sc"
              code={`// Mission.sc — example latent usage
function RunHeist()
{
    // Spawn ped and wait 2 seconds
    local ped = Peds->Spawn("W_Thief_01", 100.0, 200.0, 0.0);
    WAIT(2000);  // Yields for 2 seconds, game loop continues

    // Assign task and wait for it to complete
    AssignMoveToTask(ped, 500.0, 500.0, 0.0, "Run");
    AWAIT_TASK(ped);  // Yields until MoveTo task finishes

    Audio->Play("Mission_Heist_Start", 100.0, 200.0, 0.0);
    World->SetWeather("Thunderstorm", 5.0);  // 5-second transition
}`}
            />
          </section>
        </article>
      );

    case 'script_bytecode':
      return (
        <article className="doc-article">
          <header className="doc-header">
            <span className="doc-category-tag">Advanced Scripting Reference</span>
            <h1 className="doc-main-title">Bytecode Distribution (.scc)</h1>
            <p className="doc-lead-para">
              Compiled scripts can be distributed as <code>.scc</code> (Script Compiled Cache) files. This allows mod authors to ship mission logic without exposing source code, while still allowing the engine to execute them natively.
            </p>
          </header>

          <section className="doc-section">
            <h2 id="scc-format">The .scc Distribution Format</h2>
            <p>
              <code>.scc</code> files contain a serialized <code>FBytecodeChunk</code> — the compiler's output — without any source text. The VM executes bytecode directly, skipping the Lexer/Parser/Compiler stages entirely.
            </p>
            <div className="flow-visual-box">
              <div className="flow-node"><span className="node-num">SRC</span><div className="node-info"><h5>Mission.sc (Source)</h5><p>C-like script source. Readable. For development use only.</p></div></div>
              <div className="flow-arrow">→</div>
              <div className="flow-node"><span className="node-num">CMP</span><div className="node-info"><h5>ScriptCompiler</h5><p>Lexer → Parser → AST → Bytecode. Runs at build time or on first load.</p></div></div>
              <div className="flow-arrow">→</div>
              <div className="flow-node"><span className="node-num">SCC</span><div className="node-info"><h5>Mission.scc (Bytecode)</h5><p>Serialized FBytecodeChunk. No source. Shipped to end users.</p></div></div>
              <div className="flow-arrow">→</div>
              <div className="flow-node"><span className="node-num">VM</span><div className="node-info"><h5>FScriptVM Execution</h5><p>LoadCompiledBytecode() skips compilation entirely. Fiber execution starts immediately.</p></div></div>
            </div>
          </section>

          <section className="doc-section">
            <h2 id="scc-loading-api">Loading Pre-Compiled Bytecode</h2>
            <p>Load serialized scripts dynamically via UScriptManager:</p>
            <GodCodeBlock
              language="cpp"
              code={`// ScriptManager.h — load .scc without recompiling source
FString LoadCompiledBytecode(const FString& BytecodePath);

// Example usage:
FString ScriptToken = ScriptManager->LoadCompiledBytecode("@scripts/Compiled/Mission_Heist.scc");
if (!ScriptToken.IsEmpty())
{
    ScriptManager->ExecuteScript(ScriptToken);
}`}
            />
          </section>
        </article>
      );

    case 'script_lifecycle':
      return (
        <article className="doc-article">
          <header className="doc-header">
            <span className="doc-category-tag">Advanced Scripting Reference</span>
            <h1 className="doc-main-title">ScriptManager Lifecycle</h1>
            <p className="doc-lead-para">
              <code>UScriptManager</code> is a <code>UGameInstanceSubsystem</code> that manages the full lifecycle of every script: source resolution, compilation, caching, bytecode loading, and VM instantiation.
            </p>
          </header>

          <section className="doc-section">
            <h2 id="script-load-flow">Script Loading Flow</h2>
            <div className="flow-visual-box">
              <div className="flow-node"><span className="node-num">01</span><div className="node-info"><h5>LoadScript(path)</h5><p>Resolves the <code>.sc</code> source path via VFS (<code>@scripts/</code> prefix). Returns a script name token.</p></div></div>
              <div className="flow-arrow">↓</div>
              <div className="flow-node"><span className="node-num">02</span><div className="node-info"><h5>ScriptLexer → ScriptParser</h5><p>Tokenizes the source file and builds an AST. Lexer handles C-like syntax including <code>WAIT()</code> and <code>AWAIT_TASK()</code>.</p></div></div>
              <div className="flow-arrow">↓</div>
              <div className="flow-node"><span className="node-num">03</span><div className="node-info"><h5>ScriptCompiler → FBytecodeChunk</h5><p>AST is compiled to bytecode stored in a <code>FBytecodeChunk</code>. Shared pointer — efficient to copy.</p></div></div>
              <div className="flow-arrow">↓</div>
              <div className="flow-node"><span className="node-num">04</span><div className="node-info"><h5>FCompiledScript Cache</h5><p>Stored in <code>ScriptManager</code> registry keyed by script name. Tracks <code>LastModified</code> for hot-reload detection.</p></div></div>
              <div className="flow-arrow">↓</div>
              <div className="flow-node"><span className="node-num">05</span><div className="node-info"><h5>FScriptVM Instantiation</h5><p>Each script gets its own isolated <code>FScriptVM</code> instance. Fiber-based execution — no thread blocking.</p></div></div>
            </div>
          </section>

          <section className="doc-section">
            <h2 id="script-states">Script State Queries</h2>
            <GodCodeBlock
              language="cpp"
              code={`// Check if script source was loaded and compiled
bool IsScriptLoaded(const FString& ScriptName) const;

// Check if the script has been executed at least once
bool IsScriptRunning(const FString& ScriptName) const;`}
            />
          </section>

          <section className="doc-section">
            <h2 id="script-string-loading">In-Memory Script Loading</h2>
            <p>
              Scripts can also be compiled directly from a string without a file. This is used by the runtime UI system to create procedural menu scripts:
            </p>
            <GodCodeBlock
              language="cpp"
              code={`// Compile from string (no file needed — used by RuntimeUISubsystem)
bool LoadScriptFromString(const FString& ScriptName, const FString& SourceCode);`}
            />
          </section>

          <section className="doc-section">
            <h2 id="script-native-delegate">Native API Registration Delegate</h2>
            <p>
              External modules register their native functions via the <code>FNativeAPIRegistrationDelegate</code> delegate on <code>UScriptManager</code>. This is how <code>ScriptAutoBinder</code> connects C++ methods to the VM without hard coupling.
            </p>
            <GodCodeBlock
              language="cpp"
              code={`// Declaration in ScriptManager.h
DECLARE_MULTICAST_DELEGATE_OneParam(FNativeAPIRegistrationDelegate, FScriptVM*);

// Any module registers its functions here:
ScriptManager->OnRegisterNativeAPI.AddLambda([](FScriptVM* VM)
{
    VM->RegisterFunction("SpawnPed", &UScriptLibrary::SpawnPed);
    VM->RegisterFunction("SetWeather", &UScriptLibrary::SetWeather);
});`}
            />
          </section>
        </article>
      );

    case 'script_library':
      return (
        <article className="doc-article">
          <header className="doc-header">
            <span className="doc-category-tag">Advanced Scripting Reference</span>
            <h1 className="doc-main-title">Scripting Native Library API</h1>
            <p className="doc-lead-para">
              Comprehensive list of C++ bindings exposed directly to the VM and Blueprint setups, grouped by category.
            </p>
          </header>

          <section className="doc-section">
            <h2 id="lib-world">1. World &amp; Atmosphere</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
              <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-panel)', border: '1px solid var(--line-primary)', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ color: 'var(--accent)', margin: 0 }}>SetWeather(WeatherID, Duration)</h4>
                <p>Modifies active sky cycle profiles and atmospheric visibility metrics.</p>
                
                <h5>Advanced Modding Setup (C++ / SC)</h5>
                <GodCodeBlock
                  language="cpp"
                  code={`// C++ Source Binding (UWorldNative)
UFUNCTION(BlueprintCallable, meta=(ScriptBind="true", ScriptCategory="World", ScriptName="SetWeather"))
static void SetWeather(const FString& WeatherID, float Duration);

// SC VM Calling Syntax
World->SetWeather("Storm_Heavy", 8.0f);`}
                />

                <h5>Blueprint Setup (Epic Games Style)</h5>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>
                  To configure default lighting, drag the <code>AWorldCycleManager</code> actor directly into the viewport. Select the actor, open the <strong>Details Panel</strong>, locate the <strong>Weather Config</strong> header, and assign the default transition keyframes. To trigger transitions visually, link the execution pins to a <strong>Transition To Weather</strong> node in the Level Blueprint.
                </p>
              </div>
            </div>
          </section>

          <section className="doc-section">
            <h2 id="lib-peds">2. Pedestrians &amp; AI</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
              <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-panel)', border: '1px solid var(--line-primary)', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ color: 'var(--accent)', margin: 0 }}>SpawnPed(ArchetypeID, X, Y, Z)</h4>
                <p>Creates a character instance in the simulation from registered definitions.</p>
                
                <h5>Advanced Modding Setup (C++ / SC)</h5>
                <GodCodeBlock
                  language="cpp"
                  code={`// C++ Source Binding (UPedNative)
UFUNCTION(BlueprintCallable, meta=(ScriptBind="true", ScriptCategory="Peds", ScriptName="Spawn"))
static APed* Spawn(FName ArchetypeID, float X, float Y, float Z);

// SC VM Calling Syntax
local ped = Peds->Spawn("Ped_UrbanCiv", 12500.0, -4500.0, 100.0);`}
                />

                <h5>Blueprint Setup (Epic Games Style)</h5>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>
                  To place characters, drag a <code>APlayerPed</code> or custom Character Blueprint from the content browser straight into your level viewport. Set the <strong>Auto Possess Player</strong> setting to <em>Player 0</em> in the details panel, and adjust their clothing variations by editing the <strong>Clothing Component</strong> outfits array.
                </p>
              </div>
            </div>
          </section>

          <section className="doc-section">
            <h2 id="lib-weapons">3. Weapons &amp; Inventory</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
              <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-panel)', border: '1px solid var(--line-primary)', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ color: 'var(--accent)', margin: 0 }}>GiveWeapon(PedRef, WeaponID)</h4>
                <p>Adds a weapon instance to a pedestrian's inventory mapping slots.</p>
                
                <h5>Advanced Modding Setup (C++ / SC / XML)</h5>
                <GodCodeBlock
                  language="cpp"
                  code={`// C++ Source Binding (UWeaponNative)
UFUNCTION(BlueprintCallable, meta=(ScriptBind="true", ScriptCategory="Weapons", ScriptName="Give"))
static void Give(APed* TargetPed, FName WeaponID);

// SC VM Calling Syntax
Weapons->Give(ped, "W_Rifle_M4");`}
                />
                <p style={{ marginTop: '0.75rem' }}>The weapon templates are loaded from the base definition registry:</p>
                <GodCodeBlock
                  language="xml"
                  code={`<!-- Weapons.xml -->
<Weapon id="W_Rifle_M4" type="AssaultRifle" baseDamage="35" />`}
                />

                <h5>Blueprint Setup (Epic Games Style)</h5>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>
                  To give characters default gear, open your Character Blueprint, select the <strong>Inventory Component</strong> in the components tree, locate the <strong>Default Loadout</strong> property in the details panel, and add weapon references to the array list.
                </p>
              </div>
            </div>
          </section>

          <section className="doc-section">
            <h2 id="lib-audio">4. Audio &amp; Sound</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
              <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-panel)', border: '1px solid var(--line-primary)', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ color: 'var(--accent)', margin: 0 }}>PlaySound(SoundName, X, Y, Z)</h4>
                <p>Plays a registered sound by folder container ID or randomized index.</p>
                
                <h5>Advanced Modding Setup (C++ / SC / XML)</h5>
                <GodCodeBlock
                  language="cpp"
                  code={`// C++ Source Binding (UAudioNative)
UFUNCTION(BlueprintCallable, meta=(ScriptBind="true", ScriptCategory="Audio", ScriptName="Play"))
static void Play(const FString& SoundName, float X, float Y, float Z);

// SC VM Calling Syntax
Audio->Play("Weapon_Rifle_Fire", 0.0, 0.0, 0.0);`}
                />
                <p style={{ marginTop: '0.75rem' }}>Registered inside the master assets list:</p>
                <GodCodeBlock
                  language="xml"
                  code={`<!-- Assets.xml -->
<SoundFolder name="Weapon_Rifle">
  <Sound name="Fire" path="@content/Audio/Weapons/M4/Fire1" />
</SoundFolder>`}
                />

                <h5>Blueprint Setup (Epic Games Style)</h5>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>
                  To add sound to character interactions, add a <strong>UAudioComponent</strong> directly to the character's component tree. In the details panel, bind your <strong>Sound Wave</strong> or <strong>MetaSound</strong> asset, and set the **Spatialize** option to true for attenuation.
                </p>
              </div>
            </div>
          </section>

          <section className="doc-section">
            <h2 id="lib-ui">5. UI &amp; HUDs</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
              <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-panel)', border: '1px solid var(--line-primary)', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ color: 'var(--accent)', margin: 0 }}>ShowNotification(Text)</h4>
                <p>Pushes a message alert text to the programmatic Slate status feed.</p>
                
                <h5>Advanced Modding Setup (C++ / SC)</h5>
                <GodCodeBlock
                  language="cpp"
                  code={`// C++ Source Binding (UUINative)
UFUNCTION(BlueprintCallable, meta=(ScriptBind="true", ScriptCategory="UI", ScriptName="ShowNotification"))
static void ShowNotification(const FString& Text);

// SC VM Calling Syntax
UI->ShowNotification("Area Entered");`}
                />

                <h5>Blueprint Setup (Epic Games Style)</h5>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>
                  To bypass programmatic layouts and use visual UMG instead, inherit your GameMode from <code>ASandboxGameMode</code> and set <strong>Disable Built In UI</strong> to true. You can then use standard <strong>Create Widget</strong> and <strong>Add to Viewport</strong> nodes in Blueprints to render custom screens.
                </p>
              </div>
            </div>
          </section>

          <section className="doc-section">
            <h2 id="lib-camera">6. Camera &amp; Director</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
              <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-panel)', border: '1px solid var(--line-primary)', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ color: 'var(--accent)', margin: 0 }}>SetCameraTarget(PedRef)</h4>
                <p>Locks camera view targets to character models for cutscenes.</p>
                
                <h5>Advanced Modding Setup (C++ / SC)</h5>
                <GodCodeBlock
                  language="cpp"
                  code={`// C++ Source Binding (UCameraNative)
UFUNCTION(BlueprintCallable, meta=(ScriptBind="true", ScriptCategory="Camera", ScriptName="SetTarget"))
static void SetTarget(APed* TargetPed);

// SC VM Calling Syntax
Camera->SetTarget(ped);`}
                />

                <h5>Blueprint Setup (Epic Games Style)</h5>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>
                  To alter camera views, open your custom PlayerController, drag the target actor from your viewport context into the Event Graph, and connect it to a <strong>Set View Target with Blend</strong> execution node.
                </p>
              </div>
            </div>
          </section>

          <section className="doc-section">
            <h2 id="lib-economy">7. Economy &amp; Progression</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
              <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-panel)', border: '1px solid var(--line-primary)', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ color: 'var(--accent)', margin: 0 }}>GiveMoney(PedRef, Amount)</h4>
                <p>Appends coin balances inside character inventory models.</p>
                
                <h5>Advanced Modding Setup (C++ / SC)</h5>
                <GodCodeBlock
                  language="cpp"
                  code={`// C++ Source Binding (UEconomyNative)
UFUNCTION(BlueprintCallable, meta=(ScriptBind="true", ScriptCategory="Economy", ScriptName="GiveMoney"))
static void GiveMoney(APed* TargetPed, int32 Amount);

// SC VM Calling Syntax
Economy->GiveMoney(ped, 500);`}
                />

                <h5>Blueprint Setup (Epic Games Style)</h5>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>
                  To query player currency balances, get the **Inventory Component** reference on your character Blueprint, read the **MillHaven Coin** integer variable, and bind it to a text block within a custom HUD Widget.
                </p>
              </div>
            </div>
          </section>
        </article>
      );

    default: return null;
  }
}

export function getOutline(docId) {
  switch (docId) {

    case 'script_native':
      return (
        <>
          <li><a href="#native-bind-pattern">Defining a Native Binding</a></li>
          <li><a href="#native-categories">Standard Native Function Categories</a></li>
          <li><a href="#script-native-sig">FScriptNativeSignatureInfo</a></li>
        </>
      );

    case 'script_fibers':
      return (
        <>
          <li><a href="#fiber-model">Fiber Model Overview</a></li>
          <li><a href="#fiber-script-syntax">Script Syntax for Latent Operations</a></li>
          <li><a href="#fiber-debug-status">Debugging Status (Beta)</a></li>
        </>
      );

    case 'script_bytecode':
      return (
        <>
          <li><a href="#scc-format">The .scc Distribution Format</a></li>
          <li><a href="#scc-loading-api">Loading Pre-Compiled Bytecode</a></li>
          <li><a href="#scc-vs-source">Source vs. Bytecode Comparison</a></li>
        </>
      );

    case 'script_lifecycle':
      return (
        <>
          <li><a href="#script-load-flow">Script Loading Flow</a></li>
          <li><a href="#script-states">Script State Queries</a></li>
          <li><a href="#script-string-loading">In-Memory Script Loading</a></li>
          <li><a href="#script-native-delegate">Native API Registration Delegate</a></li>
        </>
      );

    case 'script_library':
      return (
        <>
          <li><a href="#lib-world">World &amp; Atmosphere</a></li>
          <li><a href="#lib-peds">Pedestrians &amp; AI</a></li>
          <li><a href="#lib-weapons">Weapons &amp; Inventory</a></li>
          <li><a href="#lib-audio">Audio &amp; Sound</a></li>
          <li><a href="#lib-ui">UI &amp; HUDs</a></li>
          <li><a href="#lib-camera">Camera &amp; Director</a></li>
          <li><a href="#lib-economy">Economy &amp; Progression</a></li>
        </>
      );

    default: return null;
  }
}
