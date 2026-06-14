import React, { useState } from 'react';

export default function Legal() {
  const [activeTab, setActiveTab] = useState('tos');

  return (
    <div style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto', color: 'var(--text-main)' }}>
      <h1 style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>JustLive Legal Hub</h1>
      <p style={{ color: 'var(--text-dim)', marginBottom: '2rem' }}>Last Updated: June 2026</p>

      <div className="legal-container">
        <aside className="legal-sidebar">
          <button className={`legal-tab-btn ${activeTab === 'tos' ? 'active' : ''}`} onClick={() => setActiveTab('tos')}>
            Terms of Service & EULA
          </button>
          <button className={`legal-tab-btn ${activeTab === 'privacy' ? 'active' : ''}`} onClick={() => setActiveTab('privacy')}>
            Privacy Policy
          </button>
          <button className={`legal-tab-btn ${activeTab === 'guidelines' ? 'active' : ''}`} onClick={() => setActiveTab('guidelines')}>
            Community Guidelines
          </button>
        </aside>

        <main className="legal-content">
          {activeTab === 'tos' && <TermsOfService />}
          {activeTab === 'privacy' && <PrivacyPolicy />}
          {activeTab === 'guidelines' && <CommunityGuidelines />}
        </main>
      </div>
      
      <div style={{ marginTop: '4rem', paddingTop: '1rem', borderTop: '1px solid var(--line-primary)', fontSize: '0.9rem', color: 'var(--text-dim)' }}>
        For DMCA/Copyright takedown requests or Grievance Officer contact (as per IT Rules 2011), please contact: <strong>legal@vampiregames.com</strong>
      </div>
    </div>
  );
}

function TermsOfService() {
  return (
    <>
      <h2 style={{ color: 'var(--doc-primary)', marginTop: 0 }}>Terms of Service & EULA</h2>
      <section className="legal-section">
        <h3>1. Acceptance of Terms</h3>
        <p>By downloading, installing, accessing, or using the <strong>JustLive</strong> game, the JustLive Software Development Kit (SDK), or any associated online services (collectively, the "Platform"), you agree to be bound by these Terms of Service and End User License Agreement (the "Agreement").</p>
        <p>This Agreement incorporates by reference the <a href="https://www.unrealengine.com/en-US/eula" target="_blank" rel="noreferrer" style={{color: 'var(--doc-primary)'}}>Epic Games Unreal Engine EULA</a> and the <a href="https://mod.io/terms" target="_blank" rel="noreferrer" style={{color: 'var(--doc-primary)'}}>Mod.io Terms of Use</a>.</p>
      </section>

      <section className="legal-section">
        <h3>2. Licensing & Commercialization</h3>
        <p>JustLive operates on a dual-license model to foster a thriving modding community while protecting the core technology.</p>
        <ul>
          <li><strong>The Modding License (Free):</strong> You are granted a free, non-exclusive, non-transferable license to create, distribute, and play mods, scripts (.sc), and XML configurations that require the JustLive base game to operate. This includes making official contributions to the base C++ modules via GitHub.</li>
          <li><strong>The Commercial SDK License (Paid):</strong> If you wish to compile a standalone executable (.exe) using the JustLive technology stack to sell as your own commercial product, you must purchase the Commercial SDK License. Developing a standalone game without this license is strictly prohibited.</li>
        </ul>
      </section>

      <section className="legal-section">
        <h3>3. User-Generated Content (UGC) & Safe Harbour (IT Act, 2000)</h3>
        <p>The Platform allows users to create, upload, and distribute User-Generated Content (UGC). UGC is hosted and delivered via third-party services (e.g., Mod.io).</p>
        <div style={{ padding: '1rem', backgroundColor: 'var(--bg-panel)', borderLeft: '4px solid var(--doc-warning)' }}>
          <strong>Section 79 Safe Harbour (Information Technology Act, 2000):</strong><br/>
          JustLive acts strictly as an <em>Intermediary</em> regarding UGC and Peer-to-Peer multiplayer interactions. We do not initiate the transmission, select the receiver, or modify the information contained in user transmissions. 
          <br/><br/>
          <strong>You, the user, retain full ownership and 100% legal liability for the content you create and distribute.</strong> JustLive is not liable for copyright infringement, distribution of illegal material, or malicious code hidden in UGC.
        </div>
      </section>

      <section className="legal-section">
        <h3>4. Virtual Currency & Economy</h3>
        <p>The Platform may feature a virtual currency ("MillHaven Coin"). This currency has no real-world monetary value, cannot be exchanged for fiat currency, and is provided solely for entertainment purposes within the sandbox environment. We reserve the right to wipe, alter, or seize virtual currency balances at any time, especially in response to economy exploits.</p>
      </section>

      <section className="legal-section">
        <h3>5. Reverse Engineering</h3>
        <p>While the Platform embraces modding via provided SDK tools, you agree not to reverse engineer, decompile, or decrypt the proprietary <code>UGPack</code> / Virtual File System (VFS) architecture, or bypass the Epic Online Services (EOS) authentication handshakes.</p>
      </section>

      <section className="legal-section">
        <h3>6. The Justice System (Enforcement & Softbans)</h3>
        <p>We reserve the right, at our sole discretion and without notice, to apply the <strong>"Ghosted"</strong> status to your account if found utilizing memory-injection cheats or violating community guidelines.</p>
        <ul>
          <li>A Ghosted account remains in the physical game world but is stripped of all authority.</li>
          <li>Your physics packets will be rejected by the server.</li>
          <li>Your damage outputs will be nullified.</li>
        </ul>
        <p>By using the Platform, you legally agree to this enforcement mechanism as a valid consequence for violating this Agreement.</p>
      </section>
    </>
  );
}

