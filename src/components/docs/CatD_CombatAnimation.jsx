// CatD_CombatAnimation.jsx
// Category D: Combat & Animation Corner
import React from 'react';
import { GodCodeBlock } from './docsHelpers';

/**
 * Returns the rendered article JSX for the given docId,
 * or null if this category doesn't own that id.
 */
export function renderPage(docId) {
  switch (docId) {

    case 'anims':
      return (
        <article className="doc-article">
          <header className="doc-header">
            <span className="doc-category-tag">Combat &amp; Animation Corner</span>
            <h1 className="doc-main-title">Locomotion &amp; Dynamic Anim Sets</h1>
            <p className="doc-lead-para">
              JustLive replaces hardcoded animation slots and compile-locked Animation Blueprints with dynamic, XML-driven blendspace bindings managed by <code>UAnimationSetManager</code>.
            </p>
          </header>

          <section className="doc-section">
            <h2 id="anims-blendspaces">Locomotion BlendSpaces</h2>
            <p>
              Standard movement blends (walking, jogging, sprinting) are parsed from locomotion tables (like <code>Locomotion_Stand.xml</code>). The system supports speed-dependent gaits and dynamic water wading:
            </p>
            <ul className="doc-list">
              <li><strong>Wading Depth Checks</strong>: In wading zones, speed is gated by water depth ratios. Decelerations, blend space bounds, and wetted animations blend dynamically based on character chest, stomach, or knee alignments.</li>
              <li><strong>Lean Angle Solving</strong>: Console inputs affect yaw angles, dynamically setting lean floats (<code>LeanAmount</code>) solved inside the AnimGraph.</li>
            </ul>
          </section>

          <section className="doc-section">
            <h2 id="anims-dynamic-sets">Dynamic Gait Swapping</h2>
            <p>
              When a character equips a weapon, <code>AnimationSetManager</code> swaps locomotion matrices. Rather than keeping all blendspaces in memory, the manager retrieves weapon-specific sets (e.g. <code>Weapon_Rifle_Male.xml</code>) and updates the AnimInstance slot binders:
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: 'var(--bg-panel)', border: '1px solid var(--line-primary)', borderRadius: 'var(--radius-md)', margin: '1rem 0' }}>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-dim)' }}>EQUIPPED WEAPON CLASS</span>
                <h4 style={{ margin: '0.25rem 0', color: 'var(--doc-primary)' }}>Rifle Semi</h4>
              </div>
              <div style={{ fontSize: '1.5rem', color: 'var(--accent)' }}>&rarr;</div>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-dim)' }}>XML REGISTRY KEY</span>
                <h4 style={{ margin: '0.25rem 0', color: 'var(--doc-warning)' }}>Weapon_Rifle_Male</h4>
              </div>
              <div style={{ fontSize: '1.5rem', color: 'var(--accent)' }}>&rarr;</div>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-dim)' }}>ANIMINSTANCE BLENDSPACE</span>
                <h4 style={{ margin: '0.25rem 0', color: 'var(--doc-success)' }}>BS_Rifle_Locomotion</h4>
              </div>
            </div>
          </section>

          <section className="doc-section">
            <h2 id="anims-retention">Safety &amp; Asset Retention</h2>
            <p>
              To avoid high VRAM thresholds during asset streaming, the manager limits memory retention. Emitters, montage sequences, and blendspaces are requested via <code>RequestAnimationWithTimeout()</code>. When a character holsters a weapon or leaves an active World Partition cell, references are unlinked and cleaned via <code>UnloadAnimation()</code>, releasing garbage collection pools without waiting for map changes.
            </p>
          </section>
        </article>
      );

    case 'pedactor':
      return (
        <article className="doc-article">
          <header className="doc-header">
            <span className="doc-category-tag">Combat &amp; Animation Corner</span>
            <h1 className="doc-main-title">Pedestrian Actor Monolith (APed)</h1>
            <p className="doc-lead-para">
              The <code>APed</code> class (inheriting from <code>ACharacter</code>) is the primary gameplay entity in JustLive. It is designed as a modular monolith, delegating logic entirely to actor components.
            </p>
          </header>

          <section className="doc-section">
            <h2 id="pedactor-decoupling">Modular Component Decoupling</h2>
            <p>
              To maintain high performance and clean replication profiles, <code>APed</code> separates character capabilities, inventory states, and social indices into dedicated components:
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', margin: '1rem 0' }}>
              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-panel)', border: '1px solid var(--line-primary)', borderRadius: 'var(--radius-sm)' }}>
                <h5 style={{ margin: '0 0 0.25rem 0', color: 'var(--doc-primary)' }}>UAttributesComponent</h5>
                <p style={{ fontSize: '0.8rem', margin: 0, color: 'var(--text-dim)' }}>Tracks health, armor, stamina, and gates physical operations using capability flags (e.g. <code>CanClimb</code>).</p>
              </div>
              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-panel)', border: '1px solid var(--line-primary)', borderRadius: 'var(--radius-sm)' }}>
                <h5 style={{ margin: '0 0 0.25rem 0', color: 'var(--doc-warning)' }}>UPhysicsRagdollComponent</h5>
                <p style={{ fontSize: '0.8rem', margin: 0, color: 'var(--text-dim)' }}>Handles dynamic physical ragdoll blending, impact impulse coordinates, and procedural get-up transitions.</p>
              </div>
              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-panel)', border: '1px solid var(--line-primary)', borderRadius: 'var(--radius-sm)' }}>
                <h5 style={{ margin: '0 0 0.25rem 0', color: 'var(--doc-success)' }}>UIdentityComponent</h5>
                <p style={{ fontSize: '0.8rem', margin: 0, color: 'var(--text-dim)' }}>Maintains a matrix of 29 float trait scores (aggression, fear) and parses append-only history files.</p>
              </div>
              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-panel)', border: '1px solid var(--line-primary)', borderRadius: 'var(--radius-sm)' }}>
                <h5 style={{ margin: '0 0 0.25rem 0', color: 'var(--accent)' }}>UInventoryComponent</h5>
                <p style={{ fontSize: '0.8rem', margin: 0, color: 'var(--text-dim)' }}>Stores dynamic weapons (<code>FWeaponInstance</code>), manages ammunition caliber arrays, and triggers holstering sockets.</p>
              </div>
            </div>
          </section>

          <section className="doc-section">
            <h2 id="pedactor-components">Capability Flags &amp; Movement Limits</h2>
            <p>
              Peds check capability flags in <code>UAttributesComponent</code> before executing traversals, cover slides, or jumps. If a ped personality profile registers <code>CanClimb = false</code>, navigation mesh query loops skip link evaluations entirely, avoiding expensive CPU cycles.
            </p>
          </section>

          <section className="doc-section">
            <h2 id="pedactor-aiming">Aiming &amp; Spine IK Solving</h2>
            <p>
              Procedural aiming relies on standard bone modifications. First, local look-at values are clamped to prevent skeletal tearing (Yaw limit &plusmn;70&deg;, Pitch range -75&deg; to 75&deg;). In the AnimGraph execution flow, the spine bone rotation is solved prior to Two-Bone hand IK, ensuring that weapon grips align dynamically with mesh sockets.
            </p>
          </section>
        </article>
      );

    case 'weapons':
      return (
        <article className="doc-article">
          <header className="doc-header">
            <span className="doc-category-tag">Combat &amp; Animation Corner</span>
            <h1 className="doc-main-title">Weapons, Combat &amp; Firing Systems</h1>
            <p className="doc-lead-para">
              JustLive implements a strict, triple-tiered architecture to govern gunplay, ballistic trajectory solvers, and weapon attachments. Logic, data, and visual systems remain strictly decoupled.
            </p>
          </header>

          <section className="doc-section">
            <h2 id="weapons-architecture">The Triple-Tiered Weapon Model</h2>
            <p>
              To support hot-swapping textures, attachment delta modifications, and multiplayer synchronization, weapons are split into three layers:
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', margin: '1rem 0' }}>
              <div style={{ display: 'flex', gap: '1rem', padding: '1rem', backgroundColor: 'var(--bg-panel)', border: '1px solid var(--line-primary)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ padding: '0.4rem 0.8rem', backgroundColor: 'var(--accent-pale)', color: 'var(--accent)', borderRadius: 'var(--radius-sm)', fontWeight: 'bold', fontSize: '0.8rem', alignSelf: 'flex-start' }}>STATIC DATA</div>
                <div style={{ flex: 1 }}>
                  <h5 style={{ margin: '0 0 0.25rem 0', fontSize: '0.95rem' }}>FWeaponStaticInfo</h5>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-dim)' }}>Loaded from <code>Weapons.xml</code> at boot. Contains immutable base properties: base damage, rate of fire, recoil curves, and ammo caliber type.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', padding: '1rem', backgroundColor: 'var(--bg-panel)', border: '1px solid var(--line-primary)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ padding: '0.4rem 0.8rem', backgroundColor: 'var(--accent-pale)', color: 'var(--accent)', borderRadius: 'var(--radius-sm)', fontWeight: 'bold', fontSize: '0.8rem', alignSelf: 'flex-start' }}>DYNAMIC STATE</div>
                <div style={{ flex: 1 }}>
                  <h5 style={{ margin: '0 0 0.25rem 0', fontSize: '0.95rem' }}>FWeaponInstance</h5>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-dim)' }}>Lives inside the Ped's <code>InventoryComponent</code>. Tracks live mutable variables: remaining ammo pool, active attachments, and modified accuracy deltas.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', padding: '1rem', backgroundColor: 'var(--bg-panel)', border: '1px solid var(--line-primary)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ padding: '0.4rem 0.8rem', backgroundColor: 'var(--accent-pale)', color: 'var(--accent)', borderRadius: 'var(--radius-sm)', fontWeight: 'bold', fontSize: '0.8rem', alignSelf: 'flex-start' }}>ACTOR LAYER</div>
                <div style={{ flex: 1 }}>
                  <h5 style={{ margin: '0 0 0.25rem 0', fontSize: '0.95rem' }}>WeaponVisualsComponent &amp; WeaponFiringComponent</h5>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-dim)' }}>Spawns the skeletal mesh, manages attachment socket bindings, calculates firing math, and registers noise events to AI perception sensors.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="doc-section">
            <h2 id="weapons-ballistics">Adaptive Ballistic LODs</h2>
            <p>
              To handle massive open-world firefights with hundreds of pedestrians without melting the CPU, the <code>AdvancedProjectileManager</code> uses an <strong>Adaptive Ballistic LOD Matrix</strong> based on a dynamic "Chaos Score" and camera distance.
            </p>
            <table className="doc-table">
              <thead>
                <tr>
                  <th>LOD Tier</th>
                  <th>Name</th>
                  <th>Computational Model &amp; Mechanics</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>LOD 0</strong></td>
                  <td>Cinematic</td>
                  <td>Used for close-range combat. Full frame-by-frame math simulation (bullet drop, drag) with a physical Niagara tracer overlay.</td>
                </tr>
                <tr>
                  <td><strong>LOD 1</strong></td>
                  <td>High Chaos</td>
                  <td>Triggered when 200+ bullets are flying. Drops math for a fast 500m hitscan LineTrace. Draws a cheap GPU Ribbon. If the bullet misses the first 500m, it transitions to LOD 0 (Plunging Fire).</td>
                </tr>
                <tr>
                  <td><strong>LOD 2</strong></td>
                  <td>Extreme Distance</td>
                  <td>Used for firefights &gt; 2km away. Zero physics. Performs a pure statistical dice-roll to apply damage, spawning a cheap unlit 2D color dot on impact.</td>
                </tr>
              </tbody>
            </table>
            <div className="doc-alert tip">
              <div className="alert-header">THE SECONDARY MUZZLE</div>
              <div className="alert-body">
                When attaching an Underbarrel Grenade Launcher, the primary 5.56mm bullets still shoot from the top barrel. To support this, <code>WeaponVisualsComponent</code> queries <code>GetSecondaryMuzzleLocation()</code> to ensure Alt-Fire mechanics spawn projectiles from the lower tube correctly.
              </div>
            </div>
          </section>

          <section className="doc-section">
            <h2 id="weapons-attachments">Complex RPG Modifiers</h2>
            <p>
              Weapon attachments are registered in <code>Attachments.xml</code> (e.g. scopes, grips, silencers). When equipped on a live <code>FWeaponInstance</code>, they act as delta modifiers on base statistics.
            </p>
            <p>
              To support deep, Tarkov-like customization, <strong>every stat features both an Additive and a Multiplier field</strong>.
            </p>
            <GodCodeBlock
              language="xml"
              code={`<Attachment ID="Att_HeavyBarrel" Slot="Barrel">
    <Modifiers 
        DamageAdd="10.0" Damage="1.0" 
        RangeAdd="2000.0" Range="1.2" 
        VerticalRecoilAdd="-0.5" VerticalRecoil="0.9" />
</Attachment>`}
            />
            <p>
              The <code>UWeaponStatComponent</code> dynamically evaluates these when an attachment is swapped: <code>FinalStat = (BaseStat + TotalAdditive) * TotalMultiplier</code>.
            </p>
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

    case 'anims':
      return (
        <>
          <li><a href="#anims-blendspaces">Locomotion BlendSpaces</a></li>
          <li><a href="#anims-dynamic-sets">Dynamic Gait Sets</a></li>
          <li><a href="#anims-retention">Safety &amp; Retention</a></li>
        </>
      );

    case 'pedactor':
      return (
        <>
          <li><a href="#pedactor-decoupling">Component Decoupling</a></li>
          <li><a href="#pedactor-components">Component Registry</a></li>
          <li><a href="#pedactor-aiming">Aiming &amp; Spine IK</a></li>
        </>
      );

    case 'weapons':
      return (
        <>
          <li><a href="#weapons-architecture">Triple-Tiered Model</a></li>
          <li><a href="#weapons-ballistics">Adaptive Ballistic LODs</a></li>
          <li><a href="#weapons-attachments">Complex RPG Modifiers</a></li>
        </>
      );

    default: return null;
  }
}
