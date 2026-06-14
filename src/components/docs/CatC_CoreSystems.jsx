// CatC_CoreSystems.jsx
// Category C: Core Systems Deep Dive
import React from 'react';
import { WorkflowTabGroup, GodCodeBlock } from './docsHelpers';

/**
 * Returns the rendered article JSX for the given docId,
 * or null if this category doesn't own that id.
 */
export function renderPage(docId) {
  switch (docId) {

    case 'media':
      return (
        <article className="doc-article">
          <header className="doc-header">
            <span className="doc-category-tag">Core Systems</span>
            <h1 className="doc-main-title">Media Systems (Audio, VFX, Decals)</h1>
            <p className="doc-lead-para">
              JustLive coordinates audio, visual effects, and environmental decals using a unified, data-driven framework.
            </p>
          </header>

          <WorkflowTabGroup
            xmlContent={
              <>
                <section className="doc-section">
                  <h2 id="media-audio-xml">Audio Management (XML)</h2>
                  <p>Audio is defined in <code>Data/Audio/AudioWeapons.xml</code> or <code>AudioGeneric.xml</code> using container folders for randomized playback.</p>
                  <GodCodeBlock
                    language="xml"
                    code={`<!-- Pattern B: Folder Container Resolution -->
<SoundFolder name="Weapon_Rifle">
  <Sound name="Fire" path="@content/Audio/Weapons/M4/Fire1"/>
</SoundFolder>`}
                  />
                </section>
              </>
            }
            bpContent={
              <>
                <section className="doc-section">
                  <h2 id="media-audio-bp">Audio Management (SDK)</h2>
                  <p>Invoke audio events directly from C++ or Blueprints. Suffix index names are resolved automatically:</p>
                  <GodCodeBlock
                    language="cpp"
                    code={`// Spawn sound at location using the random index folder
UAudioManager::Get(this)->PlaySound("Weapon_Rifle_Fire", Location);`}
                  />
                </section>
              </>
            }
          />
        </article>
      );

    case 'datamanager':
      return (
        <article className="doc-article">
          <header className="doc-header">
            <span className="doc-category-tag">Core Systems</span>
            <h1 className="doc-main-title">Central Data &amp; Class Architecture</h1>
            <p className="doc-lead-para">
              <code>UDataManager</code> orchestrates XML registry parsing, mounts virtual directories, and acts as the central coordinator for the JustLive game engine.
            </p>
          </header>

          <section className="doc-section">
            <h2 id="datamanager-overview">Core C++ Class Architecture &amp; System Connections</h2>
            <p>
              JustLive is constructed as a decoupled modular monolith. Subsystems are written in C++ as ticking subsystems, while game mechanics, assets, and definitions are dynamically registered at boot. Click on any class header to view its definition:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', margin: '1.5rem 0' }}>
              
              <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-panel)', border: '1px solid var(--line-primary)', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ color: 'var(--accent)', marginBottom: '0.75rem' }}>1. System Kernel &amp; Data VFS</h4>
                <ul className="doc-list" style={{ paddingLeft: '1rem' }}>
                  <li>
                    <a href="file:///d:/Unreal%20Projects/JustLive/Source/JustLive/Core/DataManager.h" style={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'var(--text-bright)' }}>UDataManager</a>: 
                    The boot hub. Parses the master XML manifest and distributes configs to other sub-managers.
                  </li>
                  <li>
                    <a href="file:///d:/Unreal%20Projects/JustLive/Source/JustLive/Core/VFS/VFSManager.h" style={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'var(--text-bright)' }}>UVFSManager</a>: 
                    Intercepts path prefixes (like <code>@data</code>, <code>@content</code>, <code>@scripts</code>) and redirects queries to active mod directories.
                  </li>
                  <li>
                    <a href="file:///d:/Unreal%20Projects/JustLive/Source/JustLive/Core/ModManager.h" style={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'var(--text-bright)' }}>UModManager</a>: 
                    Scans and mounts packaged mod archives (<code>.ucas</code> / <code>.utoc</code>) transparently.
                  </li>
                  <li>
                    <a href="file:///d:/Unreal%20Projects/JustLive/Source/JustLive/Core/VFS/GXMLCrypto.h" style={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'var(--text-bright)' }}>FGXMLCrypto</a>: 
                    Handles AES-256 decryption of XML assets on production builds.
                  </li>
                  <li>
                    <a href="file:///d:/Unreal%20Projects/JustLive/Source/JustLive/Core/AssetStreamManager.h" style={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'var(--text-bright)' }}>UAssetStreamManager</a>: 
                    Executes async asset loading, freeing the main thread from freeze thresholds.
                  </li>
                </ul>
              </div>

              <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-panel)', border: '1px solid var(--line-primary)', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ color: 'var(--accent)', marginBottom: '0.75rem' }}>2. Pedestrian Simulation &amp; AI</h4>
                <ul className="doc-list" style={{ paddingLeft: '1rem' }}>
                  <li>
                    <a href="file:///d:/Unreal%20Projects/JustLive/Source/JustLive/Gameplay/Peds/Ped.h" style={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'var(--text-bright)' }}>APed</a>: 
                    The monolithic character pawn class. Outsources logic to components to prevent bloated structures.
                  </li>
                  <li>
                    <a href="file:///d:/Unreal%20Projects/JustLive/Source/JustLive/Gameplay/Peds/Components/AttributesComponent.h" style={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'var(--text-bright)' }}>UAttributesComponent</a>: 
                    Tracks attributes (health, stamina) and capability gates (like <code>CanClimb</code>).
                  </li>
                  <li>
                    <a href="file:///d:/Unreal%20Projects/JustLive/Source/JustLive/Gameplay/Peds/Components/IdentityComponent.h" style={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'var(--text-bright)' }}>UIdentityComponent</a>: 
                    Keeps personality metrics (29-axis traits) and faction standing logs.
                  </li>
                  <li>
                    <a href="file:///d:/Unreal%20Projects/JustLive/Source/JustLive/Gameplay/Peds/Components/InventoryComponent.h" style={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'var(--text-bright)' }}>UInventoryComponent</a>: 
                    Caches weapons (<code>FWeaponInstance</code>) and tracks live caliber counts.
                  </li>
                  <li>
                    <a href="file:///d:/Unreal%20Projects/JustLive/Source/JustLive/Gameplay/Peds/Components/PhysicsRagdollComponent.h" style={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'var(--text-bright)' }}>UPhysicsRagdollComponent</a>: 
                    Handles capsule blending, impact impulses, and physics-driven ragdoll recovery.
                  </li>
                  <li>
                    <a href="file:///d:/Unreal%20Projects/JustLive/Source/JustLive/Gameplay/Peds/PedManager.h" style={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'var(--text-bright)' }}>UPedManager</a>: 
                    Caches NPC definitions and coordinates population schedules.
                  </li>
                  <li>
                    <a href="file:///d:/Unreal%20Projects/JustLive/Source/JustLive/Gameplay/Peds/PedFactory.h" style={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'var(--text-bright)' }}>UPedFactory</a>: 
                    The instantiator. Safe spawning pipeline that sets meshes, outfits, and stats.
                  </li>
                  <li>
                    <a href="file:///d:/Unreal%20Projects/JustLive/Source/JustLive/Gameplay/Peds/AmbientPedPopulation.h" style={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'var(--text-bright)' }}>UAmbientPedPopulation</a>: 
                    Subsystem that dynamically streams ambient NPCs in/out based on active zones.
                  </li>
                </ul>
              </div>

              <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-panel)', border: '1px solid var(--line-primary)', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ color: 'var(--accent)', marginBottom: '0.75rem' }}>3. Combat &amp; Ballistics</h4>
                <ul className="doc-list" style={{ paddingLeft: '1rem' }}>
                  <li>
                    <a href="file:///d:/Unreal%20Projects/JustLive/Source/JustLive/Gameplay/Weapons/WeaponManager.h" style={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'var(--text-bright)' }}>UWeaponManager</a>: 
                    Caches template stats (<code>FWeaponStaticInfo</code>) loaded from <code>Weapons.xml</code>.
                  </li>
                  <li>
                    <a href="file:///d:/Unreal%20Projects/JustLive/Source/JustLive/Gameplay/Weapons/Weapon.h" style={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'var(--text-bright)' }}>AWeapon</a>: 
                    The physical equipped actor. Coordinates with the active <code>FWeaponInstance</code> data model.
                  </li>
                  <li>
                    <a href="file:///d:/Unreal%20Projects/JustLive/Source/JustLive/Gameplay/Weapons/WeaponFiringComponent.h" style={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'var(--text-bright)' }}>UWeaponFiringComponent</a>: 
                    Solves trace points, fires tracers, and registers audio noise ranges.
                  </li>
                  <li>
                    <a href="file:///d:/Unreal%20Projects/JustLive/Source/JustLive/Gameplay/Weapons/WeaponVisualsComponent.h" style={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'var(--text-bright)' }}>UWeaponVisualsComponent</a>: 
                    Updates cosmetic assets, barrel alignments, and accessories on weapon meshes.
                  </li>
                  <li>
                    <a href="file:///d:/Unreal%20Projects/JustLive/Source/JustLive/Gameplay/Weapons/WeaponStatComponent.h" style={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'var(--text-bright)' }}>UWeaponStatComponent</a>: 
                    Compiles stat modifiers (recoil, spread) by compounding base stats with attachments.
                  </li>
                  <li>
                    <a href="file:///d:/Unreal%20Projects/JustLive/Source/JustLive/Gameplay/Weapons/ProjectileSystem/AdvancedProjectileManager.h" style={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'var(--text-bright)' }}>UAdvancedProjectileManager</a>: 
                    Controls dynamic LOD matrix sweeps (Cinematic vs. Hitscan vs. Statistical counts).
                  </li>
                </ul>
              </div>

              <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-panel)', border: '1px solid var(--line-primary)', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ color: 'var(--accent)', marginBottom: '0.75rem' }}>4. Bytecode Script VM</h4>
                <ul className="doc-list" style={{ paddingLeft: '1rem' }}>
                  <li>
                    <a href="file:///d:/Unreal%20Projects/JustLive/Plugins/Scripting/Source/Scripting/Public/ScriptManager.h" style={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'var(--text-bright)' }}>UScriptManager</a>: 
                    Subsystem executing missions and ticking active script threads.
                  </li>
                  <li>
                    <a href="file:///d:/Unreal%20Projects/JustLive/Plugins/Scripting/Source/Scripting/Public/ScriptVM.h" style={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'var(--text-bright)' }}>UScriptVM</a>: 
                    Bytecode execution engine that runs JIT instruction sequences.
                  </li>
                  <li>
                    <a href="file:///d:/Unreal%20Projects/JustLive/Plugins/Scripting/Source/Scripting/Public/ScriptLatentManager.h" style={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'var(--text-bright)' }}>UScriptLatentManager</a>: 
                    Yields script fibers during waiting instructions without locking the game thread.
                  </li>
                  <li>
                    <a href="file:///d:/Unreal%20Projects/JustLive/Source/JustLive/Scripting/ScriptAutoBinder.h" style={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'var(--text-bright)' }}>FScriptAutoBinder</a>: 
                    Fuses methods marked with <code>ScriptBind</code> metadata directly to the VM's callable map.
                  </li>
                </ul>
              </div>

            </div>
          </section>

          <section className="doc-section">
            <h2 id="datamanager-connections">System Integration &amp; Lifecycles</h2>
            <p>
              These classes are bound together in distinct execution loops:
            </p>
            <ul className="doc-list">
              <li><strong>The Boot Sequence:</strong> <code>UDataManager</code> reads <code>Assets.xml</code> &rarr; calls <code>UPedManager</code> &amp; <code>UWeaponManager</code> to cache static XML structures &rarr; mounts overriding files via <code>UVFSManager</code>.</li>
              <li><strong>The Spawning Loop:</strong> <code>UAmbientPedPopulation</code> ticks &rarr; queries zones &rarr; invokes <code>UPedFactory</code> to instantiate <code>APed</code> &rarr; attaches dynamic components to set randomized outfits and stats.</li>
              <li><strong>The Combat Loop:</strong> <code>APed</code> pulls trigger &rarr; <code>AWeapon</code> spawns &rarr; <code>UWeaponFiringComponent</code> handles fire rate and queries <code>UAdvancedProjectileManager</code> &rarr; registers auditory events to AI.</li>
              <li><strong>The Scripting Loop:</strong> <code>UScriptManager</code> schedules scripts &rarr; executes instructions on <code>UScriptVM</code> &rarr; translates native calls via <code>FScriptAutoBinder</code>.</li>
            </ul>
          </section>

          <WorkflowTabGroup
            xmlContent={
              <>
                <section className="doc-section">
                  <h2 id="datamanager-registry">Registering Databases (XML)</h2>
                  <p>All database files must be registered in the master assets index. Modify this file to mount definitions:</p>
                  <GodCodeBlock
                    language="xml"
                    code={`<!-- Data/Assets.xml -->
<Assets>
  <WeaponRegistry path="@data/Weapons/Weapons.xml" />
  <PedRegistry path="@data/Peds/Peds.xml" />
  <AudioRegistry path="@data/Audio/AudioWeapons.xml" />
</Assets>`}
                  />
                </section>
              </>
            }
            bpContent={
              <>
                <section className="doc-section">
                  <h2 id="datamanager-sdk">Asset Management API (SDK)</h2>
                  <p>In C++ or Blueprints, query the DataManager to resolve scoped VFS paths or load database definitions manually:</p>
                  <GodCodeBlock
                    language="cpp"
                    code={`// Dynamic path resolution inside standard C++ code
FString RealPath = UDataManager::Get(this)->GetVFS()->Resolve(TEXT("@data/Weapons/Weapons.xml"));`}
                  />
                </section>
              </>
            }
          />
        </article>
      );

    case 'managers':
      return (
        <article className="doc-article">
          <header className="doc-header">
            <span className="doc-category-tag">Core Systems</span>
            <h1 className="doc-main-title">Weather &amp; Environment</h1>
            <p className="doc-lead-para">
              <code>UWorldCycleManager</code> handles time progression and weather transitions.
            </p>
          </header>
          <WorkflowTabGroup
            xmlContent={
              <>
                <section className="doc-section">
                  <h2 id="managers-weather-xml">XML Weather Presets</h2>
                  <p>Define atmospheric keyframes and day-night lighting cycles inside <code>Data/TimeCycles.xml</code>:</p>
                  <GodCodeBlock
                    language="xml"
                    code={`<!-- TimeCycle weather preset definition -->
<TimeCycle name="Storm_Heavy">
  <InterpolationKey time="12:00" skyColor="40, 45, 55" windSpeed="2.5" />
</TimeCycle>`}
                  />
                </section>
              </>
            }
            bpContent={
              <>
                <section className="doc-section">
                  <h2 id="managers-weather-bp">Weather Control (SDK)</h2>
                  <p>Trigger weather transitions procedurally in C++ or Blueprint sequences:</p>
                  <GodCodeBlock
                    language="cpp"
                    code={`// Transition global atmosphere over dynamic time intervals
UWorldCycleManager::Get(this)->TransitionToWeather("Storm_Heavy", 8.0f);`}
                  />
                </section>
              </>
            }
          />
        </article>
      );

    default: return null;
  }
}

/**
 * Returns the outline <li> links for the given docId,
 * or null if this category doesn't own that id.
 */
export function getOutline(docId) {
  switch (docId) {
    case 'media':
      return (
        <>
          <li><a href="#media-audio-xml">Audio Management</a></li>
        </>
      );
    case 'datamanager':
      return (
        <>
          <li><a href="#datamanager-registry">Registering Definitions</a></li>
        </>
      );
    case 'managers':
      return (
        <>
          <li><a href="#managers-weather-xml">Weather Presets</a></li>
        </>
      );
    default: return null;
  }
}