function PrivacyPolicy() {
  return (
    <>
      <h2 style={{ color: 'var(--doc-primary)', marginTop: 0 }}>Privacy Policy</h2>
      <p>This Privacy Policy outlines how Vampire Games ("we," "us," or "our") collects, uses, and protects your data under the Indian Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, and the GDPR.</p>
      
      <section className="legal-section">
        <h3>1. Data We Collect</h3>
        <p>To operate the Peer-to-Peer (P2P) networking architecture and Anti-Cheat systems, we collect the following telemetry:</p>
        <ul>
          <li><strong>Hardware & Network Telemetry:</strong> CPU/GPU tier, Operating System, RAM, and Network Connection Type (Ethernet vs. WiFi, Metered status).</li>
          <li><strong>Identifiers:</strong> Epic Online Services (EOS) Account ID, IP Address, and hardware HWID.</li>
          <li><strong>Gameplay Data:</strong> In-game coordinates, inventory states, and statistical hit/miss ratios.</li>
        </ul>
      </section>

      <section className="legal-section">
        <h3>2. Why We Collect This Data</h3>
        <ul>
          <li><strong>Host Election:</strong> Hardware and network telemetry is strictly used to calculate a "Host Eligibility Score" to dynamically assign P2P Authority in multiplayer sessions.</li>
          <li><strong>Anti-Cheat:</strong> Hardware IDs and statistical gameplay data are analyzed by our Thin-Server Arbiter and Easy Anti-Cheat (EAC) to detect impossible physical movements or aimbot behavior.</li>
          <li><strong>Legal Compliance:</strong> IP addresses and connection logs are retained for 180 days in compliance with CERT-In directives (India).</li>
        </ul>
      </section>

      <section className="legal-section">
        <h3>3. Data Sharing & Third Parties</h3>
        <p>We do <strong>not</strong> sell your data to advertisers or data brokers. Your data is shared exclusively with necessary infrastructure partners:</p>
        <ul>
          <li><strong>Epic Games (EOS):</strong> For matchmaking, authentication, and NAT punch-through.</li>
          <li><strong>Mod.io:</strong> To link your account to your subscribed User-Generated Content.</li>
        </ul>
      </section>

      <section className="legal-section">
        <h3>4. Your Rights</h3>
        <p>You have the right to request the deletion of your JustLive profile data. Note that deleting your data will result in a permanent ban from official multiplayer matchmaking, as HWID and EOS ID retention are required for ban evasion prevention.</p>
      </section>
    </>
  );
}

function CommunityGuidelines() {
  return (
    <>
      <h2 style={{ color: 'var(--doc-primary)', marginTop: 0 }}>Community Guidelines</h2>
      <p>JustLive is a sandbox. We want you to break the physics, create chaotic mods, and build your own games. However, true freedom requires respect. These guidelines dictate behavior for Players, Modders, and Code Contributors.</p>

      <section className="legal-section">
        <h3>For Players (In-Game Behavior)</h3>
        <ul>
          <li><strong>No Hate Speech or Harassment:</strong> Voice chat and text chat must remain free of slurs, targeted harassment, or doxxing. </li>
          <li><strong>Embrace the Ghost:</strong> If you are caught cheating, your account will be "Ghosted" (softbanned). Do not contact support demanding a refund. You broke the rules, you accept the Ghost state.</li>
          <li><strong>Economy Exploits:</strong> Duplicating MillHaven Coin or manipulating the P2P save architecture will result in an immediate inventory wipe.</li>
        </ul>
      </section>

      <section className="legal-section">
        <h3>For Modders (XML, Scripting, Assets)</h3>
        <p>JustLive is a platform for creative freedom. Whether you are building a casual mini-game or a gritty, realistic war simulator, you are responsible for how your content is classified.</p>
        <ul>
          <li><strong>Maturity Tagging (NSFW/Gore):</strong> If your mod contains high-impact violence, realistic gore, nudity, or strong language, you **must** mark it with the "Mature" or "NSFW" tag on Mod.io. Failure to tag content correctly will result in the mod being hidden until re-classified.</li>
          <li><strong>Age Verification:</strong> Access to "Mature" tagged content is restricted based on the Date of Birth (DoB) provided during account registration. This DoB is permanent and cannot be changed without manual verification.</li>
          <li><strong>No Real-World Incitement:</strong> While we allow the depiction of historical or fictional conflicts (e.g., WWII simulators, Afghan War depictions), we strictly prohibit content that incites real-world terrorism, provides instructions for real-world illegal acts, or promotes active hate groups.</li>
          <li><strong>Intellectual Property (IP) Theft:</strong> Do not rip assets from other commercial games. If we receive a valid DMCA, the content will be removed to protect the Platform's Safe Harbour status.</li>
        </ul>
      </section>

      <section className="legal-section">
        <h3>For Open-Source Contributors (GitHub)</h3>
        <p>If you are contributing C++ modules to the core engine on GitHub:</p>
        <ul>
          <li><strong>No Lazy Code:</strong> Follow the Architectural Mandate: <em>"Write it C++, Make it XML, Abstract the Memory."</em> Do not submit Pull Requests containing hardcoded paths, uninitialized pointers, or bypassed capability flags.</li>
          <li><strong>Respect the License:</strong> Any code merged into the `JustLive` main branch becomes part of the core engine and falls under our dual-licensing model.</li>
          <li><strong>Be Professional:</strong> Keep PR discussions strictly technical and respectful.</li>
        </ul>
      </section>
    </>
  );
}
