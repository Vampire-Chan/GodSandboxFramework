// CatG_PedSystem.jsx
// Category G: Ped System Deep Dive
import React from 'react';
import { WorkflowTabGroup, GodCodeBlock } from './docsHelpers';

/**
 * Returns the rendered article JSX for the given docId,
 * or null if this category doesn't own that id.
 */
export function renderPage(docId) {
  switch (docId) {

    case 'ped_ambient':
      return (
        <article className="doc-article">
          <header className="doc-header">
            <span className="doc-category-tag">Ped System Deep Dive</span>
            <h1 className="doc-main-title">AmbientPedPopulation System</h1>
            <p className="doc-lead-para">
              <code>AmbientPedPopulation</code> is the world subsystem responsible for streaming ambient NPCs in and out of the world based on player proximity, time-of-day, and zone density tables defined in XML.
            </p>
          </header>

          <WorkflowTabGroup
            xmlContent={
              <>
                <section className="doc-section">
                  <h2 id="apm-xml-density">XML Density Configuration</h2>
                  <p>World regions declare density tables in <code>Data/Entities/PopulationZones.xml</code>. This controls max count, faction weights, and time windows.</p>
                  <GodCodeBlock
                    language="xml"
                    code={`<!-- PopulationZones.xml -->
<PopulationZone id="Downtown_Day">
  <MaxCount>40</MaxCount>
  <TimeWindow start="08:00" end="20:00" />
  <Groups>
    <Group id="Civilians_UrbanMix" weight="0.6" />
  </Groups>
</PopulationZone>`}
                  />
                </section>
              </>
            }
            bpContent={
              <>
                <section className="doc-section">
                  <h2 id="apm-bp-control">Ambient Population Control (SDK)</h2>
                  <p>
                    While Peds are managed by the subsystem, you can manually influence spawns via the <code>PedFactory</code> or query population stats from the <code>AmbientPedPopulation</code> subsystem in C++ or Blueprints.
                  </p>
                  <GodCodeBlock
                    language="cpp"
                    code={`// Query active zone density from C++
UAmbientPedPopulation* PopMgr = UAmbientPedPopulation::Get(this);
if (PopMgr)
{
    int32 CurrentDensity = PopMgr->GetZoneDensity("Downtown_Day");
}`}
                  />
                </section>
              </>
            }
          />
        </article>
      );

    case 'ped_types':
      return (
        <article className="doc-article">
          <header className="doc-header">
            <span className="doc-category-tag">Ped System Deep Dive</span>
            <h1 className="doc-main-title">EPedType &amp; Population Enums</h1>
            <p className="doc-lead-para">
              Every entity in the simulation is classified by a rich set of C++ enums defined in <code>PedStateTypes.h</code>. These enums drive capability routing, faction logic, and population budgeting.
            </p>
          </header>

          <WorkflowTabGroup
            xmlContent={
              <>
                <section className="doc-section">
                  <h2 id="ped-type-xml">XML Ped Definition</h2>
                  <p>Assign types in <code>Data/Entities/Peds.xml</code>. The engine automatically resolves faction relationships based on the declared type.</p>
                  <GodCodeBlock
                    language="xml"
                    code={`<Ped ID="Ped_SWAT_Heavy" Type="Police">
  <Model Mesh="@content/Characters/SWAT/SK_SWAT" />
</Ped>`}
                  />
                </section>
              </>
            }
            bpContent={
              <>
                <section className="doc-section">
                  <h2 id="ped-type-sdk">Ped Type Identity (SDK)</h2>
                  <p>
                    When spawning a Ped programmatically, you must assign its type to ensure AI Controllers and perception systems correctly categorize it.
                  </p>
                  <GodCodeBlock
                    language="cpp"
                    code={`// Assign Ped Type in C++
NewPed->InitializeStats(EPedType::Police);`}
                  />
                </section>
              </>
            }
          />
        </article>
      );

    case 'ped_capabilities':
      return (
        <article className="doc-article">
          <header className="doc-header">
            <span className="doc-category-tag">Ped System Deep Dive</span>
            <h1 className="doc-main-title">Capability Flags (ECapability)</h1>
            <p className="doc-lead-para">
              The <code>ECapability</code> enum is the gate system for all Ped abilities. Defined in <code>PedStateTypes.h</code>, these flags control whether a Ped can perform any action — from sprinting to reviving allies. No code bypasses these flags.
            </p>
          </header>

          <section className="doc-section">
            <h2 id="capability-groups">Capability Groups</h2>
            <p>All 30+ capability flags are grouped by function. They are set per-Ped via XML <code>&lt;Personality&gt;</code> blocks and evaluated at runtime by <code>AttributesComponent</code>.</p>
            <table className="doc-table">
              <thead><tr><th>Group</th><th>Flags</th><th>Effect</th></tr></thead>
              <tbody>
                <tr><td><strong>Locomotion</strong></td><td>Crouch, Prone, Run, Sprint, Swim, Jump, Slide, UseStairs, Dash</td><td>Controls active movement modes. If <code>Run=false</code>, Ped caps at Walk gait.</td></tr>
                <tr><td><strong>Traversal</strong></td><td>Climb, ClimbLadders, ClimbPoles, HangOnLedges, Mantle, Vault</td><td>If <code>Climb=false</code>, NavMesh jump links are never queried AND PedAnimInstance skips the Climb node evaluation.</td></tr>
                <tr><td><strong>Combat</strong></td><td>UseCover, Aim, UseWeapons, Melee, PerformCounters, PerformFinishers, ThrowGrenades</td><td>Missing combat flags prevent weapon equip, aim pose, and fire logic from activating.</td></tr>
              </tbody>
            </table>
          </section>

          <section className="doc-section">
            <h2 id="capability-xml">XML Control of Capabilities</h2>
            <p>Set per ped type in <code>@data/Peds.xml</code> inside a <code>&lt;Personality&gt;</code> block:</p>
            <GodCodeBlock
              language="xml"
              code={`<Personality id="Police_Standard">
  <Capability name="CanSprint" value="true" />
  <Capability name="CanClimb" value="true" />
</Personality>`}
            />
          </section>
        </article>
      );

    case 'ped_states':
      return (
        <article className="doc-article">
          <header className="doc-header">
            <span className="doc-category-tag">Ped System Deep Dive</span>
            <h1 className="doc-main-title">Movement States &amp; Action States</h1>
            <p className="doc-lead-para">
              All Ped motion and behavior is encoded in two orthogonal state machines: <code>EPedMovementMode</code> (the physics motor) and <code>EPedActionState</code> (the active action overlay).
            </p>
          </header>

          <WorkflowTabGroup
            xmlContent={
              <>
                <section className="doc-section">
                  <h2 id="movement-mode">EPedMovementMode (XML Rules)</h2>
                  <p>
                    Movement modes (Walk, Run, Sprint) determine movement bounds. Ambient peds use gait rules declared in <code>Data/Entities/Personality.xml</code>.
                  </p>
                  <p>
                    If weather conditions change (e.g., Rain), the environment manager signals peds to transition their locomotion modes:
                  </p>
                  <GodCodeBlock
                    language="xml"
                    code={`<!-- Forcing running gaits in active weather -->
<GaitOverride condition="Raining" forceGait="Run" />`}
                  />
                </section>
                <section className="doc-section">
                  <h2 id="action-states">EPedActionState (XML Tasks)</h2>
                  <p>
                    Action states coordinate overlay animations. When a VM script triggers an action montage, it transitions the ped's action state to lock locomotion and blend spine bones.
                  </p>
                </section>
              </>
            }
            bpContent={
              <>
                <section className="doc-section">
                  <h2 id="ped-states-sdk">Gait &amp; Action APIs (SDK)</h2>
                  <p>
                    Peds are controlled via the C++ character class <a href="file:///d:/Unreal%20Projects/JustLive/Source/JustLive/Gameplay/Peds/Ped.h" style={{ fontFamily: 'monospace', color: 'var(--accent)', fontWeight: 'bold' }}>APed</a>. You can query or transition states dynamically:
                  </p>
                  <GodCodeBlock
                    language="cpp"
                    code={`// Query active action and movement states in C++
if (Ped->GetActionState() == EPedActionState::Ragdoll)
{
    // Ignore inputs while in ragdoll mode
    return;
}
Ped->SetMovementMode(EPedMovementMode::Sprint);`}
                  />
                </section>
              </>
            }
          />
        </article>
      );

    case 'ped_history':
      return (
        <article className="doc-article">
          <header className="doc-header">
            <span className="doc-category-tag">Ped System Deep Dive</span>
            <h1 className="doc-main-title">HistoryTagChecker &amp; PedFactory</h1>
            <p className="doc-lead-para">
              <code>HistoryTagChecker</code> is a world subsystem that evaluates append-only history tags against rule files. <code>PedFactory</code> handles safe Ped instantiation.
            </p>
          </header>

          <WorkflowTabGroup
            xmlContent={
              <>
                <section className="doc-section">
                  <h2 id="history-tags">History Tag Checkers (XML Rules)</h2>
                  <p>
                    JustLive uses append-only tags to track entity memories. If a civilian witnesses a player crime, the tag <code>"Witnessed_Crime"</code> is appended to their history log.
                  </p>
                  <p>
                    Behavior parameters in <code>Data/AI/HistoryRules.xml</code> dictate responses to accumulated tags:
                  </p>
                  <GodCodeBlock
                    language="xml"
                    code={`<!-- Fleeing rule for crime witnesses -->
<HistoryRule requiredTag="Witnessed_Crime">
  <Reaction trigger="PlayerProximity" action="Flee" />
</HistoryRule>`}
                  />
                </section>
              </>
            }
            bpContent={
              <>
                <section className="doc-section">
                  <h2 id="history-sdk">History &amp; Spawning APIs (SDK)</h2>
                  <p>
                    The C++ class <a href="file:///d:/Unreal%20Projects/JustLive/Source/JustLive/Gameplay/Peds/HistoryTagChecker.h" style={{ fontFamily: 'monospace', color: 'var(--accent)', fontWeight: 'bold' }}>UHistoryTagChecker</a> handles rules evaluation, while <a href="file:///d:/Unreal%20Projects/JustLive/Source/JustLive/Gameplay/Peds/PedFactory.h" style={{ fontFamily: 'monospace', color: 'var(--accent)', fontWeight: 'bold' }}>UPedFactory</a> instantiates the character actor.
                  </p>
                  <GodCodeBlock
                    language="cpp"
                    code={`// Append tag to character history log
Ped->AddHistoryTag("Witnessed_Crime");

// Check rules against active tags
bool bShouldFlee = UHistoryTagChecker::Get(this)->EvaluateRules(Ped);`}
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
    case 'ped_ambient':
      return (
        <>
          <li><a href="#apm-xml-density">XML Density Config</a></li>
          <li><a href="#apm-bp-control">Ambient Population Control (SDK)</a></li>
        </>
      );
    case 'ped_types':
      return (
        <>
          <li><a href="#ped-type-xml">XML Ped Definition</a></li>
          <li><a href="#ped-type-sdk">Ped Type Identity (SDK)</a></li>
        </>
      );
    case 'ped_capabilities':
      return (
        <>
          <li><a href="#capability-groups">Capability Groups</a></li>
          <li><a href="#capability-xml">XML Control</a></li>
        </>
      );
    case 'ped_states':
      return (
        <>
          <li><a href="#movement-mode">EPedMovementMode</a></li>
          <li><a href="#locomotion-state">ELocomotionState</a></li>
          <li><a href="#action-states">EPedActionState</a></li>
        </>
      );
    case 'ped_history':
      return (
        <>
          <li><a href="#history-tags">History Tag Rules</a></li>
          <li><a href="#ped-factory">PedFactory</a></li>
        </>
      );
    default: return null;
  }
}
