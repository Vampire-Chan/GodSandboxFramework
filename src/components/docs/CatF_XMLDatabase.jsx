// CatF_XMLDatabase.jsx
// Category F: XML Database Reference
import React from 'react';
import { WorkflowTabGroup, GodCodeBlock } from './docsHelpers';

export function renderPage(docId) {
  switch (docId) {

    case 'xml_peds':
      return (
        <article className="doc-article">
          <header className="doc-header">
            <span className="doc-category-tag">XML Database Reference</span>
            <h1 className="doc-main-title">Peds &amp; Factions (Peds.xml)</h1>
            <p className="doc-lead-para">
              Defines pedestrian definitions, meshes, clothing variations, personality profiles, and factions.
            </p>
          </header>

          <WorkflowTabGroup
            xmlContent={
              <>
                <section className="doc-section">
                  <h2 id="xml_peds-config">Defining Pedestrians &amp; Factions (XML)</h2>
                  <p>
                    Pedestrians are defined in <code>@data/Peds/Peds.xml</code>. You declare their model meshes, default loadout IDs, and link them to faction tables:
                  </p>
                  <GodCodeBlock
                    language="xml"
                    code={`<!-- Defining a civilian entity archetype -->
<Ped id="Ped_UrbanCiv" faction="Faction_Civilians">
  <Model mesh="@content/Characters/Civs/SK_UrbanMale" />
  <Personality ref="Civ_Passive" />
  <Loadout ref="Loadout_Empty" />
</Ped>`}
                  />
                </section>
              </>
            }
            bpContent={
              <>
                <section className="doc-section">
                  <h2 id="xml_peds-sdk">Loading Ped Structures (SDK)</h2>
                  <p>
                    The C++ class <a href="file:///d:/Unreal%20Projects/JustLive/Source/JustLive/Gameplay/Peds/PedManager.h" style={{ fontFamily: 'monospace', color: 'var(--accent)', fontWeight: 'bold' }}>UPedManager</a> parses this file at boot, loading values into the <code>FPedDefinition</code> database.
                  </p>
                  <p>
                    When <a href="file:///d:/Unreal%20Projects/JustLive/Source/JustLive/Gameplay/Peds/PedFactory.h" style={{ fontFamily: 'monospace', color: 'var(--accent)', fontWeight: 'bold' }}>UPedFactory</a> spawns a character, it queries the definition and applies the model and stats:
                  </p>
                  <GodCodeBlock
                    language="cpp"
                    code={`// Spawn ped archetype from C++
APed* NewPed = UPedFactory::Get(this)->SpawnPedArchetype("Ped_UrbanCiv", SpawnLocation);`}
                  />
                </section>
              </>
            }
          />
        </article>
      );

    case 'xml_weapons':
      return (
        <article className="doc-article">
          <header className="doc-header">
            <span className="doc-category-tag">XML Database Reference</span>
            <h1 className="doc-main-title">Weapons &amp; Ballistics Database</h1>
            <p className="doc-lead-para">
              Defines gun statistics, reload speeds, ammunition caliber tables, and attachment structures.
            </p>
          </header>

          <WorkflowTabGroup
            xmlContent={
              <>
                <section className="doc-section">
                  <h2 id="xml_weapons-config">Registering Weapons &amp; Stats (XML)</h2>
                  <p>
                    Registered inside <code>@data/Weapons/Weapons.xml</code>. This file configures firing speeds, recoil rates, and muzzle velocities:
                  </p>
                  <GodCodeBlock
                    language="xml"
                    code={`<!-- M4 Rifle Definition -->
<Weapon id="W_Rifle_M4" type="AssaultRifle">
  <Stats damage="35" fireRate="0.1" muzzleVelocity="90000" />
  <Mesh path="@content/Weapons/M4/SK_M4" />
  <Ammo caliber="Cal_556x45" magSize="30" />
</Weapon>`}
                  />
                </section>
              </>
            }
            bpContent={
              <>
                <section className="doc-section">
                  <h2 id="xml_weapons-sdk">Accessing Weapon Templates (SDK)</h2>
                  <p>
                    The <a href="file:///d:/Unreal%20Projects/JustLive/Source/JustLive/Gameplay/Weapons/WeaponManager.h" style={{ fontFamily: 'monospace', color: 'var(--accent)', fontWeight: 'bold' }}>UWeaponManager</a> parses this file into immutable <code>FWeaponStaticInfo</code> structs.
                  </p>
                  <p>
                    Developers can fetch these static templates in C++ to run inventory or UI checks:
                  </p>
                  <GodCodeBlock
                    language="cpp"
                    code={`// Fetch static weapon details
FWeaponStaticInfo Info;
if (UWeaponManager::Get(this)->GetWeaponInfo("W_Rifle_M4", Info))
{
    float BaseDmg = Info.BaseDamage;
}`}
                  />
                </section>
              </>
            }
          />
        </article>
      );

    case 'xml_world':
      return (
        <article className="doc-article">
          <header className="doc-header">
            <span className="doc-category-tag">XML Database Reference</span>
            <h1 className="doc-main-title">World Props &amp; Interactions</h1>
            <p className="doc-lead-para">
              Defines usable objects in the map, including seat matrices, door hinges, ATMs, and climbing links.
            </p>
          </header>

          <WorkflowTabGroup
            xmlContent={
              <>
                <section className="doc-section">
                  <h2 id="xml_world-config">Configuring Interaction Targets (XML)</h2>
                  <p>
                    Interactions are configured in <code>@data/World/Interactions.xml</code> to define spatial targets for characters:
                  </p>
                  <GodCodeBlock
                    language="xml"
                    code={`<!-- Bench Interaction Preset -->
<InteractionProp id="Prop_Bench_Standard">
  <Interaction action="Sit" animTag="Bench_Sit_Idle">
    <Offset pos="0, -20, 45" rot="0, 0, 180" />
  </Interaction>
</InteractionProp>`}
                  />
                </section>
              </>
            }
            bpContent={
              <>
                <section className="doc-section">
                  <h2 id="xml_world-sdk">Resolving Interactions (SDK)</h2>
                  <p>
                    Usable elements on world actors check interaction properties. When a character approaches an interactable actor, the interaction component queries offsets to align skeletal bones:
                  </p>
                  <GodCodeBlock
                    language="cpp"
                    code={`// Query interaction points programmatically via the Prop Manager
UWorldPropManager::Get(this)->LoadDefinitions(TEXT("@data/World/Interactions.xml"));`}
                  />
                </section>
              </>
            }
          />
        </article>
      );

    case 'xml_media':
      return (
        <article className="doc-article">
          <header className="doc-header">
            <span className="doc-category-tag">XML Database Reference</span>
            <h1 className="doc-main-title">VFX, Audio &amp; Shaders DB</h1>
            <p className="doc-lead-para">
              Registers sound effects, Niagara particle templates, impact decals, and dynamic post-process shader parameters.
            </p>
          </header>

          <WorkflowTabGroup
            xmlContent={
              <>
                <section className="doc-section">
                  <h2 id="xml_media-config">Media Registration (XML)</h2>
                  <p>
                    Audio files and visual effects are defined in <code>@data/Media/Assets.xml</code> to register resource directories without compilation:
                  </p>
                  <GodCodeBlock
                    language="xml"
                    code={`<!-- Sound Folder Randomization Table -->
<SoundFolder name="Weapon_Pistol_Fire">
  <Sound name="Fire1" path="@content/Audio/Weapons/Pistol/Fire1" />
  <Sound name="Fire2" path="@content/Audio/Weapons/Pistol/Fire2" />
</SoundFolder>`}
                  />
                </section>
              </>
            }
            bpContent={
              <>
                <section className="doc-section">
                  <h2 id="xml_media-sdk">Triggering Emitters (SDK)</h2>
                  <p>
                    Sounds and particles are played by requesting asset references via the manager systems. Sound folder indices automatically play random waves from their definition sets:
                  </p>
                  <GodCodeBlock
                    language="cpp"
                    code={`// Spawn sound by XML identifier
UAudioManager::Get(this)->PlaySound("Weapon_Pistol_Fire", SpawnLocation);`}
                  />
                </section>
              </>
            }
          />
        </article>
      );

    case 'xml_weather':
      return (
        <article className="doc-article">
          <header className="doc-header">
            <span className="doc-category-tag">XML Database Reference</span>
            <h1 className="doc-main-title">Weather &amp; TimeCycles DB</h1>
            <p className="doc-lead-para">
              Defines day-night lighting parameters, fog thresholds, volumetric cloud speeds, and wind multipliers.
            </p>
          </header>

          <WorkflowTabGroup
            xmlContent={
              <>
                <section className="doc-section">
                  <h2 id="xml_weather-config">Declaring Weather Cycles (XML)</h2>
                  <p>
                    Weather maps are defined in <code>@data/World/TimeCycles.xml</code>. Values are linearly interpolated at runtime based on the game clock:
                  </p>
                  <GodCodeBlock
                    language="xml"
                    code={`<!-- Fog and lighting presets for Rainy weather -->
<WeatherPreset id="Weather_Rain">
  <TimeKey hour="12.0">
    <SunLight color="120, 130, 140" intensity="2.5" />
    <Fog density="0.15" absorption="0.05" />
  </TimeKey>
</WeatherPreset>`}
                  />
                </section>
              </>
            }
            bpContent={
              <>
                <section className="doc-section">
                  <h2 id="xml_weather-sdk">Weather Interpolation (SDK)</h2>
                  <p>
                    The C++ class <code>UWorldCycleManager</code> updates atmospheric parameters on tick, reading preset tables and smoothly interpolating sunlight angles, shadow cascades, and cloud density indices:
                  </p>
                  <GodCodeBlock
                    language="cpp"
                    code={`// Transition to Rain preset over 10 seconds
UWorldCycleManager::Get(this)->TransitionToWeather("Weather_Rain", 10.0f);`}
                  />
                </section>
              </>
            }
          />
        </article>
      );

    case 'xml_core':
      return (
        <article className="doc-article">
          <header className="doc-header">
            <span className="doc-category-tag">XML Database Reference</span>
            <h1 className="doc-main-title">Core Rules, Skills &amp; Pools</h1>
            <p className="doc-lead-para">
              Defines player stamina rules, fall damage bounds, skill progression parameters, and experience curves.
            </p>
          </header>

          <WorkflowTabGroup
            xmlContent={
              <>
                <section className="doc-section">
                  <h2 id="xml_core-config">Game Balance Settings (XML)</h2>
                  <p>
                    Balance constants are configured in <code>@data/Config/GameplaySettings.xml</code> to enable instant tuning:
                  </p>
                  <GodCodeBlock
                    language="xml"
                    code={`<!-- Stamina and health limits -->
<GameplayConfig>
  <Stamina drainRate="15.0" regenRate="10.0" />
  <FallDamage minVelocity="1200" damageMultiplier="0.08" />
</GameplayConfig>`}
                  />
                </section>
              </>
            }
            bpContent={
              <>
                <section className="doc-section">
                  <h2 id="xml_core-sdk">Querying Rules (SDK)</h2>
                  <p>
                    Core parameters are cached by the <a href="file:///d:/Unreal%20Projects/JustLive/Source/JustLive/Core/DataManager.h" style={{ fontFamily: 'monospace', color: 'var(--accent)', fontWeight: 'bold' }}>UDataManager</a>, providing O(1) float queries for tick computations:
                  </p>
                  <GodCodeBlock
                    language="cpp"
                    code={`// Fetch dynamic configuration keys via the master registry
FString Path = UDataManager::Get(this)->GetAssetRegistryPath(FName("GameplaySettings"));`}
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

export function getOutline(docId) {
  switch (docId) {
    case 'xml_peds':
      return (
        <>
          <li><a href="#xml_peds-config">Defining Peds (XML)</a></li>
          <li><a href="#xml_peds-sdk">Loading Peds (SDK)</a></li>
        </>
      );
    case 'xml_weapons':
      return (
        <>
          <li><a href="#xml_weapons-config">Registering Weapons (XML)</a></li>
          <li><a href="#xml_weapons-sdk">Accessing Templates (SDK)</a></li>
        </>
      );
    case 'xml_world':
      return (
        <>
          <li><a href="#xml_world-config">Interaction XML</a></li>
          <li><a href="#xml_world-sdk">Resolving Offsets (SDK)</a></li>
        </>
      );
    case 'xml_media':
      return (
        <>
          <li><a href="#xml_media-config">Media XML</a></li>
          <li><a href="#xml_media-sdk">Triggering Emitters (SDK)</a></li>
        </>
      );
    case 'xml_weather':
      return (
        <>
          <li><a href="#xml_weather-config">Declaring Weather (XML)</a></li>
          <li><a href="#xml_weather-sdk">Weather Interpolation</a></li>
        </>
      );
    case 'xml_core':
      return (
        <>
          <li><a href="#xml_core-config">Game Balance XML</a></li>
          <li><a href="#xml_core-sdk">Querying Rules (SDK)</a></li>
        </>
      );
    default: return null;
  }
}
