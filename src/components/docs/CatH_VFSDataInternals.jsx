// CatH_VFSDataInternals.jsx
// Category H: VFS & Data Internals
import React from 'react';
import { GodCodeBlock } from './docsHelpers';

export function renderPage(docId) {
  switch (docId) {

    case 'vfs_deep':
      return (
        <article className="doc-article">
          <header className="doc-header">
            <span className="doc-category-tag">VFS &amp; Data Internals</span>
            <h1 className="doc-main-title">VFSManager Deep Dive</h1>
            <p className="doc-lead-para">
              <code>UVFSManager</code> is a <code>UGameInstanceSubsystem</code> that maps virtual path prefixes to physical directories on disk. Every file access in JustLive goes through its <code>Resolve()</code> or <code>ResolveAll()</code> methods.
            </p>
          </header>

          <section className="doc-section">
            <h2 id="vfs-mount-table">Mount Point Table</h2>
            <p>
              Mount points are stored internally as a <code>TMap&lt;FString, TArray&lt;FVFSMountEntry&gt;&gt;</code>. Each virtual prefix maps to one or more physical directories with priority values. During resolution, the list is sorted descending by priority — the highest priority entry wins for <code>Resolve()</code>, and all entries are returned for <code>ResolveAll()</code> (used by addon mods).
            </p>
            <table className="doc-table">
              <thead><tr><th>Virtual Prefix</th><th>Default Physical Path</th><th>Priority</th></tr></thead>
              <tbody>
                <tr><td><code>@data</code></td><td><code>Data/</code></td><td>0 (base)</td></tr>
                <tr><td><code>@content</code></td><td><code>/Game/</code> (cooked IOStore)</td><td>0 (base)</td></tr>
                <tr><td><code>@scripts</code></td><td><code>Scripts/</code></td><td>0 (base)</td></tr>
                <tr><td><code>@mods</code></td><td><code>Mods/</code></td><td>100+ (override)</td></tr>
                <tr><td><code>@mods/ModName</code></td><td><code>Mods/ModName/</code></td><td>Set by content.xml</td></tr>
              </tbody>
            </table>
          </section>

          <section className="doc-section">
            <h2 id="vfs-key-api">Key API Methods</h2>
            <GodCodeBlock
              language="cpp"
              code={`// Resolve a virtual path to its highest-priority physical path
FString Resolve(const FString& VirtualPath);

// Resolve ALL physical paths (for addons that layer data)
TArray<FString> ResolveAll(const FString& VirtualPath);

// Resolve to a UE package path (/Game/...) for LoadObject calls
FString ResolvePackagePath(const FString& VirtualPath);

// Mount a directory with an optional priority
void Mount(const FString& VirtualPath,
           const FString& PhysicalPath,
           int32 Priority = 0);

// Push/pop a mod scope (temporary override during mod load)
void PushModScope(const FString& ModName);
void PopModScope();

// Mount a native UE .pak or .ucas/.utoc into UE's own file system
bool MountUnrealContainer(const FString& VirtualPath, int32 Priority);

// Discover all files in a virtual directory
void DiscoverFiles(const FString& VirtualPath,
                   TArray<FString>& OutFiles,
                   bool bRecursive = false);`}
            />
          </section>

          <section className="doc-section">
            <h2 id="vfs-override-flow">Override Resolution Flow</h2>
            <div className="flow-visual-box">
              <div className="flow-node"><span className="node-num">01</span><div className="node-info"><h5>Input: <code>@data/Weapons.xml</code></h5><p>Manager calls VFSManager::Resolve("@data/Weapons.xml").</p></div></div>
              <div className="flow-arrow">↓</div>
              <div className="flow-node"><span className="node-num">02</span><div className="node-info"><h5>Lookup Mount Table</h5><p>Find all FVFSMountEntry for prefix "@data". Sort by Priority descending.</p></div></div>
              <div className="flow-arrow">↓</div>
              <div className="flow-node"><span className="node-num">03</span><div className="node-info"><h5>Override Mod Check (Priority 100)</h5><p>If Mods/BetterWeapons/Data/Weapons.xml exists → return that path. Override mod wins.</p></div></div>
              <div className="flow-arrow">↓</div>
              <div className="flow-node"><span className="node-num">04</span><div className="node-info"><h5>Fallback: Base Game (Priority 0)</h5><p>If no override found, return Data/Weapons.xml from base game installation.</p></div></div>
            </div>
          </section>

          <section className="doc-section">
            <h2 id="vfs-addon-resolve">Addon Mod Resolution (ResolveAll)</h2>
            <p>
              For addon mods that <em>extend</em> rather than override, <code>DataManager::ParseXMLAll()</code> calls <code>VFSManager::ResolveAll()</code> which returns all matching physical paths sorted by priority. The DataManager then iterates all results and merges their XML nodes.
            </p>
            <GodCodeBlock
              language="cpp"
              code={`// DataManager iterates ALL layers — base game + every addon
TArray<TSharedPtr<FXmlFile>> XmlFiles = ParseXMLAll("@data/Peds.xml");
for (const TSharedPtr<FXmlFile>& Xml : XmlFiles)
{
    // Each mod's Peds.xml gets merged into the master registry
    ProcessPedsXML(Xml->GetRootNode());
}`}
            />
          </section>
        </article>
      );

    case 'vfs_crypto':
      return (
        <article className="doc-article">
          <header className="doc-header">
            <span className="doc-category-tag">VFS &amp; Data Internals</span>
            <h1 className="doc-main-title">GXMLCrypto — AES-256 XML</h1>
            <p className="doc-lead-para">
              <code>FGXMLCrypto</code> is a utility class that enables transparent AES-256 encryption of XML data files. This allows premium mods or DLC to ship encrypted data assets that only the authorized engine build can decrypt.
            </p>
          </header>

          <section className="doc-section">
            <h2 id="crypto-detection">Transparent Detection</h2>
            <p>
              The <code>DataManager</code> automatically detects encrypted XML files during loading. If <code>FGXMLCrypto::IsEncrypted(FileData)</code> returns <code>true</code>, the file is decrypted in-memory before being parsed. The calling code never needs to know if a file is encrypted.
            </p>
            <GodCodeBlock
              language="cpp"
              code={`// DataManager.cpp — transparent crypto in ParseXMLAll()
if (FGXMLCrypto::IsEncrypted(FileData))
{
    FString PlainXML;
    if (FGXMLCrypto::DecryptToString(FileData, PlainXML))
    {
        XmlFile = MakeShareable(
            new FXmlFile(PlainXML, EConstructMethod::ConstructFromBuffer));
    }
}
else
{
    XmlFile = MakeShareable(new FXmlFile(PhysicalPath));
}`}
            />
          </section>

          <section className="doc-section">
            <h2 id="crypto-use-cases">Use Cases</h2>
            <table className="doc-table">
              <thead><tr><th>Scenario</th><th>Recommendation</th></tr></thead>
              <tbody>
                <tr><td>Base game XML files</td><td>Plain text (unencrypted). Modders can inspect and extend.</td></tr>
                <tr><td>DLC exclusive weapon stats</td><td>Encrypt with engine key. Modders cannot read base values.</td></tr>
                <tr><td>Premium mod data</td><td>Mod author encrypts with their own key registered at launch.</td></tr>
                <tr><td>Mission scripts</td><td>Bytecode (.scc) is the preferred distribution format — no encryption needed.</td></tr>
              </tbody>
            </table>
          </section>

          <section className="doc-section">
            <h2 id="crypto-blueprint">Blueprint Library Access</h2>
            <p>
              <code>UGXMLBlueprintLibrary</code> exposes GXMLCrypto functionality to Blueprint and the ScriptVM via <code>ScriptAutoBinder</code>:
            </p>
            <GodCodeBlock
              language="cpp"
              code={`// From GXMLBlueprintLibrary.h
UFUNCTION(BlueprintCallable, Category = "XML Crypto")
static bool IsXMLEncrypted(const TArray<uint8>& FileData);

UFUNCTION(BlueprintCallable, Category = "XML Crypto")
static bool DecryptXMLToString(const TArray<uint8>& EncryptedData,
                               FString& OutPlainText);`}
            />
          </section>
        </article>
      );

    case 'vfs_containers':
      return (
        <article className="doc-article">
          <header className="doc-header">
            <span className="doc-category-tag">VFS &amp; Data Internals</span>
            <h1 className="doc-main-title">Unreal Containers &amp; Mounting</h1>
            <p className="doc-lead-para">
              JustLive supports three container formats for cooked UE assets: standard <code>.pak</code>, IOStore (<code>.ucas/.utoc</code>), and the custom <code>UGPack</code> format. Each has different mounting paths and mod compatibility profiles.
            </p>
          </header>

          <section className="doc-section">
            <h2 id="container-formats">Container Format Comparison</h2>
            <table className="doc-table">
              <thead><tr><th>Format</th><th>Extension</th><th>Tool</th><th>Mod Support Status</th></tr></thead>
              <tbody>
                <tr><td>Standard PAK</td><td><code>.pak</code></td><td>UnrealPak.exe</td><td>Supported — requires signed key for shipping builds</td></tr>
                <tr><td>IOStore</td><td><code>.ucas/.utoc</code></td><td>UnrealPak + DevelopmentAssetRegistrySettings</td><td>Supported — dynamically mounted at boot by UVFSManager</td></tr>
                <tr><td>UGPack</td><td><code>.ugpack</code></td><td>Python JLModTool</td><td>Supported for loose file mods. Deserialized natively via custom platforms.</td></tr>
              </tbody>
            </table>
          </section>

          <section className="doc-section">
            <h2 id="unreal-containers-xml">UnrealContainers.xml — Package Mount Registry</h2>
            <p>
              When <code>Assets.xml</code> contains a <code>&lt;Package&gt;</code> tag referencing an <code>UnrealContainers.xml</code> file, the DataManager automatically calls <code>ProcessUnrealContainersXML()</code>. This parses the container file and mounts each <code>&lt;Container&gt;</code> entry via VFSManager.
            </p>
            <GodCodeBlock
              language="xml"
              code={`<!-- Assets.xml -->
<Package path="@data/UnrealContainers.xml" />

<!-- UnrealContainers.xml -->
<UnrealContainers>
  <Container path="@content/DLC_WeaponPack.pak" priority="50" />
  <Container path="@mods/MyMod/Content/MyMod.pak" priority="100" />
</UnrealContainers>`}
            />
          </section>

          <section className="doc-section">
            <h2 id="vfs-archive">FMountedArchive — UGPack Structure</h2>
            <GodCodeBlock
              language="cpp"
              code={`// VFSManager.h — mounted archive descriptor
struct FMountedArchive
{
    FString FilePath;
    IFileHandle* FileHandle = nullptr;
    FArchiveHeader Header;         // Magic + version + compression
    TMap<uint64, FArchiveEntry> Index;  // Hash -> file entry
    int32 Priority = 0;
};

// UGPack magic byte: 0x4B434150 ("PACK")
// Deserialized natively via IPlatformFile override`}
            />
          </section>
        </article>
      );

    case 'vfs_weapons_struct':
      return (
        <article className="doc-article">
          <header className="doc-header">
            <span className="doc-category-tag">VFS &amp; Data Internals</span>
            <h1 className="doc-main-title">FWeaponStaticInfo Struct Guide</h1>
            <p className="doc-lead-para">
              <code>FWeaponStaticInfo</code> is the immutable static definition of a weapon, parsed from <code>Weapons.xml</code> by <code>WeaponManager</code>. It contains every tunable value for a weapon — from fire rate to recoil curves to VFX IDs.
            </p>
          </header>

          <section className="doc-section">
            <h2 id="weapon-struct-overview">Struct Field Reference</h2>
            <p>Defined in <code>WeaponBaseStructs.h</code>. All fields are UPROPERTY-exposed.</p>
            <table className="doc-table">
              <thead><tr><th>Category</th><th>Field</th><th>Type</th><th>Purpose</th></tr></thead>
              <tbody>
                <tr><td>Identity</td><td>Name, Description</td><td>FString</td><td>Display name and tooltip</td></tr>
                <tr><td>Identity</td><td>Icon</td><td>TSoftObjectPtr&lt;UTexture2D&gt;</td><td>HUD inventory icon (soft loaded)</td></tr>
                <tr><td>Classification</td><td>Slot</td><td>EWeaponCategory</td><td>Which inventory slot this occupies (Pistol, Rifle, Heavy, etc.)</td></tr>
                <tr><td>Classification</td><td>Flags / EWeaponFlagsExt</td><td>uint8 / uint32</td><td>Bitfield capabilities: CanAim, TwoHanded, Automatic, IsSilenced, etc.</td></tr>
                <tr><td>Stats</td><td>Damage, Range, FireRate, Spread, Recoil, Weight</td><td>float</td><td>Core combat numbers. Never hardcoded — always from XML.</td></tr>
                <tr><td>Ammo</td><td>AmmoCaliber, ClipSize, MaxAmmoReserve</td><td>EAmmoCaliber / int32</td><td>Weapons sharing a caliber share ammo pools in InventoryComponent.</td></tr>
                <tr><td>Behavior</td><td>FireMode, AvailableFireModes, BurstCount, PelletCount</td><td>EFireMode / TArray</td><td>FireMode list drives the cycle-fire-mode action.</td></tr>
                <tr><td>Aiming</td><td>AimYawClampDegrees, AimPitchUpDegrees, AimPitchDownDegrees, ADSSpeed, AimFOV</td><td>float</td><td>Spine IK envelope and ADS blend speed.</td></tr>
                <tr><td>Recoil</td><td>RecoilType, VerticalRecoil, HorizontalRecoil, RecoilRecoverySpeed</td><td>ERecoilType / float</td><td>Camera kick pattern and recovery curve.</td></tr>
                <tr><td>Projectile</td><td>ProjectileType, ProjectileSpeed, ProjectileGravityScale, RicochetChance, PenetrationPower</td><td>EProjectileType / float</td><td>Physical projectile physics configuration.</td></tr>
                <tr><td>Explosion</td><td>bHasExplosion, ExplosionRadius, ExplosionDamage, ExplosionImpulse</td><td>bool / float</td><td>AOE detonation parameters for grenades and rockets.</td></tr>
                <tr><td>Assets</td><td>WeaponMesh (Static), WeaponSkeletalMesh</td><td>TSoftObjectPtr</td><td>Visual mesh — soft loaded on equip, unloaded on holster.</td></tr>
                <tr><td>Sockets</td><td>MuzzleSocket, EjectSocket, HandSocket, HolsterSocket</td><td>FName</td><td>Canonical socket names for attachment, shell ejection, and holstering.</td></tr>
                <tr><td>Audio</td><td>AudioContainer, AudioSetID</td><td>FName</td><td>Sound folder name in AudioManager registry (Pattern B).</td></tr>
                <tr><td>VFX</td><td>VFXMuzzle, VFXEject, VFXMuzzleFlashCompositeID, ExplosionFXID</td><td>FName</td><td>VFX composite IDs resolved through VFXManager.</td></tr>
                <tr><td>Animation</td><td>AnimSetID, FightStyle, AnimFire, AnimReload, AnimEquip, AnimUnequip</td><td>FName / TSoftObjectPtr</td><td>Animation set registry key and individual anim overrides.</td></tr>
              </tbody>
            </table>
          </section>

          <section className="doc-section">
            <h2 id="weapon-enum-reference">Critical Weapon Enums</h2>
            <table className="doc-table">
              <thead><tr><th>Enum</th><th>Values</th></tr></thead>
              <tbody>
                <tr><td>EWeaponCategory</td><td>Unarmed, Melee, Pistol, SMG, Shotgun, Rifle, Sniper, Heavy, Throwable, Throwable2, Special, Utility</td></tr>
                <tr><td>EFireMode</td><td>Single, Burst, Automatic</td></tr>
                <tr><td>EFireType</td><td>Melee, InstantHit, Projectile, AreaEffect, Thrown</td></tr>
                <tr><td>EWeaponDamageType</td><td>Bullet, Blunt, Sharp, Explosive, Fire, Electric, Gas, Collision, VehicleImpact, RunOver, Crush, Fall, Drown, Asphyxiation</td></tr>
                <tr><td>EDamageChannel</td><td>Hitscan, Projectile, Melee, Radius_AOE, PhysicsImpact, WorldState</td></tr>
                <tr><td>EAmmoCaliber</td><td>9mm, .45ACP, .357Mag, .44Mag, .50AE, 5.56NATO, 7.62x39, 7.62NATO, .308, .50BMG, 12Ga, 20Ga, SMG variants, Rocket, Grenade, Fuel, Battery</td></tr>
                <tr><td>EAttachmentSlot</td><td>Suppressor, Magazine, Grip, Scope, Laser, Flashlight, Stock, Barrel, Underbarrel, Cosmetic</td></tr>
                <tr><td>EEquippedSlot</td><td>Unarmed, Melee, Primary, Secondary, Heavy, Throwable, None</td></tr>
                <tr><td>EWeaponGroup</td><td>Unarmed, MeleeBlunt, MeleeSharp, PistolSmall, PistolLarge, SMG, Shotgun, RifleAssault, RifleSniper, RocketLauncher, Minigun, Grenade, Molotov, Flamethrower, Special</td></tr>
              </tbody>
            </table>
          </section>

          <section className="doc-section">
            <h2 id="weapon-attachments-struct">FWeaponAttachmentStaticInfo</h2>
            <p>Attachments are stat-delta objects. Defined in <code>WeaponBaseStructs.h</code> and stored in the <code>WeaponManager</code> attachment registry. Applied to <code>FWeaponInstance</code> (never to <code>FWeaponStaticInfo</code>).</p>
            <GodCodeBlock
              language="cpp"
              code={`// Modifier fields (all additive or multiplicative):
float DamageMultiplier     // e.g., 1.1 = +10% damage
float RangeMultiplier      // e.g., 1.2 = +20% range
float FireRateMultiplier
float RecoilModifier       // Additive delta: -0.15 = -15% recoil
float SpreadModifier
int32 ClipSizeModifier     // e.g., +15 for extended mag
float ADSSpeedModifier
float ScopeZoomMultiplier

// Tactical attachment extras:
bool bEnableLaser
bool bEnableFlashlight
float LaserRange           // 6000.0f default
FLinearColor LaserColor
float FlashlightIntensity
float FlashlightInnerConeAngle
float FlashlightOuterConeAngle`}
            />
          </section>
        </article>
      );

    default: return null;
  }
}

