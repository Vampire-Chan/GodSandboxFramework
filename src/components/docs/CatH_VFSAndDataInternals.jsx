// CatH_VFSAndDataInternals.jsx
// Auto-split from Docs.jsx — edit this file to update documentation pages.
// DO NOT import or render directly; use renderPage() and getOutline() exports.
import React from 'react';
import { GodCodeBlock } from './docsHelpers';

/**
 * Returns the rendered article JSX for the given docId,
 * or null if this category doesn't own that id.
 */
export function renderPage(docId) {
  switch (docId) {

    case 'vfs_deep':
      return (
        <article className="doc-article">
          <header className="doc-header">
            <span className="doc-category-tag">VFS & Data Internals</span>
            <h1 className="doc-main-title">VFSManager & ModManager Deep Dive</h1>
            <p className="doc-lead-para">
              The Virtual File System (VFS) and Mod Manager act as the gatekeepers for all asset loading in JustLive. By intercepting file paths, they enable transparent modding without altering the physical engine installation.
            </p>
          </header>

          <section className="doc-section">
            <h2 id="what-is-vfs">What is the VFS?</h2>
            <p>
              The <code>UVFSManager</code> creates a layer of abstraction between the game's code and the physical hard drive. Instead of asking Windows to open <code>D:/Games/JustLive/Data/Weapons.xml</code>, the engine queries the VFS for <code>@data/Weapons.xml</code>.
            </p>
            <p>
              The VFS resolves this virtual path by checking a priority-sorted list of physical directories. If a mod has mapped itself to the <code>@data</code> scope with a higher priority than the base game, the VFS seamlessly returns the mod's file instead.
            </p>
            
            <div className="doc-alert important">
              <div className="alert-header">THE UNREAL CONTAINER HOOK</div>
              <div className="alert-body">
                The VFS isn't just for text files! It intercepts Unreal Engine's native <code>/Game/</code> paths. When a path like <code>@content/Weapons/SK_M4</code> is resolved, it natively hooks into cooked IO Store containers (<code>.ucas</code>/<code>.utoc</code>) or standard Pak archives, allowing modders to hot-swap completely compiled assets.
              </div>
            </div>
          </section>

          <section className="doc-section">
            <h2 id="mod-types">The Four Mod Types</h2>
            <p>
              The <code>UModManager</code> categorizes mods into four distinct types via the <code>&lt;Metadata type="..."&gt;</code> node. However, mechanically, the system is much simpler: <strong>Addons and Overrides are exactly the same thing.</strong>
            </p>

            <h3 id="type-addon-override">1 & 2. Addons & Overrides (type="addon" / "override")</h3>
            <p>
              <strong>The Secret:</strong> Under the hood, the engine treats these identically. Both simply mount their folders into the VFS.
            </p>
            <ul className="doc-list">
              <li><strong>Addon:</strong> Typically provides <em>new</em> paths (e.g., <code>@content/Weapons/NewGun.uasset</code>). Because the path is new, it adds content.</li>
              <li><strong>Override:</strong> Typically provides <em>existing</em> paths (e.g., <code>@content/Characters/Barbarian/SKM_Barbarian.uasset</code>). Because the path matches a base game file, the VFS serves the mod's file instead of the original.</li>
            </ul>
            <p>
              This parity also extends to XML DataAssets. If an Addon mod defines a new <code>&lt;Prop id="ErenYegerStatue"&gt;</code> with a custom mesh path, and later an Override mod defines the exact same <code>id="ErenYegerStatue"</code> but with a different mesh path, the DataManager simply overwrites the memory struct. The last loaded data wins. To ensure Overrides consistently beat Addons and base game files, they are simply given a higher VFS Priority (100 vs 0).
            </p>

            <h3 id="type-standalone">3. Standalone Mods (type="standalone")</h3>
            <p>
              <strong>Purpose:</strong> Total conversion mods. These are essentially entirely new games running on the JustLive engine.<br/>
              <strong>VFS Behavior:</strong> Launched via a dedicated <code>LaunchStandalone()</code> sequence. When launched, the VFS is completely cleared of the base game, and the Standalone Mod becomes the new root. It supplies its own master map (via the <code>entrymap</code> attribute) and UI.
            </p>

            <h3 id="type-standalone-addon">4. Standalone-Addon (type="addon" dependency="StandaloneModName")</h3>
            <p>
              <strong>Purpose:</strong> An Addon/Override that is built explicitly for a specific Standalone Mod.<br/>
              <strong>VFS Behavior:</strong> These remain dormant during normal gameplay. If the user launches the specific Standalone Mod listed in the <code>dependency</code> attribute, the ModManager automatically detects the relationship and mounts this addon on top of the Standalone's VFS. It behaves exactly like standard Addons/Overrides, but its scope is entirely restricted to its parent Standalone mod.
            </p>
          </section>

          <section className="doc-section">
            <h2 id="vfs-resolution">VFS Priority Stack</h2>
            <p>
              When <code>VFSManager::Resolve("@data/Peds.xml")</code> is called, the manager iterates backward (highest priority first) through the MountPoints array:
            </p>
            <ol className="doc-list">
              <li><strong>Priority 100+:</strong> Override Mods (Last mounted wins ties).</li>
              <li><strong>Priority 0:</strong> Addon Mods.</li>
              <li><strong>Priority 0:</strong> Base Game root.</li>
            </ol>
            <GodCodeBlock 
              language="cpp" 
              code={`// Inside UVFSManager::Resolve(VirtualPath)
// VirtualPath = "@data/Peds.xml"

TArray<FVFSMountEntry>& Entries = MountPoints.Find("@data");
for (int32 i = Entries.Num() - 1; i >= 0; --i) // Reverse iterate for highest priority
{
    FString TestPath = FPaths::Combine(Entries[i].PhysicalPath, RelativePath);
    if (FPaths::FileExists(TestPath))
    {
        return TestPath; // Override Mod found, returning early!
    }
}
// Fallback to base game path...`}
            />
          </section>

          <section className="doc-section">
            <h2 id="scoping">Mod Scoping (Preventing Recursion)</h2>
            <p>
              To keep mods sandboxed, paths inside a mod's <code>content.xml</code> are scoped automatically. When a mod references <code>@data</code>, the VFS intercepts it and resolves it to <code>Mods/ModName/Data/</code> instead of the global data folder.
            </p>
            <div className="doc-alert warning">
              <div className="alert-header">VFS MOD RESTRICTION</div>
              <div className="alert-body">
                The <code>@mods</code> virtual prefix is <strong>NOT</strong> available inside a mod's own data files. This prevents infinite loops and recursive dependencies.
              </div>
            </div>
          </section>

        </article>
      );

    case 'vfs_crypto':
      return (
        <article className="doc-article">
          <header className="doc-header">
            <span className="doc-category-tag">VFS & Data Internals</span>
            <h1 className="doc-main-title">GXMLCrypto — AES-256 XML</h1>
            <p className="doc-lead-para">
              Documentation for GXMLCrypto is coming soon.
            </p>
          </header>
        </article>
      );

    case 'vfs_containers':
      return (
        <article className="doc-article">
          <header className="doc-header">
            <span className="doc-category-tag">VFS & Data Internals</span>
            <h1 className="doc-main-title">Unreal Containers & Mounting</h1>
            <p className="doc-lead-para">
              Documentation for Unreal Containers is coming soon.
            </p>
          </header>
        </article>
      );

    case 'vfs_weapons_struct':
      return (
        <article className="doc-article">
          <header className="doc-header">
            <span className="doc-category-tag">VFS & Data Internals</span>
            <h1 className="doc-main-title">FWeaponStaticInfo Struct Guide</h1>
            <p className="doc-lead-para">
              Documentation for FWeaponStaticInfo is coming soon.
            </p>
          </header>
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

    case 'vfs_deep':
      return (
        <>
          <li><a href="#what-is-vfs">What is the VFS?</a></li>
          <li><a href="#mod-types">The Four Mod Types</a></li>
          <li><a href="#vfs-resolution">VFS Priority Stack</a></li>
          <li><a href="#scoping">Mod Scoping (Preventing Recursion)</a></li>
        </>
      );

    case 'vfs_crypto':
    case 'vfs_containers':
    case 'vfs_weapons_struct':
      return null;

    default: return null;
  }
}
