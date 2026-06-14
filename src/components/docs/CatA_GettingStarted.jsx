// CatA_GettingStarted.jsx
// Auto-split from Docs.jsx — edit this file to update documentation pages.
// DO NOT import or render directly; use renderPage() and getOutline() exports.
import React from 'react';
import { Link } from 'react-router-dom';
import { GodCodeBlock } from './docsHelpers';

/**
 * Returns the rendered article JSX for the given docId,
 * or null if this category doesn't own that id.
 */
export function renderPage(docId) {
  switch (docId) {

    case 'intro':
      return (
        <article className="doc-article">
          <header className="doc-header">
            <span className="doc-category-tag">Getting Started</span>
            <h1 className="doc-main-title">Introduction to the JustLive Platform</h1>
            <p className="doc-lead-para">
              JustLive is a standalone, fully data-driven runtime environment built on Unreal Engine 5.7. It is designed to decouple visual assets and game systems from strict binary structures, offering developers complete scripting and modding freedom.
            </p>
          </header>

          <section className="doc-section">
            <h2 id="what-is-justlive">What is JustLive?</h2>
            <p>
              JustLive is a standalone, fully data-driven runtime environment and open-world platform built on Unreal Engine 5.7. It is designed to completely decouple visual assets and game systems from strict binary structures, offering developers, creators, and players total scripting and modding freedom. At its core, JustLive shifts the paradigm of game development by separating core gameplay mechanics from editor compile cycles. Rather than writing hardcoded rules inside blueprints or actor source classes, gameplay is handled dynamically at runtime through a specialized Virtual Machine (ScriptVM) and centralized XML databases.
            </p>
            <div className="doc-alert important">
              <div className="alert-header">ARCHITECTURAL MANDATE</div>
              <div className="alert-body">
                All systems follow the rule: <strong>"Write it C++, Make it XML, Abstract the Memory."</strong> Modifying values like character health, reload thresholds, physics multipliers, or visual models never requires recompiling binaries.
              </div>
            </div>
          </section>

          <section className="doc-section">
            <h2 id="why-it-was-made">Why It Was Made</h2>
            <p>
              Modern game engines are powerful but inherently rigid. Creating expansive, moddable, and dynamic open worlds often leads to massive technical debt, intertwined dependencies, and broken updates. JustLive was built to solve this by creating an architecture that treats every game system—from weapons and pedestrians to vehicle physics and economy—as generic, data-driven Lego blocks. It allows the community to inject their own rules, assets, and logic into the engine without needing to touch the fragile C++ source code.
            </p>
          </section>

          <section className="doc-section">
            <h2 id="who-is-this-for">Who Is This For?</h2>
            <p>
              JustLive is uniquely structured to cater to a diverse range of creators:
            </p>
            <ul className="doc-list">
              <li><strong>Modders &amp; Scripters:</strong> Anyone who wants to write custom mission scripts, build new weapons, tweak AI, or swap vehicle models using simple, accessible XML configuration files and lightweight <code>.sc</code> bytecode. No C++ compiling required.</li>
              <li><strong>Blueprint Developers:</strong> Creators who want to hook into robust, pre-built C++ APIs to build unique standalone games without worrying about the underlying low-level memory management or physics solvers.</li>
              <li><strong>C++ Architects:</strong> Advanced developers who want to license the core engine structure to build high-performance, commercial open-world games on a rock-solid, data-driven foundation.</li>
            </ul>
          </section>

          <section className="doc-section">
            <h2 id="usage-and-sharing">Playing, Sharing, and Licensing</h2>
            <p>
              The platform embraces a hybrid architecture combining a high-performance C++ core with a highly accessible data layer.
            </p>
            <ul className="doc-list">
              <li><strong>Players:</strong> Can easily drag and drop custom mod folders, XML files, and compiled scripts into the public documents directory (even on mobile devices) to play entirely new game experiences instantly.</li>
              <li><strong>Creators:</strong> Can share their mods effortlessly as standalone XML/Script packages, bypassing traditional app store restrictions and complicated asset cookers.</li>
              <li><strong>Commercial Studios:</strong> Can adopt the Dual-Licensing structure, retaining closed-source C++ core mechanics while exposing the XML and ScriptVM tiers to build rich, mod-friendly ecosystems for their playerbase.</li>
            </ul>
            <p style={{ marginTop: '1rem' }}>
              For a detailed breakdown of specific XML databases, please refer to the <Link to="/docs/xml-database-reference/xml_peds">XML Database Reference</Link>.
            </p>
          </section>
        </article>
      );

    case 'vfs':
      return (
        <article className="doc-article">
          <header className="doc-header">
            <span className="doc-category-tag">Getting Started</span>
            <h1 className="doc-main-title">VFS Scopes & Directory Structure</h1>
            <p className="doc-lead-para">
              JustLive abstracts the physical file structure on Windows into a Virtual File System (VFS) to enable clean, transparent mod integration.
            </p>
          </header>

          <section className="doc-section">
            <h2 id="virtual-paths">Virtual Path Scopes</h2>
            <p>
              To override or register assets safely, paths must refer to VFS scope prefixes. The engine intercepts these strings and mounts them relative to mod override trees.
            </p>
            
            <table className="doc-table">
              <thead>
                <tr>
                  <th>Prefix</th>
                  <th>Resolution Target</th>
                  <th>Example Usage</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>@data</code></td>
                  <td>Maps to <code>Data/</code> — central XML registries and text configurations.</td>
                  <td><code>ParseXML("@data/Weapons.xml")</code></td>
                </tr>
                <tr>
                  <td><code>@content</code></td>
                  <td>Maps to the Unreal Engine <code>/Game/</code> namespace virtual root. At runtime, assets mount from cooked IO Store containers (<code>.ucas</code> / <code>.utoc</code>), falling back to standard Pak archives (<code>.pak</code>) if IO Store is disabled.</td>
                  <td><code>@content/Weapons/M4/SK_M4</code></td>
                </tr>
                <tr>
                  <td><code>@scripts</code></td>
                  <td>Maps to <code>Scripts/</code> — bytecode script files executed by ScriptVM.</td>
                  <td><code>@scripts/Mission.sc</code></td>
                </tr>
                <tr>
                  <td><code>@mods</code></td>
                  <td>Maps to <code>Mods/</code> — custom mod package directories.</td>
                  <td>Auto-resolved override path priority.</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="doc-section">
            <h2 id="override-priority">VFS Priority Resolution</h2>
            <p>
              When the game queries an asset, the file loader sweeps the priority list. Here is a C++ code snippet representing how the DataManager resolves paths:
            </p>

            <GodCodeBlock 
              language="cpp" 
              code={`// Example: Resolving a VFS string in DataManager
FString VirtualPath = "@data/Weapons.xml";
FString ResolvedPath = VFSManager->ResolveVirtualPath(VirtualPath);

// VFS Priority:
// 1. Check active Standalone Mods (Locks namespace to Mod)
// 2. Check Override Mods (Mods/ModName/)
// 3. Check Addon Mods
// 4. Base game fallbacks`}
            />

            <div className="doc-alert important" style={{ marginTop: '2rem' }}>
              <div className="alert-header">GETTING STARTED BRIEF</div>
              <div className="alert-body">
                This section provides a high-level overview of path scoping. To understand asset cooking, packaging configurations, and mod manifests, proceed to the <Link to="/docs/modding-foundations/iostore">Modding Foundations</Link> documentation.<br/>
                For a deep dive into the VFS Manager's C++ inner workings, refer to the <Link to="/docs/vfs-data-internals/vfs_deep">VFSManager Deep Dive</Link>.
              </div>
            </div>
          </section>
        </article>
      );


    case 'boot':
      return (
        <article className="doc-article">
          <header className="doc-header">
            <span className="doc-category-tag">Getting Started</span>
            <h1 className="doc-main-title">Engine Boot Sequence</h1>
            <p className="doc-lead-para">
              Understanding the lifecycle of the engine boot sequence is critical for constructing standalone extensions. JustLive overrides Unreal's standard map loading flow to prioritize loading data registries before any level is drawn.
            </p>
          </header>

          <section className="doc-section">
            <h2 id="boot-lifecycle">Boot Lifecycle Flow</h2>
            <p>
              Before any game world, player character, or UI is loaded, the engine initializes its fundamental architecture in a strict order:
            </p>
            <ul className="doc-list">
              <li><strong>1. VFS Mounts:</strong> The Virtual File System binds physical directories on disk (like <code>Mods/</code> and <code>Data/</code>) to virtual scopes (like <code>@mods</code> and <code>@data</code>).</li>
              <li><strong>2. Mod Scanning:</strong> The engine scans for active mods, resolving whether they completely override the base game or just add new items.</li>
              <li><strong>3. Master Registry Parsing:</strong> The <code>DataManager</code> reads the holy master registry (<code>Assets.xml</code>) and cascades the loading commands to sub-managers (Audio, VFX, Weapons, Peds).</li>
            </ul>
            <p style={{ marginTop: '1rem' }}>
              Below is a simplified architectural trace of this sequence:
            </p>
            <GodCodeBlock 
              language="cpp" 
              code={`// Simplified Core Engine Boot Sequence
GameInstance::Init()
 └─> DataManager::Boot()
     ├─> VFSManager::Mount()                   // Mounts @data, @content, @scripts, @mods
     ├─> ModManager::ScanMods()                // Override vs Addon detection
     ├─> ParseXML("@data/Assets.xml")          // Holy Master Registry
     │   ├─> AudioManager::LoadSoundDefinitions()
     │   ├─> VFXManager::LoadVFXDefinitions()
     │   ├─> PedManager::LoadDefinitions()
     │   ├─> WeaponManager::LoadWeaponDefinitions()
     │   └─> AnimationSetManager::LoadFromXML()
     └─> InitializeAssetLoaders()`}
            />
          </section>

          <section className="doc-section">
            <h2 id="subsystem-initialization">Subsystem Initialization</h2>
            <p>
              Managers are decoupled from standard world ticking loops. Rather than placing managers as floating actors in a level, they run as standalone background services (Subsystems) attached directly to the Engine or Game Instance. 
            </p>
            <div className="doc-alert warning">
              <div className="alert-header">LIFECYCLE WARNING</div>
              <div className="alert-body">
                Never place global manager logic inside <code>AActor::Tick</code>. Background tasks and global states must be managed by these Subsystems to ensure thread safety and persist across map changes.
              </div>
            </div>
          </section>

          <section className="doc-section">
            <h2 id="bypassing-built-in-ui">Bypassing the Built-in UI (Commercial Licensing)</h2>
            <p>
              For commercial developers utilizing the C++ SDK, you will often want to strip out JustLive's default Slate menus (GodUIFramework) and replace them with your own custom UMG widget screens and main menus.
            </p>
            <p>
              The engine is built to support this gracefully. 
            </p>
            <div className="doc-alert tip">
              <div className="alert-header">HOW TO DISABLE DEFAULT UI</div>
              <div className="alert-body">
                Create a custom Blueprint inherited from <code>ASandboxGameMode</code>. In the Class Defaults panel, check the <strong>Disable Built In UI</strong> flag. The engine will skip spawning the built-in startup logos, pause menus, and player HUD overlays, leaving a clean slate for you to initialize your own custom interface.
              </div>
            </div>
          </section>
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

    case 'intro':
      return (
        <>
          <li><a href="#what-is-justlive">What is JustLive?</a></li>
          <li><a href="#why-it-was-made">Why It Was Made</a></li>
          <li><a href="#who-is-this-for">Who Is This For?</a></li>
          <li><a href="#usage-and-sharing">Usage &amp; Licensing</a></li>
        </>
      );

    case 'vfs':
      return (
        <>
          <li><a href="#virtual-paths">Virtual Path Scopes</a></li>
          <li><a href="#override-priority">VFS Priority Resolution</a></li>
        </>
      );

    case 'boot':
      return (
        <>
          <li><a href="#boot-lifecycle">Boot Lifecycle Flow</a></li>
          <li><a href="#subsystem-initialization">Subsystem Initialization</a></li>
          <li><a href="#bypassing-built-in-ui">Bypassing the Built-in UI</a></li>
        </>
      );

    default: return null;
  }
}