export function getOutline(docId) {
  switch (docId) {

    case 'vfs_deep':
      return (
        <>
          <li><a href="#vfs-mount-table">Mount Point Table</a></li>
          <li><a href="#vfs-key-api">Key API Methods</a></li>
          <li><a href="#vfs-override-flow">Override Resolution Flow</a></li>
          <li><a href="#vfs-addon-resolve">Addon Mod Resolution</a></li>
        </>
      );

    case 'vfs_crypto':
      return (
        <>
          <li><a href="#crypto-detection">Transparent Detection</a></li>
          <li><a href="#crypto-use-cases">Use Cases</a></li>
          <li><a href="#crypto-blueprint">Blueprint Library Access</a></li>
        </>
      );

    case 'vfs_containers':
      return (
        <>
          <li><a href="#container-formats">Container Format Comparison</a></li>
          <li><a href="#unreal-containers-xml">UnrealContainers.xml</a></li>
          <li><a href="#vfs-archive">FMountedArchive Structure</a></li>
        </>
      );

    case 'vfs_weapons_struct':
      return (
        <>
          <li><a href="#weapon-struct-overview">Struct Field Reference</a></li>
          <li><a href="#weapon-enum-reference">Critical Weapon Enums</a></li>
          <li><a href="#weapon-attachments-struct">FWeaponAttachmentStaticInfo</a></li>
        </>
      );

    default: return null;
  }
}
