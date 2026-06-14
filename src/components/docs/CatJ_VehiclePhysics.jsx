// CatJ_VehiclePhysics.jsx
// Category J: Vehicle & Physics Simulation
import React from 'react';
import { WorkflowTabGroup, GodCodeBlock } from './docsHelpers';

export function renderPage(docId) {
  switch (docId) {

    case 'vehicle_dynamics':
      return (
        <article className="doc-article">
          <header className="doc-header">
            <span className="doc-category-tag">Vehicle &amp; Physics Simulation</span>
            <h1 className="doc-main-title">Chaos Vehicle Dynamics &amp; Core Systems</h1>
            <p className="doc-lead-para">
              JustLive extends Unreal Engine's Chaos Wheeled Vehicle framework to construct modular, componentized, and fully data-driven vehicles supporting Ground, Air, and Water movement.
            </p>
          </header>

          <section className="doc-section">
            <h2 id="modular-vehicle-classes">Vehicle Pawn Class Hierarchy</h2>
            <p>
              The base pawn class is <a href="file:///d:/Unreal%20Projects/JustLive/Source/JustLive/Gameplay/Vehicles/ModularVehicle.h" style={{ fontFamily: 'monospace', color: 'var(--accent)', fontWeight: 'bold' }}>AModularVehicle</a> (which inherits from Chaos's <code>AModularVehicleClusterPawn</code>). It coordinates health pools, fuel states, input routing, and VFS assembly. Specialized movement domains are segregated into subclasses:
            </p>
            <table className="doc-table">
              <thead><tr><th>Subclass</th><th>Movement Domain</th><th>Key Capabilities</th></tr></thead>
              <tbody>
                <tr><td><code>AAutomobile</code></td><td>Ground (Cars, Vans, Trucks)</td><td>Radiator temperature, battery voltage, alternator health. Uses physical tire friction formulas.</td></tr>
                <tr><td><code>ABike</code></td><td>Ground (Motorcycles, Bicycles)</td><td>Rake angle, lean damping, gyroscopic torque stabilizers.</td></tr>
                <tr><td><code>ABoat</code></td><td>Water (Watercraft)</td><td>Hull buoyancy vectors, propeller water resistance, thrust matrices.</td></tr>
                <tr><td><code>AHelicopter</code></td><td>Air (Rotorcraft)</td><td>Main rotor lift curves, tail rotor yaw torque compensators.</td></tr>
              </tbody>
            </table>
          </section>

          <section className="doc-section">
            <h2 id="vehicle-enums">Vehicle System Enums &amp; Structs</h2>
            <p>
              All vehicle properties are driven by explicit enums and structs declared in <a href="file:///d:/Unreal%20Projects/JustLive/Source/JustLive/Gameplay/Vehicles/VehicleDefines.h" style={{ fontFamily: 'monospace', color: 'var(--accent)', fontWeight: 'bold' }}>VehicleDefines.h</a>:
            </p>
            <ul>
              <li><strong>EVehicleArchetype</strong>: Defines vehicle category (e.g., <code>Generic</code>, <code>Automobile</code>, <code>Bike</code>, <code>Bicycle</code>, <code>Truck</code>, <code>Van</code>, <code>Boat</code>, <code>Helicopter</code>, <code>VTOL</code>).</li>
              <li><strong>EVehicleDomain</strong>: Bitmask for active medium (e.g., <code>Ground = 1 &lt;&lt; 0</code>, <code>Water = 1 &lt;&lt; 1</code>, <code>Air = 1 &lt;&lt; 2</code>).</li>
              <li><strong>EVehiclePropulsionType</strong>: Propulsion class (e.g., <code>Motor</code>, <code>Pedal</code>, <code>Propeller</code>, <code>Rotor</code>, <code>Thruster</code>).</li>
              <li><strong>EVehicleFuelType</strong>: Simulation fuel groups (e.g., <code>Petrol</code>, <code>Diesel</code>, <code>Electric</code>, <code>CNG</code>, <code>AeroFuel</code>).</li>
            </ul>
          </section>

          <WorkflowTabGroup
            xmlContent={
              <>
                <section className="doc-section">
                  <h2 id="vehicle-xml-setup">Vehicle Registration &amp; Assembly (XML)</h2>
                  <p>
                    Vehicles are defined in <code>@data/Entities/Vehicles.xml</code>, registering paths to skeletal meshes, default subsystems, and assembly IDs:
                  </p>
                  <GodCodeBlock
                    language="xml"
                    code={`<!-- Vehicles.xml -->
<Vehicles>
  <Vehicle id="Veh_Coupe_Standard" archetype="Automobile">
    <Chassis path="@content/Vehicles/Coupe/SK_Coupe_Chassis" />
    <Fuel type="Petrol" capacity="60.0" consumptionRate="0.05" />
    <Subsystems chassisMaxHealth="1000.0" engineMaxHealth="100.0" transmissionMaxHealth="100.0" fuelTankMaxHealth="100.0" />
    <Assembly id="Assembly_Coupe_Standard" />
  </Vehicle>
</Vehicles>`}
                  />
                  <p>
                    Visual parts are declared in <code>@data/Entities/VehicleAssemblies.xml</code> to specify which meshes attach to sockets:
                  </p>
                  <GodCodeBlock
                    language="xml"
                    code={`<!-- VehicleAssemblies.xml -->
<Assemblies>
  <Assembly id="Assembly_Coupe_Standard">
    <Part socket="Door_FL" mesh="@content/Vehicles/Coupe/SM_Door_FL" scale="1,1,1" detachable="true" />
    <Part socket="Fender_FR" mesh="@content/Vehicles/Coupe/SM_Fender_FR" scale="1,1,1" detachable="true" />
  </Assembly>
</Assemblies>`}
                  />
                </section>
              </>
            }
            bpContent={
              <>
                <section className="doc-section">
                  <h2 id="vehicle-bp-setup">Blueprint Designer Guidelines</h2>
                  <p>
                    Visual designers can place vehicle pawns directly into the level or configure default parameters in Blueprint details panels without touching code:
                  </p>
                  <ul>
                    <li><strong>Mesh Setup:</strong> Assign the visual <code>SkeletalMesh</code> inside the base <code>Mesh</code> component. Sockets mapped on this skeleton will receive the modular attachments.</li>
                    <li><strong>Assembly Toggle:</strong> Check the box <strong>bAutoAssembleBodyParts</strong> in the Details Panel to trigger visual socket assembly automatically at BeginPlay. Check <strong>bHideSkeletalChassis</strong> if only visual attachments should render.</li>
                    <li><strong>Domain Configuration:</strong> Set <strong>SupportedDomainsMask</strong> (bitmask for Ground, Water, Air) to determine what mediums this vehicle can navigate when dynamically updated by scripting systems.</li>
                  </ul>
                  <p>
                    Subclass-specific controllers handle basic inputs via standard input mappings, which pass straight into Chaos drive inputs.
                  </p>
                </section>
              </>
            }
            cCodeContent={
              <>
                <section className="doc-section">
                  <h2 id="vehicle-cpp-api">Vehicle C++ &amp; Scripting API</h2>
                  <p>
                    Developers programmatically steer, configure, or damage vehicles via the core C++ interface. The <a href="file:///d:/Unreal%20Projects/JustLive/Source/JustLive/Gameplay/Vehicles/VehicleManager.h" style={{ fontFamily: 'monospace', color: 'var(--accent)', fontWeight: 'bold' }}>UVehicleManager</a> coordinates static vehicle registry databases loaded from XML.
                  </p>
                  <p>
                    To configure active domains or control ignition at runtime:
                  </p>
                  <GodCodeBlock
                    language="cpp"
                    code={`// Start vehicle ignition sequence in C++
AModularVehicle* TargetVehicle = Cast<AModularVehicle>(GetControlledPawn());
if (TargetVehicle)
{
    TargetVehicle->StartEngine();
    TargetVehicle->SwitchActiveDomain(EVehicleDomain::Ground);
}`}
                  />
                  <p>
                    From <code>.sc</code> scripts, trigger ignition and toggle visual highlights:
                  </p>
                  <GodCodeBlock
                    language="sc"
                    code={`// Script VM Call to light up the car
local vehicle = Vehicle->GetPlayerVehicle();
if (vehicle)
{
    Vehicle->StartEngine(vehicle);
    Vehicle->ToggleLights(vehicle);
}`}
                  />
                </section>
              </>
            }
          />

          <section className="doc-section">
            <h2 id="distributed-authority">Distributed P2P Authority &amp; Handoffs</h2>
            <p>
              To eliminate input latency for drivers, JustLive shifts Chaos vehicle physics away from the traditional Dedicated Server model towards a <strong>Client-Authoritative P2P Handoff</strong> model.
            </p>
            <ul className="doc-list">
              <li><strong>Driver Host:</strong> When a player enters a vehicle, they become the Driver Host. Their client runs the Chaos simulation at 0ms latency and broadcasts <code>FTransform</code> updates to the Session Host and Observers.</li>
              <li><strong>Chaos Sleep Handoff:</strong> If the driver bails out of a moving vehicle, their client remains the Physics Host until the vehicle tumbles to a halt. Once the Chaos Physics Island triggers <code>OnComponentSleep</code>, authority is seamlessly transferred back to the grid's general Session Host.</li>
              <li><strong>Blueprint Note:</strong> Standalone developers applying physical impulses (e.g., explosions) must route those impulses via RPC to the current <strong>Physics Host</strong> of the vehicle to prevent rubber-banding.</li>
            </ul>
          </section>
        </article>
      );

    case 'vehicle_damage':
      return (
        <article className="doc-article">
          <header className="doc-header">
            <span className="doc-category-tag">Vehicle &amp; Physics Simulation</span>
            <h1 className="doc-main-title">Deformation &amp; Destruction</h1>
            <p className="doc-lead-para">
              JustLive uses a mechanical subsystem degradation model to drive organic breakdowns, rather than relying on a generic health bar.
            </p>
          </header>

          <section className="doc-section">
            <h2 id="subsystem-degradation">Subsystem Health Pools</h2>
            <p>
              Subsystems track health via the <code>FVehicleSubsystemHealth</code> struct (defined in <code>VehicleDefines.h</code>), which maintains <code>CurrentHealth</code>, <code>MaxHealth</code>, and a <code>FailureThreshold</code>. When health drops below this threshold, the subsystem fails.
            </p>
            <p>
              The baseline subsystems monitored are:
            </p>
            <ul>
              <li><strong>EngineSubsystemHealth</strong>: Controls engine torque capacity and ignition stability.</li>
              <li><strong>TransmissionSubsystemHealth</strong>: Controls power transmission efficiency across gears.</li>
              <li><strong>SuspensionSubsystemHealth</strong>: Dampens wheel stabilization forces.</li>
              <li><strong>AxleSubsystemHealth</strong>: Dictates steering bounds and braking coefficient.</li>
              <li><strong>ChassisSubsystemHealth</strong>: Main structural pool. If depleted, the vehicle explodes.</li>
              <li><strong>FuelTankSubsystemHealth</strong>: Controls leaking rates and fuel line integrity.</li>
            </ul>
          </section>

          <WorkflowTabGroup
            xmlContent={
              <>
                <section className="doc-section">
                  <h2 id="damage-xml">Visual Part Definitions (XML)</h2>
                  <p>
                    Visual meshes that can detach under physical impact forces are configured inside <code>VehicleAssemblies.xml</code> using thresholds:
                  </p>
                  <GodCodeBlock
                    language="xml"
                    code={`<!-- Defining detachable part with hit health -->
<Part socket="Bumper_F" mesh="@content/Vehicles/Coupe/SM_Bumper_F">
  <Health max="100.0" detachmentThreshold="80000.0" canBeDetached="true" />
</Part>`}
                  />
                </section>
              </>
            }
            bpContent={
              <>
                <section className="doc-section">
                  <h2 id="damage-bp">Subsystem Access &amp; Repair (SDK)</h2>
                  <p>
                    Visual nodes in Blueprint details panels can query subsystem operations directly to animate dials or play smoke emitters:
                  </p>
                  <GodCodeBlock
                    language="cpp"
                    code={`// Access engine operational ratio
float EngineRatio = MyVehicle->GetSubsystemHealthRatio(FName("Engine"));
if (EngineRatio < 0.3f)
{
    // Trigger smoke particle component
    SmokeEmitter->Activate();
}`}
                  />
                </section>
              </>
            }
            cCodeContent={
              <>
                <section className="doc-section">
                  <h2 id="damage-cpp">Degradation Logic &amp; Detachment (C++)</h2>
                  <p>
                    Physical hits call the <code>NotifyHit</code> override. Dynamic degradation occurs in <code>ApplyHealthToMechanicalState()</code>:
                  </p>
                  <GodCodeBlock
                    language="cpp"
                    code={`// Internal state updating from subsystem health ratios
void AModularVehicle::ApplyHealthToMechanicalState()
{
    if (!bEnableMechanicalHealthDegradation) return;

    float EngineRatio = EngineSubsystemHealth.GetNormalized();
    EffectivePowerFactor = FMath::Lerp(0.2f, 1.0f, EngineRatio);

    if (EngineSubsystemHealth.IsFailed())
    {
        EffectivePowerFactor = 0.0f;
        StopEngine();
    }
}`}
                  />
                  <p>
                    When collision impulses exceed threshold limits, visual parts detach via <code>DetachPart()</code>:
                  </p>
                  <GodCodeBlock
                    language="cpp"
                    code={`// Detach bumper or door, convert to physical actor
void AModularVehicle::DetachPart(FVehicleVisualPartHealth& Part)
{
    if (Part.bIsDetached || !Part.bCanBeDetached) return;

    Part.bIsDetached = true;
    // Detach visual mesh component, enable physical simulation, apply impulse
    // ...
}`}
                  />
                </section>
              </>
            }
          />

          <section className="doc-section">
            <h2 id="deformation-status">Current Deformation Tech Status</h2>
            <div className="doc-alert note">
              <div className="alert-header">DEVELOPMENT STATE</div>
              <div className="alert-body">
                True soft-body mesh deformation (such as morph targets or Chaos dynamic mesh fracturing) is currently <strong>Not Started</strong>. During testing, the engine calls <code>CreatePrimitivePart()</code> to attach primitive collision boxes/spheres. Collisions call <code>NotifyHit</code> which routes impact forces to numerical subsystem damage pools rather than crumpling mesh geometry.
              </div>
            </div>
          </section>
        </article>
      );

    case 'vehicle_ambient':
      return (
        <article className="doc-article">
          <header className="doc-header">
            <span className="doc-category-tag">Vehicle &amp; Physics Simulation</span>
            <h1 className="doc-main-title">AmbientVehiclePopulation System</h1>
            <p className="doc-lead-para">
              Tuning traffic density and loading vehicle meshes dynamically near the player to manage CPU budgets in large maps.
            </p>
          </header>

          <section className="doc-section">
            <h2 id="population-spawning">Traffic Spawning &amp; Management</h2>
            <p>
              The manager class <a href="file:///d:/Unreal%20Projects/JustLive/Source/JustLive/Gameplay/Vehicles/AmbientVehiclePopulation.h" style={{ fontFamily: 'monospace', color: 'var(--accent)', fontWeight: 'bold' }}>UAmbientVehiclePopulation</a> runs a time-sliced ticking loop (5Hz) to check active traffic counts around the player. It pulls from a traffic-ready pool declared in <code>Vehicles.xml</code>, spawning vehicles just outside the player's line of sight.
            </p>
          </section>

          <WorkflowTabGroup
            xmlContent={
              <>
                <section className="doc-section">
                  <h2 id="ambient-xml">Traffic Config (XML)</h2>
                  <p>
                    Vehicle spawn weights and limits are configured under <code>@data/Entities/AmbientTraffic.xml</code>:
                  </p>
                  <GodCodeBlock
                    language="xml"
                    code={`<!-- AmbientTraffic.xml -->
<TrafficConfig maxTotalVehicles="32">
  <Archetypes>
    <Vehicle id="Veh_Coupe_Standard" weight="0.7" />
    <Vehicle id="Veh_Truck_Heavy" weight="0.3" />
  </Archetypes>
</TrafficConfig>`}
                  />
                </section>
              </>
            }
            bpContent={
              <>
                <section className="doc-section">
                  <h2 id="ambient-bp">Querying Spawn States</h2>
                  <p>
                    Visual controllers can query active ambient counts or toggle traffic rules globally via variables in the Population subsystem details panels.
                  </p>
                </section>
              </>
            }
            cCodeContent={
              <>
                <section className="doc-section">
                  <h2 id="ambient-cpp">Two-Tier LOD Component (C++)</h2>
                  <p>
                    Vehicles implement a two-tier level of detail (LOD) system managed by <a href="file:///d:/Unreal%20Projects/JustLive/Source/JustLive/Gameplay/Vehicles/Components/VehicleLODComponent.h" style={{ fontFamily: 'monospace', color: 'var(--accent)', fontWeight: 'bold' }}>UVehicleLODComponent</a>:
                  </p>
                  <ul>
                    <li><strong>High LOD (Near Player)</strong>: Active Chaos Physics simulation. High-frequency updates.</li>
                    <li><strong>Low LOD (Far Distance)</strong>: teleports kinematic "dummy" pawns along road lane splines (<code>USplineComponent</code>) to eliminate Chaos ticking costs.</li>
                  </ul>
                  <GodCodeBlock
                    language="cpp"
                    code={`// Convert vehicle to Low LOD dummy spline traversal
void UVehicleLODComponent::UpdateDummyVehicles(float DeltaTime)
{
    if (CurrentLOD == EVehicleLOD::Low)
    {
        // Disable physical rigid bodies
        GetVehicle()->GetMesh()->SetSimulatePhysics(false);
        // Step forward along road spline
        FVector NextLocation = SplineRef->GetLocationAtDistanceAlongSpline(DistanceTravelled, ESplineCoordinateSpace::World);
        GetVehicle()->SetActorLocation(NextLocation);
    }
}`}
                  />
                  <div className="doc-alert warning">
                    <div className="alert-header">TECHNICAL DEBT WARNING</div>
                    <div className="alert-body">
                      The spline teleportation loop (<code>SetActorLocationAndRotation</code>) lacks a ray-trace check to adjust to the terrain Z-height. If roads possess sudden elevation changes, dummy vehicles can float or clip into the ground.
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

    case 'vehicle_dynamics':
      return (
        <>
          <li><a href="#modular-vehicle-classes">Vehicle Pawn Class Hierarchy</a></li>
          <li><a href="#vehicle-enums">Vehicle System Enums &amp; Structs</a></li>
          <li><a href="#vehicle-xml-setup">Vehicle Registration &amp; Assembly</a></li>
          <li><a href="#distributed-authority">Distributed P2P Authority</a></li>
        </>
      );

    case 'vehicle_damage':
      return (
        <>
          <li><a href="#subsystem-degradation">Subsystem Health Pools</a></li>
          <li><a href="#damage-xml">Visual Part Definitions (XML)</a></li>
          <li><a href="#damage-cpp">Degradation Logic &amp; Detachment (C++)</a></li>
          <li><a href="#deformation-status">Deformation Tech Status</a></li>
        </>
      );

    case 'vehicle_ambient':
      return (
        <>
          <li><a href="#population-spawning">Traffic Spawning</a></li>
          <li><a href="#ambient-xml">Traffic Config (XML)</a></li>
          <li><a href="#ambient-cpp">Two-Tier LOD Component (C++)</a></li>
        </>
      );

    default: return null;
  }
}
