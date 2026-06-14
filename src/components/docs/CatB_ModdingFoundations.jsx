// CatB_ModdingFoundations.jsx
// Category B: Modding Foundations
import React from 'react';
import { WorkflowTabGroup, getToolIcon, GodCodeBlock } from './docsHelpers';

export function renderPage(docId) {
  switch (docId) {

    case 'iostore':
      return (
        <article className="doc-article">
          <header className="doc-header">
            <span className="doc-category-tag">Modding Foundations</span>
            <h1 className="doc-main-title">IOStore Packaging (.ucas/.utoc)</h1>
            <p className="doc-lead-para">
              JustLive uses Unreal Engine's IOStore container format for high-speed, thread-safe asynchronous asset streaming.
            </p>
          </header>

          <section className="doc-section">
            <h2 id="iostore-overview">Cooking Visual & Audio Assets</h2>
            <p>
              JustLive runs on Unreal Engine 5.7. While XML configurations and <code>.sc</code> scripts can be edited in a text editor, <strong>any physical assets (3D Models, Animations, Textures, Sound Waves) MUST be cooked using Unreal Engine 5.7.</strong> You cannot drop raw <code>.fbx</code> or <code>.wav</code> files into your mod folder.
            </p>
            <p>
              When cooking, assets are packed into either traditional <code>.pak</code> files or modern IOStore containers (paired <code>.ucas</code> and <code>.utoc</code> files). IOStore is the recommended format as it splits bulk data from metadata, allowing for high-speed, non-blocking asynchronous asset streaming.
            </p>
          </section>

          <WorkflowTabGroup
            xmlContent={
              <>
                <section className="doc-section">
                  <h2 id="iostore-modding">Deploying Mod Containers (Modders)</h2>
                  <p>
                    Once you have cooked your custom assets out of Unreal Engine, place your `.pak` or `.ucas`/`.utoc` files directly inside your mod's content folder: <code>Mods/MyModName/Content/</code>.
                  </p>
                  <div className="doc-alert important">
                    <div className="alert-header">AUTO-MOUNTING CAPABILITY</div>
                    <div className="alert-body">
                      You do not need to write any C++ or Blueprint logic to mount these files. When JustLive boots, the <code>UModManager</code> automatically scans your mod's <code>Content/</code> directory for any file ending in <code>.pak</code> or <code>.utoc</code> and seamlessly mounts them into the engine's internal file system.
                    </div>
                  </div>
                  <p>
                    Because the <code>ModManager</code> automatically maps these containers, your XML files can seamlessly reference the cooked paths (e.g., <code>&lt;Mesh path="@content/Weapons/SK_MyCustomWeapon"/&gt;</code>) and the VFS will instantly find it inside the container.
                  </p>
                </section>
              </>
            }
            bpContent={
              <>
                <section className="doc-section">
                  <h2 id="iostore-sdk">Container Mounting Architecture (SDK)</h2>
                  <p>
                    Under the hood, the <code>UModManager::MountModContent()</code> method handles this integration natively.
                  </p>
                  <p>
                    It iterates the mod's Content directory, aggregates all `.pak` and `.utoc` files, and hooks them into the Virtual File System using the exact same Priority integer defined in the mod's <code>content.xml</code>. This guarantees that Unreal Engine's native package loader respects the mod's Override priority natively!
                  </p>
                  <GodCodeBlock 
                    language="cpp" 
                    code={`// From UModManager::MountModContent()
TArray<FString> PakFiles;
IFileManager::Get().FindFiles(PakFiles, *FPaths::Combine(ContentPath, TEXT("*.pak")), true, false);

TArray<FString> UtocFiles;
IFileManager::Get().FindFiles(UtocFiles, *FPaths::Combine(ContentPath, TEXT("*.utoc")), true, false);

TArray<FString> AllContainers = PakFiles;
AllContainers.Append(UtocFiles);

// Mount all discovered containers, passing the Mod's priority level natively into UE
for (const FString& FileName : AllContainers)
{
    FString VirtualContainerPath = FString::Printf(TEXT("@content/%s"), *FileName);
    VFS->MountUnrealContainer(VirtualContainerPath, Mod.Priority);
}`}
                  />
                </section>
              </>
            }
          />
        </article>
      );

    case 'manifest':
      return (
        <article className="doc-article">
          <header className="doc-header">
            <span className="doc-category-tag">Modding Foundations</span>
            <h1 className="doc-main-title">Mod Manifests &amp; XML Structure</h1>
            <p className="doc-lead-para">
              Every mod in JustLive requires a <code>content.xml</code> manifest file at its root. This file is the single source of truth for the mod's state, identity, and dependencies.
            </p>
          </header>

          <WorkflowTabGroup
            xmlContent={
              <>
                <section className="doc-section">
                  <h2 id="manifest-xml">The content.xml Schema</h2>
                  <p>
                    Create a file named <code>content.xml</code> in your mod root (e.g., <code>Mods/MyAwesomeMod/content.xml</code>). 
                    The <code>UModManager</code> parses this file using the <code>FXmlFile</code> API.
                  </p>
                  <GodCodeBlock 
                    language="xml" 
                    code={`<!-- Mods/MyAwesomeMod/content.xml -->
<ModManifest>
  <Metadata 
      version="1.0.0" 
      author="Your Name" 
      enabled="true"
      type="addon"
      priority="0"
      icon="Icon.png"
      background="Bg.png"
      logopath="Logo.png"
      entrymap=""
      dependency=""
      modio_id="123456"
      social="https://discord.gg/yourserver"
      support="https://patreon.com/yourname"
      tags="weapon,skins">
    <Description>Adds custom high-fidelity weapons to the Sandbox mode.</Description>
  </Metadata>
  
  <GameAssets override="false">
    <!-- GameAssets node is used by the DataManager to mount specific configurations -->
  </GameAssets>
</ModManifest>`}
                  />
                  
                  <div className="doc-alert note" style={{ marginTop: '1rem' }}>
                    <div className="alert-header">METADATA ATTRIBUTES</div>
                    <div className="alert-body">
                      <ul className="doc-list" style={{ marginTop: '0.5rem' }}>
                        <li><code>type</code>: Must be <code>addon</code>, <code>override</code>, or <code>standalone</code>.</li>
                        <li><code>priority</code>: VFS mount priority. Overrides default to 100, Addons default to 0.</li>
                        <li><code>entrymap</code>: <strong>Required</strong> for Standalone mods. Defines the map to load upon LaunchStandalone().</li>
                        <li><code>dependency</code>: If set on an Addon mod, it converts it to a StandaloneAddon tied to that specific standalone mod name.</li>
                        <li><code>enabled</code>: The engine toggles this attribute directly in your file when users enable/disable mods in the UI.</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section className="doc-section">
                  <h2 id="xml-modding-actions">Database Actions: Edit, Add, and Remove</h2>
                  <p>
                    JustLive handles modifications to base game data dynamically through XML layers. Because Addons and Overrides mount identically into the VFS, structural updates are straightforward:
                  </p>
                  
                  <h4>1. Editing Existing Definitions</h4>
                  <p>
                    To modify an existing definition, author an XML file that uses the exact <code>id</code> of the base item. The VFS priority system ensures your data is parsed last, overwriting the C++ struct in memory.
                  </p>
                  <GodCodeBlock 
                    language="xml" 
                    code={`<!-- Override fire rate and damage of standard M4 rifle -->
<Weapons>
  <Weapon id="W_Rifle_M4" baseDamage="50" fireRate="0.08" />
</Weapons>`}
                  />

                  <h4>2. Adding New Definitions</h4>
                  <p>
                    To register a brand new item, add a node with a completely unique <code>id</code>. The manager will load it as a new dictionary entry.
                  </p>
                  <GodCodeBlock 
                    language="xml" 
                    code={`<!-- Add a custom plasma pistol -->
<Weapons>
  <Weapon id="W_Pistol_Plasma" type="Pistol" baseDamage="90" fireRate="0.5">
    <Mesh path="@mods/MyAwesomeMod/Content/Weapons/SK_PlasmaPistol" />
    <AnimSet name="Pistol_Standard" />
  </Weapon>
</Weapons>`}
                  />
                </section>
              </>
            }
            bpContent={
              <>
                <section className="doc-section">
                  <h2 id="manifest-sdk">Parsing Manifests (SDK)</h2>
                  <p>
                    The <a href="file:///d:/Unreal%20Projects/JustLive/Source/JustLive/Core/ModManager.h" style={{ fontFamily: 'monospace', color: 'var(--accent)', fontWeight: 'bold' }}>UModManager</a> scans the <code>@mods</code> directory at startup, iterating all folders to find <code>content.xml</code> files.
                  </p>
                  <p>
                    It parses the metadata into <code>FModInfo</code> structs and stores them in the <code>KnownMods</code> map. Notably, the ModManager performs string-replacement to update the <code>enabled="true/false"</code> state directly in the XML without a full re-serialization, preserving modders' comments and formatting!
                  </p>
                  <GodCodeBlock 
                    language="cpp" 
                    code={`// Query the active mods in C++
TArray<FModInfo> ActiveMods = UModManager::Get(this)->GetAvailableMods();
for (const FModInfo& Mod : ActiveMods)
{
    if (Mod.bIsActive)
    {
        UE_LOG(LogTemp, Log, TEXT("Active Mod: %s (Type: %d, Priority: %d)"), 
            *Mod.Name, (uint8)Mod.Type, Mod.Priority);
    }
}`}
                  />
                </section>
              </>
            }
          />
        </article>
      );

    case 'editorfree':
      return (
        <article className="doc-article">
          <header className="doc-header">
            <span className="doc-category-tag">Modding Foundations</span>
            <h1 className="doc-main-title">Editor vs. Editor-Free Mods</h1>
            <p className="doc-lead-para">
              JustLive separates asset creation from logical modding, allowing programmers to create mods without downloading the Unreal Editor.
            </p>
          </header>

          <WorkflowTabGroup
            xmlContent={
              <>
                <section className="doc-section">
                  <h2 id="editorfree-modding">The "Editor-Free" Boundary</h2>
                  <p>
                    Because JustLive's architecture abstracts all gameplay logic, definitions, and AI behaviors into the Virtual File System (VFS), a massive portion of modding can be done without ever downloading the 30GB+ Unreal Engine 5.7 installation. 
                  </p>
                  <p>
                    <strong>If your mod does not introduce new 3D models, audio files, or raw textures, you do not need the Unreal Editor.</strong> You can build complete, feature-rich mods purely using text editors:
                  </p>
                  <ul className="doc-list">
                    <li><strong>XML Registries (Data/):</strong> Completely rewrite the game's economy, alter AI personalities (Aggression, Courage thresholds), build new loadouts, or change weapon recoil patterns. The <code>DataManager</code> natively parses these at runtime.</li>
                    <li><strong>ScriptVM Coding (Scripts/):</strong> Write complete mission logic, cutscene orchestrations, and ambient population behaviors using C-style <code>.sc</code> script files. The internal VM compiles and runs these dynamically.</li>
                  </ul>
                  
                  <div className="doc-alert warning" style={{ marginTop: '1.5rem' }}>
                    <div className="alert-header">WHEN THE EDITOR IS MANDATORY</div>
                    <div className="alert-body">
                      The moment you want to import a custom character mesh, a custom gun model, or custom sound effects, you cross the "Editor Boundary." Unreal Engine 5.7 becomes strictly required because these raw files (like <code>.fbx</code> or <code>.wav</code>) must be cooked into <code>.ucas</code>/<code>.utoc</code> or <code>.pak</code> containers for the engine to read them.
                    </div>
                  </div>
                </section>
              </>
            }
            bpContent={
              <>
                <section className="doc-section">
                  <h2 id="editorfree-sdk">SDK / Standalone Boundaries</h2>
                  <p>
                    For Standalone Total Conversion mods, developers step beyond the Data/Script tier and enter the Native tier. By cloning the C++ repository, developers gain the ability to compile customized game binaries.
                  </p>
                  <ul className="doc-list">
                    <li><strong>Custom Subsystems:</strong> Write new C++ Managers to handle entirely new game loops (e.g., a custom FlightManager).</li>
                    <li><strong>Custom UI:</strong> Use the C++ <code>GodUIFramework</code> (Slate UI) to build entirely new menu systems, bypassing standard Blueprints.</li>
                    <li><strong>Build Scripts:</strong> Compile the game natively using the <code>Tools/Build.ps1</code> automated pipeline.</li>
                  </ul>
                </section>
              </>
            }
          />
        </article>
      );

    case 'tools':
      return (
        <article className="doc-article">
          <header className="doc-header">
            <span className="doc-category-tag">Modding Foundations</span>
            <h1 className="doc-main-title">Recommended Modding Tools</h1>
            <p className="doc-lead-para">
              Tools used in the JustLive modding and development ecosystem.
            </p>
          </header>

          <WorkflowTabGroup
            xmlContent={
              <>
                <section className="doc-section">
                  <h2 id="tools-modding">Text &amp; Scripting Utilities</h2>
                  <p>For Addon and Override mods dealing strictly with data and logic:</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--bg-panel)', border: '1px solid var(--line-primary)', borderRadius: 'var(--radius-md)' }}>
                      {getToolIcon('vscode')}
                      <div>
                        <h5 style={{ margin: 0, color: 'var(--text-bright)' }}>Visual Studio Code</h5>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-dim)' }}>The absolute best tool for writing <code>.sc</code> scripts. We recommend installing a C++ syntax highlighting extension to get immediate color-coding for the ScriptVM's C-like syntax.</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--bg-panel)', border: '1px solid var(--line-primary)', borderRadius: 'var(--radius-md)' }}>
                      {getToolIcon('npp')}
                      <div>
                        <h5 style={{ margin: 0, color: 'var(--text-bright)' }}>Notepad++</h5>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-dim)' }}>An extremely lightweight tool perfect for rapidly editing XML database files (like <code>Peds.xml</code> or <code>Weapons.xml</code>) without heavy IDE overhead.</p>
                      </div>
                    </div>
                  </div>

                  <h2 id="tools-visual" style={{ marginTop: '2rem' }}>Visual &amp; Audio Utilities</h2>
                  <p>For mods introducing new assets, requiring cooking operations:</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--bg-panel)', border: '1px solid var(--line-primary)', borderRadius: 'var(--radius-md)' }}>
                      {getToolIcon('ue')}
                      <div>
                        <h5 style={{ margin: 0, color: 'var(--text-bright)' }}>Unreal Engine 5.7</h5>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-dim)' }}><strong>Mandatory.</strong> Required for cooking your raw assets (FBX/WAV) into IOStore containers (<code>.ucas</code>/<code>.utoc</code>) so the engine can natively stream them.</p>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--bg-panel)', border: '1px solid var(--line-primary)', borderRadius: 'var(--radius-md)' }}>
                      {getToolIcon('metahuman')}
                      <div>
                        <h5 style={{ margin: 0, color: 'var(--text-bright)' }}>MetaHuman Creator</h5>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-dim)' }}>Used to rapidly generate high-fidelity characters. The JustLive skeleton is fully compatible with standard MetaHuman rigs.</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--bg-panel)', border: '1px solid var(--line-primary)', borderRadius: 'var(--radius-md)' }}>
                      {getToolIcon('fab')}
                      <div>
                        <h5 style={{ margin: 0, color: 'var(--text-bright)' }}>Fab</h5>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-dim)' }}>The primary marketplace for downloading 3D assets, materials, and textures for modding.</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--bg-panel)', border: '1px solid var(--line-primary)', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {getToolIcon('blender')}
                        {getToolIcon('maya')}
                        {getToolIcon('3dsmax')}
                      </div>
                      <div>
                        <h5 style={{ margin: 0, color: 'var(--text-bright)' }}>Blender / Maya / 3ds Max</h5>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-dim)' }}>For modeling new weapons or creating custom Skeletal Meshes. Characters must be rigged to the standard JustLive skeleton to utilize the <code>AnimationSetManager</code>.</p>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--bg-panel)', border: '1px solid var(--line-primary)', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {getToolIcon('photoshop')}
                        {getToolIcon('gimp')}
                        {getToolIcon('paintnet')}
                      </div>
                      <div>
                        <h5 style={{ margin: 0, color: 'var(--text-bright)' }}>Photoshop / GIMP / Paint.NET</h5>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-dim)' }}>For authoring custom albedo, normal, and packed ORM textures before importing them into UE5.7.</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--bg-panel)', border: '1px solid var(--line-primary)', borderRadius: 'var(--radius-md)' }}>
                      {getToolIcon('audacity')}
                      <div>
                        <h5 style={{ margin: 0, color: 'var(--text-bright)' }}>Audacity</h5>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-dim)' }}>For trimming, normalizing, and exporting custom weapon fire sounds or ambient tracks as <code>.wav</code> files before cooking.</p>
                      </div>
                    </div>
                  </div>
                </section>
              </>
            }
            bpContent={
              <>
                <section className="doc-section">
                  <h2 id="tools-sdk">SDK Developer Utilities</h2>
                  <p>For Commercial Licensees and Standalone Total Conversion developers compiling the C++ Monolith:</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--bg-panel)', border: '1px solid var(--line-primary)', borderRadius: 'var(--radius-md)' }}>
                      {getToolIcon('visualstudio')}
                      <div>
                        <h5 style={{ margin: 0, color: 'var(--text-bright)' }}>Visual Studio / JetBrains Rider</h5>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-dim)' }}>The industry standards for building the C++ core platform, authoring new Subsystems, and debugging memory allocation routines.</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--bg-panel)', border: '1px solid var(--line-primary)', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ width: '48px', height: '48px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: '#012456', backgroundColor: '#fff', borderRadius: '4px', fontWeight: 'bold' }}>&gt;_</div>
                      <div>
                        <h5 style={{ margin: 0, color: 'var(--text-bright)' }}>PowerShell (Build.ps1)</h5>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-dim)' }}><strong>Mandatory.</strong> All SDK builds, hot-reloads, and editor launches must be executed through <code>Tools/Build.ps1</code>. Never launch the Unreal Editor manually, as the build script ensures VFS sync and handles the LiveCoding payload.</p>
                      </div>
                    </div>
                  </div>
                </section>
              </>
            }
          />
        </article>
      );

    default: return null;
  }
}

export function getOutline(docId) {
  switch (docId) {
    case 'iostore': 
      return (
        <>
          <li><a href="#iostore-overview">Why IOStore?</a></li>
          <li><a href="#iostore-modding">Mod Packaging</a></li>
          <li><a href="#iostore-sdk">Mount API</a></li>
        </>
      );
    case 'manifest': 
      return (
        <>
          <li><a href="#manifest-xml">Manifest Example</a></li>
          <li><a href="#xml-modding-actions">Database Actions</a></li>
          <li><a href="#custom-paths-vfs">Custom &amp; Scattered Paths</a></li>
          <li><a href="#manifest-sdk">ModManager API</a></li>
        </>
      );
    case 'editorfree':
      return (
        <>
          <li><a href="#editorfree-modding">Modding without Editor</a></li>
          <li><a href="#editorfree-sdk">SDK Development</a></li>
        </>
      );
    case 'tools':
      return (
        <>
          <li><a href="#tools-modding">Modding Utilities</a></li>
          <li><a href="#tools-sdk">Developer Utilities</a></li>
        </>
      );
    default: return null;
  }
}
