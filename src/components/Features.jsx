import React, { useState } from 'react';
import Card from './Card';

export default function Features() {
  const [activeTab, setActiveTab] = useState('xml');
  const [expandedIndex, setExpandedIndex] = useState(0);
  const [comparisonTab, setComparisonTab] = useState('weapon');

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const features = [
    {
      title: "Unrivaled Modding Base",
      description: "A Virtual File System (VFS) transparently handles asset loading, allowing overrides and addon layers under @mods virtual paths. Safe, sandboxed, and robust.",
      icon: "VFS",
      stats: [{ label: "Mod Engine", value: "Native" }, { label: "Scoping", value: "@mods" }],
      deepExplanation: "The God Sandbox Framework maps all content requests through a Virtual File System layer. When the engine requests a path like '@content/Weapons/M4', the VFS prioritizes mounted mods under the '@mods/' prefix. If an override asset exists, it loads instantly in place of the base game asset, avoiding file modification or directory bloating.",
      cppClass: "UModManager / VFSManager",
      registryFile: "content.xml",
      performanceFootprint: "0.00ms (Static VFS path hashing, zero runtime lookup lag)"
    },
    {
      title: "XML-Driven Architecture",
      description: "XML registries govern peds, weapons, assets, clothing, weather, and time cycles. Adjust values instantly without re-compiling C++ source code.",
      icon: "XML",
      stats: [{ label: "Data Format", value: "XML" }, { label: "Hot-Reload", value: "Supported" }],
      deepExplanation: "Decouples variables from binaries. The DataManager reads structured XML tables during the boot sequence, creating static runtime structures. Modders and designers can modify stats like base damage, speeds, mesh references, and AI capability flags in a text file. Flush commands let you hot-reload configurations instantly.",
      cppClass: "UDataManager",
      registryFile: "@data/Assets.xml, @data/Weapons.xml",
      performanceFootprint: "Boot time caching, zero overhead during gameplay loops"
    },
    {
      title: "Slate UI Performance",
      description: "Pure C++ Slate interface using the GodUIFramework. Zero UMG Blueprint widget overhead, rendering lightning-fast custom drawing elements.",
      icon: "UI",
      stats: [{ label: "Framework", value: "Slate C++" }, { label: "UMG / BP", value: "Zero" }],
      deepExplanation: "By completely avoiding Unreal's standard UMG wrapper system, the God Sandbox Framework's menus run on direct Slate rendering nodes. Widgets extend SCompoundWidget and run draw operations directly on the Slate thread. This eliminates dynamic Blueprint binding allocations, resulting in 0ms main thread tick overhead and robust memory footprint.",
      cppClass: "SGodFullscreenMenu / SGodInventorySlot",
      registryFile: "GodUIStyle.cpp / GodUIStyleColors.h",
      performanceFootprint: "0.00ms Tick (Direct C++ drawing without reflection overhead)"
    },
    {
      title: "High-Fidelity Graphics",
      description: "Powered by Unreal Engine 5.7 with advanced materials, Nanite virtualized geometry, Lumen global illumination, and dynamic weather cycles.",
      icon: "UE5",
      stats: [{ label: "Engine Version", value: "5.7" }, { label: "Physics", value: "Chaos" }],
      deepExplanation: "Leverages the bleeding-edge features of Unreal Engine 5.7. Materials dynamically interpolate parameters tied to the WorldCycleManager, adjusting dampness and reflectivity parameters in real time during storms. Direct support for Nanite meshes and Lumen global illumination ensures photorealistic environments.",
      cppClass: "AWorldCycleManager / UWeatherManager",
      registryFile: "@data/TimeCycles.xml",
      performanceFootprint: "GPU hardware-accelerated, multithreaded rendering pipeline"
    },
    {
      title: "Total Base Overrides",
      description: "Completely override the base game logic, assets, characters, or levels. Build custom blueprints to intercept and extend any core behavior.",
      icon: "OVR",
      stats: [{ label: "Inheritance", value: "Supported" }, { label: "BP Integration", value: "Full" }],
      deepExplanation: "Core gameplay classes are structured around dynamic components exposing clean interface APIs. Modders can subclass character or weapon archetypes via Blueprints or C++ and register them in Assets.xml. The engine instantiates the custom classes natively, swapping out gameplay logic cleanly.",
      cppClass: "APed / AWeaponActor / Blueprint Interfaces",
      registryFile: "Assets.xml (mod overrides definition)",
      performanceFootprint: "Native C++ dynamic instantiations"
    },
    {
      title: "Streamlined Mod Creation",
      description: "Package mods using standard Unreal Engine IOStore containers (.ucas / .utoc) directly from the Editor. Drop them into the Mods folder to mount them as an Addon, Override, or Standalone game.",
      icon: "MOD",
      stats: [{ label: "Packaging", value: "IOStore (.ucas/.utoc)" }, { label: "Mod Types", value: "Addon / Override / Standalone" }],
      deepExplanation: "Mod packaging leverages Unreal's native IOStore (.ucas / .utoc) container format and Editor tools. Developers compile assets inside the editor and drop the containers into the Mods folder. The engine's ModManager scans the content.xml descriptor to identify the mod structure: an Addon (appending assets), an Override (modifying base parameters), or a Standalone Mod (a complete custom game inside the game).",
      cppClass: "UModManager::ScanMods()",
      registryFile: "content.xml",
      performanceFootprint: "Negligible boot verification overhead"
    },
    {
      title: "High-Speed ScriptVM",
      description: "Expose gameplay APIs to custom C-like bytecode scripts. Handles tasks, missions, and ambient system events with native bindings.",
      icon: "VM",
      stats: [{ label: "Scripting VM", value: "ScriptVM" }, { label: "API Bindings", value: "Auto-Bound" }],
      deepExplanation: "Missions, ambient events, and local simulations compile into a C-like bytecode executed on the ScriptVM JIT interpreter. Supports latent scripting commands such as WAIT() and AWAIT_TASK() which yield process execution to the main game loop, protecting performance from thread starvation.",
      cppClass: "ScriptVM / ScriptManager",
      registryFile: "@scripts/ directories (.sc scripts)",
      performanceFootprint: "JIT interpreter stack, lightweight execution cycles"
    },
    {
      title: "Hierarchical Task Scheduler",
      description: "Non-blocking AI task manager. Schedules concurrent actions across slots and priority rings: Primary, Secondary, and Tertiary.",
      icon: "AI",
      stats: [{ label: "AI Ticking", value: "Time-Sliced" }, { label: "Priority Rings", value: "3 Slots" }],
      deepExplanation: "Schedules character behavior dynamically using concurrent priority rings. Non-conflicting tasks run side-by-side (e.g. Tertiary 'reload' triggers while Primary 'move-to-cover' is in execution). The Dumb Sensor controller passes perception spikes to the Scheduler, preventing O(n²) ticking problems.",
      cppClass: "UPedTaskManager / PedAIController",
      registryFile: "@data/Peds.xml (AI Personalities)",
      performanceFootprint: "Time-sliced task loops, dynamic tick gating"
    },
    {
      title: "Dynamic Animation Sets",
      description: "Switch entire blendspaces and animations at runtime to perfectly match active items, weapons, or character states dynamically.",
      icon: "ANIM",
      stats: [{ label: "Anim Engine", value: "C++ Graph" }, { label: "Swapping", value: "Runtime" }],
      deepExplanation: "Removes static anim graph node bloat. The animation set manager fetches anim references (like walk blendspaces, reloads, and recoil graphs) from XML configurations at runtime. Changing weapons swaps the active Anim Set inside the character AnimInstance instantly without state-machine transition drops.",
      cppClass: "UAnimationSetManager / UPedAnimInstance",
      registryFile: "@data/AnimationMovementSet.xml",
      performanceFootprint: "Runtime pointer swaps, zero animation ticking drag"
    },
    {
      title: "Chaos Vehicle Math",
      description: "Fully integrated Chaos dynamics. Configure custom vehicle suspensions, torque, brake torque, and tire behaviors in data XML.",
      icon: "CAR",
      stats: [{ label: "Simulation", value: "Chaos" }, { label: "Tuning", value: "XML-Driven" }],
      deepExplanation: "Directly uses Unreal's Chaos Vehicle framework, stripping legacy PhysX components. All physics coefficients (tire friction scale, suspension stiffness, spring dampening, differential setup) are fully exposed to XML configurations, allowing detailed physics tuning.",
      cppClass: "UChaosVehicleMovementComponent",
      registryFile: "@data/Vehicles.xml",
      performanceFootprint: "Calculated asynchronously on Physics Thread"
    },
    {
      title: "Multi-Tiered AI Scale",
      description: "Optimize performance dynamically. Transition entities through L0 (behavior trees) to L3 (offline database simulation) based on distance.",
      icon: "LOD",
      stats: [{ label: "L0-L3 Limits", value: "Dynamic" }, { label: "Tick Interval", value: "1hz - 20hz" }],
      deepExplanation: "AI population dynamically adjusts ticking rates depending on their proximity to the player. Nearby L0 NPCs tick at 20Hz with full Behavior Trees, L1 ambient NPCs tick at 5Hz, L2 mass AI ticks cosmetic paths at 1Hz, and L3 offline NPCs resolve database state ticks at 30-second cycles, ensuring smooth frame pacing.",
      cppClass: "PedAIController / AmbientPedPopulation",
      registryFile: "DataManager (distance configuration thresholds)",
      performanceFootprint: "Time-sliced population manager ticks"
    }
  ];

  const codeSnippets = {
    xml: {
      title: "Data-Driven XML Registries",
      subtitle: "Configure gameplay items, attributes, and visual paths without writing a single line of C++ code.",
      filename: "Weapons.xml",
      code: (
        <>
          <span className="token comment">&lt;!-- Configure a custom Assault Rifle definition --&gt;</span>{'\n'}
          <span className="token tag">&lt;Weapons&gt;</span>{'\n'}
          {`  `}<span className="token tag">&lt;Weapon</span> <span className="token attr">id</span>=<span className="token val">"W_Rifle_M4"</span> <span className="token attr">type</span>=<span className="token val">"AssaultRifle"</span> <span className="token attr">baseDamage</span>=<span className="token val">"32"</span> <span className="token attr">fireRate</span>=<span className="token val">"0.1"</span><span className="token tag">&gt;</span>{'\n'}
          {`    `}<span className="token tag">&lt;Mesh</span> <span className="token attr">path</span>=<span className="token val">"@content/Weapons/M4/SK_M4"</span><span className="token tag">/&gt;</span>{'\n'}
          {`    `}<span className="token tag">&lt;AnimSet</span> <span className="token attr">name</span>=<span className="token val">"Rifle_Standard"</span><span className="token tag">/&gt;</span>{'\n'}
          {`    `}<span className="token tag">&lt;Audio</span> <span className="token attr">name</span>=<span className="token val">"Weapon_M4_Fire"</span><span className="token tag">/&gt;</span>{'\n'}
          {`  `}<span className="token tag">&lt;/Weapon&gt;</span>{'\n'}
          <span className="token tag">&lt;/Weapons&gt;</span>
        </>
      )
    },
    scriptvm: {
      title: "ScriptVM C-Like Scripts",
      subtitle: "Write logic for missions, dialogues, and spawning triggered via the Virtual Machine.",
      filename: "mission.sc",
      code: (
        <>
          <span className="token comment">// Entry point for ambient population mission</span>{'\n'}
          <span className="token keyword">main</span>() &#123;{'\n'}
          {`  `}<span className="token comment">// Yield until player possess character</span>{'\n'}
          {`  `}AWAIT_PLAYER_POSSESSION();{'\n'}
          {`  `}{'\n'}
          {`  `}<span className="token comment">// Spawn an NPC dealer at coordinates</span>{'\n'}
          {`  `}<span className="token type">int</span> pedId = SpawnPed(<span className="token string">"P_Dealer_01"</span>, -<span className="token number">1540.0</span>, <span className="token number">320.5</span>, <span className="token number">12.4</span>, <span className="token number">90.0</span>);{'\n'}
          {`  `}SetPedRelationship(pedId, <span className="token string">"Player"</span>, <span className="token string">"Neutral"</span>);{'\n'}
          {`  `}{'\n'}
          {`  `}<span className="token comment">// Play spatial audio greetings</span>{'\n'}
          {`  `}PlayAudio(<span className="token string">"S_Dealer_Greeting"</span>, pedId);{'\n'}
          {`  `}{'\n'}
          {`  `}WAIT(<span className="token number">2000</span>);{'\n'}
          {`  `}UI_PushMenu(<span className="token string">"M_Dealer_Shop"</span>);{'\n'}
          &#125;
        </>
      )
    },
    slate: {
      title: "Pure C++ Slate Interfaces",
      subtitle: "Lightweight, hardware-accelerated user interfaces designed programmatically.",
      filename: "SCoreFullscreenMenu.cpp",
      code: (
        <>
          <span className="token keyword">void</span> SGodFullscreenMenu::Construct(<span className="token keyword">const</span> FArguments& InArgs) &#123;{'\n'}
          {`  `}ChildSlot{'\n'}
          {`  `}[{'\n'}
          {`    `}SNew(SOverlay){'\n'}
          {`    `}+ SOverlay::Slot(){'\n'}
          {`    `}.HAlign(HAlign_Center){'\n'}
          {`    `}.VAlign(VAlign_Center){'\n'}
          {`    `}[{'\n'}
          {`      `}SNew(SVerticalBox){'\n'}
          {`      `}+ SVerticalBox::Slot(){'\n'}
          {`      `}.AutoHeight(){'\n'}
          {`      `}.Padding(<span className="token number">10.f</span>){'\n'}
          {`      `}[{'\n'}
          {`        `}SNew(STextBlock){'\n'}
          {`        `}.Text(FText::FromString(<span className="token string">"GOD SANDBOX FRAMEWORK"</span>)){'\n'}
          {`        `}.Font(FGodUIStyle::GetFont(<span className="token string">"Title"</span>)){'\n'}
          {`        `}.ColorAndOpacity(FGodUIStyleColors::Accent){'\n'}
          {`      `}]{'\n'}
          {`    `}]{'\n'}
          {`  `}]{'\n'}
          {`  `}];{'\n'}
          &#125;
        </>
      )
    }
  };

  const comparisonData = {
    weapon: {
      title: "Adding a New Assault Rifle",
      subtitle: "You want to add an M4 Rifle with custom recoil, a specific fire rate, and its own sound effects.",
      blueprint: "Creates a child blueprint. Manually assigns the skeletal mesh. Goes into the event graph to override the FireRate variable. Drags out a PlaySoundAtLocation node. Connects a SpawnSystemAttached node for the muzzle flash. A month later, to rebalance the fire rate, they have to launch the editor, open the BP, change the float, recompile, and save.",
      cpp: "Creates AM4Rifle : public ABaseWeapon. Hardcodes ConstructorHelpers to find the mesh path. Overrides virtual void Fire() to execute native audio components. To change the base damage, they have to open Visual Studio, modify the header, recompile the codebase, and wait for Live Coding.",
      xml: "Opens Weapons.xml in Notepad. Adds a <Weapon> node with the mesh path, base damage, and fire rate. Saves the file. The weapon is instantly injected into the game, fully animated, and added to the AI loot pools. Time spent: 30 seconds."
    },
    ai: {
      title: "Creating a Unique AI Enemy Type",
      subtitle: "You want a heavy 'Thug' enemy that spawns with shotguns, is highly aggressive, but is physically unable to climb walls.",
      blueprint: "Opens a massive AI Behavior Tree. Adds a BlackBoard decorator to check a bCanClimb boolean before allowing the 'Jump Wall' node to execute. Opens the character blueprint to manually assign an array of shotgun classes to the loadout, praying they don't create hard references that bloat the memory.",
      cpp: "Adds bool bCanClimb to the base character. Writes a custom NavMesh query filter to exclude jump links. Creates a subclass AThugCharacter just to initialize a specific weapon array in the constructor.",
      xml: "Opens Peds.xml in Notepad. Adds a <Personality id=\"Thug\"> with <Capabilities canClimb=\"false\"/> and a shotgun in the <Loadout>. Done. The TaskManager mathematically ignores wall nodes, and the pedestrian spawns with an 80% chance for a shotgun."
    },
    anim: {
      title: "Changing Locomotion Animations",
      subtitle: "You want a character to walk differently when holding a heavy weapon.",
      blueprint: "Opens a 1,000-node Animation Blueprint. Creates a new 'Blend Poses by Enum' node. Wires up the new heavy weapon BlendSpace. Hooks up transition lines back and forth to the standard idle. The graph becomes slightly more unreadable.",
      cpp: "Adds native UAnimInstance transition rules checking GetWeaponType(). Adds a new UPROPERTY for the heavy BlendSpace and asks a technical animator to open the editor and slot it in.",
      xml: "Opens WeaponMovementSet.xml in Notepad. Assigns AnimSet=\"Heavy_Locomotion\" to the weapon. The AnimationSetManager hot-swaps the underlying graph memory at runtime. Zero AnimBP spaghetti touched."
    }
  };

  return (
    <section className="features-section" id="features">
      <div className="section-header">
        <h2 className="section-title">The Vision: Build Worlds, Not Boilerplate</h2>
        <p className="section-subtitle">
          This project aims to target developers and creators who want the full power of a AAA open-world system without the technical debt of building it from scratch. We target creators who don't want to write hundreds of classes or connect miles of spaghetti Blueprint nodes just to make a character walk and shoot. With the God Sandbox Framework, if you have the 3D meshes, the materials, and the animations, the engine handles the rest. Our master XML registries govern everything—from weapon stats and AI personalities to UI loading screens—allowing you to make sweeping gameplay changes and endless content tweaks without ever opening the Unreal Engine editor or touching a single line of C++.
        </p>
      </div>

      {/* Code Showcase Tab System */}
      <div className="tech-showcase-container">
        <div className="tech-showcase-info">
          <h3 className="tech-title">{codeSnippets[activeTab].title}</h3>
          <p className="tech-subtitle">{codeSnippets[activeTab].subtitle}</p>
          <div className="tech-tab-buttons">
            <button 
              className={`tech-tab-btn ${activeTab === 'xml' ? 'active' : ''}`}
              onClick={() => setActiveTab('xml')}
            >
              XML Registry
            </button>
            <button 
              className={`tech-tab-btn ${activeTab === 'scriptvm' ? 'active' : ''}`}
              onClick={() => setActiveTab('scriptvm')}
            >
              ScriptVM Bytecode
            </button>
            <button 
              className={`tech-tab-btn ${activeTab === 'slate' ? 'active' : ''}`}
              onClick={() => setActiveTab('slate')}
            >
              C++ Slate UI
            </button>
          </div>
          <div className="tech-specs-summary">
            <div className="spec-badge">
              <span className="spec-label">Latency</span>
              <span className="spec-value">Zero Overhead</span>
            </div>
            <div className="spec-badge">
              <span className="spec-label">Mod Layer</span>
              <span className="spec-value">Layered VFS</span>
            </div>
            <div className="spec-badge">
              <span className="spec-label">Hot Reloading</span>
              <span className="spec-value">Realtime</span>
            </div>
          </div>
        </div>

        <div className="code-editor-mock">
          <div className="editor-titlebar">
            <div className="editor-dots">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
            </div>
            <span className="editor-filename">{codeSnippets[activeTab].filename}</span>
          </div>
          <div className="editor-body">
            <pre className="code-pre">
              <code>{codeSnippets[activeTab].code}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Developer Comparison Section */}
      <div className="developer-comparison-section">
        <div className="section-header" style={{marginTop: '3rem'}}>
          <h2 className="section-title">Why Our Way is Better</h2>
          <p className="section-subtitle">See how common tasks are handled by different types of developers.</p>
        </div>
        
        <div className="comparison-tabs">
          <button className={`tech-tab-btn ${comparisonTab === 'weapon' ? 'active' : ''}`} onClick={() => setComparisonTab('weapon')}>Adding a Weapon</button>
          <button className={`tech-tab-btn ${comparisonTab === 'ai' ? 'active' : ''}`} onClick={() => setComparisonTab('ai')}>Customizing AI</button>
          <button className={`tech-tab-btn ${comparisonTab === 'anim' ? 'active' : ''}`} onClick={() => setComparisonTab('anim')}>Changing Animations</button>
        </div>

        <div className="comparison-content-box">
          <div className="comparison-header">
            <h4 className="comparison-title">{comparisonData[comparisonTab].title}</h4>
            <p className="comparison-subtitle">{comparisonData[comparisonTab].subtitle}</p>
          </div>
          <div className="comparison-grid">
            <div className="comparison-card bp">
              <div className="card-header">The Blueprint Guy</div>
              <p className="card-body">{comparisonData[comparisonTab].blueprint}</p>
            </div>
            <div className="comparison-card cpp">
              <div className="card-header">The C++ Guy</div>
              <p className="card-body">{comparisonData[comparisonTab].cpp}</p>
            </div>
            <div className="comparison-card xml">
              <div className="card-header">The XML Guy (You)</div>
              <p className="card-body">{comparisonData[comparisonTab].xml}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Collapsible Accordion Grid for Features Deep Dive */}
      <div className="features-grid-header">
        <h3 className="sub-section-title">Architectural Deep Dive</h3>
      </div>
      
      <div className="accordion-container">
        {features.map((f, i) => {
          const isExpanded = expandedIndex === i;
          return (
            <div className={`accordion-item ${isExpanded ? 'expanded' : ''}`} key={i}>
              <div className="accordion-header" onClick={() => toggleExpand(i)}>
                <div className="accordion-header-left">
                  <div className="accordion-icon-box">{f.icon}</div>
                  <h4 className="accordion-title">{f.title}</h4>
                </div>
                <div className="accordion-header-right">
                  <span className="accordion-tech-badge">{f.stats[0].value}</span>
                  <span className={`accordion-chevron ${isExpanded ? 'rotated' : ''}`}>&#9656;</span>
                </div>
              </div>
              
              <div className={`accordion-content-wrapper ${isExpanded ? 'open' : ''}`}>
                <div className="accordion-content">
                  <p className="accordion-desc">{f.description}</p>
                  
                  <div className="tech-details-box">
                    <h5 className="tech-details-title">Architectural Deep Dive</h5>
                    <p className="tech-details-text">{f.deepExplanation}</p>
                    
                    <div className="tech-specs-table">
                      <div className="spec-row">
                        <span className="spec-col-label">C++ Class / System</span>
                        <span className="spec-col-val font-mono">{f.cppClass}</span>
                      </div>
                      <div className="spec-row">
                        <span className="spec-col-label">Config/Registry File</span>
                        <span className="spec-col-val font-mono">{f.registryFile}</span>
                      </div>
                      <div className="spec-row">
                        <span className="spec-col-label">Performance Metric</span>
                        <span className="spec-col-val highlight">{f.performanceFootprint}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function FeaturesPreview({ onSeeMore }) {
  const previewFeatures = [
    {
      title: "Unrivaled Modding Base",
      description: "A Virtual File System (VFS) transparently handles loading, allowing overrides and addon layers under @mods virtual paths. Safe, sandboxed, and robust.",
      icon: "VFS",
      stats: [{ label: "Mod Engine", value: "Native" }, { label: "Scoping", value: "@mods" }]
    },
    {
      title: "XML-Driven Architecture",
      description: "XML registries govern peds, weapons, assets, clothing, weather, and time cycles. Adjust values instantly without re-compiling C++ source code.",
      icon: "XML",
      stats: [{ label: "Data Format", value: "XML" }, { label: "Hot-Reload", value: "Supported" }]
    },
    {
      title: "Slate UI Performance",
      description: "Pure C++ Slate interface using the Core UI Framework. Zero UMG Blueprint widget overhead, rendering lightning-fast custom drawing elements.",
      icon: "UI",
      stats: [{ label: "Framework", value: "Slate C++" }, { label: "UMG / BP", value: "Zero" }]
    },
    {
      title: "High-Fidelity Graphics",
      description: "Powered by Unreal Engine 5.7 with advanced materials, Nanite virtualized geometry, Lumen global illumination, and dynamic weather cycles.",
      icon: "UE5",
      stats: [{ label: "Engine Version", value: "5.7" }, { label: "Physics", value: "Chaos" }]
    }
  ];

  return (
    <section className="features-preview-section" id="features-preview">
      <div className="section-header">
        <h2 className="section-title">Core Features</h2>
        <p className="section-subtitle">
          The God Sandbox Framework decouples gameplay from hardcoded logic, delivering maximum performance and absolute freedom.
        </p>
      </div>
      
      <div className="grid-container">
        {previewFeatures.map((f, i) => (
          <Card key={i} {...f} />
        ))}
      </div>

      <div className="see-more-container">
        <button className="god-btn primary large see-more-btn" onClick={onSeeMore}>
          See More Features <span className="btn-arrow">&rarr;</span>
        </button>
      </div>
    </section>
  );
}
