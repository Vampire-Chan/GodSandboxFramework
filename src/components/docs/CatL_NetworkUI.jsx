// CatL_NetworkUI.jsx
// Category L: Networking & Infrastructure
import React from 'react';
import { WorkflowTabGroup, GodCodeBlock } from './docsHelpers';

export function renderPage(docId) {
  switch (docId) {

    case 'net_replication':
      return (
        <article className="doc-article">
          <header className="doc-header">
            <span className="doc-category-tag">Networking &amp; Infrastructure</span>
            <h1 className="doc-main-title">Replication &amp; Culling Boundaries</h1>
            <p className="doc-lead-para">
              JustLive utilizes optimized replication boundaries and culling properties on network channels to support high player counts in large-scale maps.
            </p>
          </header>

          <WorkflowTabGroup
            xmlContent={
              <>
                <section className="doc-section">
                  <h2 id="replication-xml">Network Culling Distances (XML)</h2>
                  <p>Configure net update rates and dynamic draw culling rules inside <code>@data/Config/NetworkSettings.xml</code>:</p>
                  <GodCodeBlock
                    language="xml"
                    code={`<!-- NetworkSettings.xml -->
<NetCullConfig>
  <CullDistance ped="15000" vehicle="25000" />
  <UpdateRate min="5" max="60" />
</NetCullConfig>`}
                  />
                </section>
              </>
            }
            bpContent={
              <>
                <section className="doc-section">
                  <h2 id="replication-bp">Blueprint Network Gateways</h2>
                  <p>
                    Ensure variables that require synchronisation are marked as **Replicated** or **ReplicatedUsing** with a notify callback. Avoid running heavy ticks on client proxies.
                  </p>
                </section>
              </>
            }
            cCodeContent={
              <>
                <section className="doc-section">
                  <h2 id="replication-sdk">Event Cause Log &amp; RPCs (SDK)</h2>
                  <p>
                    The C++ class <a href="file:///d:/Unreal%20Projects/JustLive/Source/JustLive/Core/Networking/OnlineManager.h" style={{ fontFamily: 'monospace', color: 'var(--accent)', fontWeight: 'bold' }}>UOnlineManager</a> coordinates session hosting, search lists, and lobbies.
                  </p>
                  <p>
                    Replication parameters dynamically scale updates based on actor distance. Broadcast events route via NetMulticast RPCs:
                  </p>
                  <GodCodeBlock
                    language="cpp"
                    code={`// Broadcast server changes to client proxies
if (HasAuthority())
{
    Multicast_NotifyEventCause(EventPayload);
}`}
                  />
                </section>
              </>
            }
          />
        </article>
      );

    case 'net_eos':
      return (
        <article className="doc-article">
          <header className="doc-header">
            <span className="doc-category-tag">Networking &amp; Infrastructure</span>
            <h1 className="doc-main-title">EOS Integration &amp; Title Files</h1>
            <p className="doc-lead-para">
              Integrated with Epic Online Services (EOS) for player authentication, lobbies, matchmaking sessions, and remote title storage retrieval.
            </p>
          </header>

          <WorkflowTabGroup
            xmlContent={
              <>
                <section className="doc-section">
                  <h2 id="eos-xml">EOS Settings (XML)</h2>
                  <p>Configure credentials and authentication scopes in <code>@data/Config/EOSSettings.xml</code>:</p>
                  <GodCodeBlock
                    language="xml"
                    code={`<!-- EOSSettings.xml -->
<EOSConfig>
  <Product id="Prod_ID_Hash" secret="Client_Sec_Hash" />
  <AuthScope permissions="BasicProfile,FriendsList" />
</EOSConfig>`}
                  />
                </section>
              </>
            }
            bpContent={
              <>
                <section className="doc-section">
                  <h2 id="eos-bp">Matchmaking Lobbies</h2>
                  <p>
                    HUD widgets call session host and join routines. Match results display in UI lists where players click to join.
                  </p>
                </section>
              </>
            }
            cCodeContent={
              <>
                <section className="doc-section">
                  <h2 id="eos-sdk">EOS Authentication &amp; Sessions (C++)</h2>
                  <p>
                    <code>UOnlineManager</code> utilizes the standard <code>IOnlineSubsystem</code> interfaces (Identity, Session, TitleFile) to authenticate the client and pull remote configuration files:
                  </p>
                  <GodCodeBlock
                    language="cpp"
                    code={`// Request user login via the identity interface
void UOnlineManager::LoginUser()
{
    if (IdentityInterface.IsValid())
    {
        FOnlineAccountCredentials Credentials;
        Credentials.Type = TEXT("accountportal");
        IdentityInterface->Login(0, Credentials);
    }
}

// Fetch encrypted master VFS key from EOS Title Storage
void UOnlineManager::FetchMasterKeyFromEOS()
{
    if (TitleFileInterface.IsValid())
    {
        TitleFileInterface->ReadFile(TEXT("vfs_master_key.bin"));
    }
}`}
                  />
                </section>
              </>
            }
          />
        </article>
      );

    case 'ui_slate':
      return (
        <article className="doc-article">
          <header className="doc-header">
            <span className="doc-category-tag">Networking &amp; Infrastructure</span>
            <h1 className="doc-main-title">Programmatic Slate HUD &amp; Runtime UI</h1>
            <p className="doc-lead-para">
              The user interface in JustLive is constructed programmatically in pure Slate for ultimate performance, coordinated by UUIManager and URuntimeUIManager.
            </p>
          </header>

          <section className="doc-section">
            <h2 id="ui-slate-philosophy">Decoupled UI Architecture</h2>
            <p>
              By default, the engine loads menus, logos, and HUD elements from the <code>GodUIFramework</code> Slate plugin, completely bypassing Blueprint ticking overhead.
            </p>
            <div className="doc-alert warning">
              <div className="alert-header">DISABLING BUILT-IN UI FOR STANDALONE DEV</div>
              <div className="alert-body">
                If you are a standalone developer wanting to build your own menus (using standard UMG Blueprints), go to your custom GameMode (inherited from <a href="file:///d:/Unreal%20Projects/JustLive/Source/JustLive/Core/SandboxGameMode.h" style={{ fontFamily: 'monospace', color: 'var(--accent)', fontWeight: 'bold' }}>ASandboxGameMode</a>) and check the <strong>Disable Built In UI</strong> flag. The engine will skip spawning the built-in logo screens and Slate HUD overlay.
              </div>
            </div>
          </section>

          <WorkflowTabGroup
            xmlContent={
              <>
                <section className="doc-section">
                  <h2 id="ui-layout-xml">HUD Layout Styling (XML)</h2>
                  <p>Adjust visual parameters of HUD bars and crosshair textures in <code>@data/UI/HUDLayout.xml</code>:</p>
                  <GodCodeBlock
                    language="xml"
                    code={`<!-- HUDLayout.xml -->
<HUDStyle>
  <Radar scale="1.0" opacity="0.85" screenPosition="BottomLeft" />
  <HealthBar color="46, 138, 82" pulseOnLow="true" />
  <Crosshair style="BracketDot" size="32.0" gap="4.0" />
</HUDStyle>`}
                  />
                </section>
              </>
            }
            bpContent={
              <>
                <section className="doc-section">
                  <h2 id="ui-slate-bp">Blueprint Custom Screens</h2>
                  <p>
                    Check the <strong>bSkipMainMenuFlow</strong> box inside the UUIManager configurations to jump straight to testing levels. Bind standard HUD layout properties to custom visual gauges.
                  </p>
                </section>
              </>
            }
            cCodeContent={
              <>
                <section className="doc-section">
                  <h2 id="ui-slate-sdk">Slate Construction &amp; Runtime Menus (C++)</h2>
                  <p>
                    The C++ subsystem <a href="file:///d:/Unreal%20Projects/JustLive/Source/JustLive/UI/UIManager.h" style={{ fontFamily: 'monospace', color: 'var(--accent)', fontWeight: 'bold' }}>UUIManager</a> manages state transitions (<code>EUIState::Startup</code>, <code>MainMenu</code>, <code>Loading</code>, <code>GameHUD</code>, <code>PauseMenu</code>) using fades.
                  </p>
                  <p>
                    Programmatic container layouts construct widgets without UObject garbage collection overhead:
                  </p>
                  <GodCodeBlock
                    language="cpp"
                    code={`// Construct horizontal box slot in Slate
TSharedRef<SWidget> SMyWidget::ConstructHUD()
{
    return SNew(SHorizontalBox)
    + SHorizontalBox::Slot()
    .AutoWidth()
    [
        SNew(SBorder)
        .BorderImage(FAppStyle::GetBrush("NoBorder"))
        [
            SNew(STextBlock).Text(FText::FromString("JustLive HUD"))
        ]
    ];
}`}
                  />
                  <p>
                    To handle dynamic in-game menus (LemonUI style), the <a href="file:///d:/Unreal%20Projects/JustLive/Source/JustLive/UI/RuntimeUIManager.h" style={{ fontFamily: 'monospace', color: 'var(--accent)', fontWeight: 'bold' }}>URuntimeUIManager</a> subsystem coordinates input intercepts and spawns 3D rendering studios:
                  </p>
                  <GodCodeBlock
                    language="cpp"
                    code={`// Create a menu container dynamically and push it to focus
FUIHandle Menu = URuntimeUIManager::Get(this)->CreateMenu(Config);
URuntimeUIManager::Get(this)->AddMenuItem(Menu, Item);
URuntimeUIManager::Get(this)->PushMenu(Menu);

// Spawn a 3D Capture studio to render peds/items inside UI
AUICaptureStudio* Studio = URuntimeUIManager::Get(this)->SpawnCaptureStudio(TargetPed);`}
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
    case 'net_replication':
      return (
        <>
          <li><a href="#replication-xml">Network Culling Distances</a></li>
          <li><a href="#replication-sdk">Event Cause Log &amp; RPCs</a></li>
        </>
      );
    case 'net_eos':
      return (
        <>
          <li><a href="#eos-xml">EOS Settings XML</a></li>
          <li><a href="#eos-sdk">EOS Authentication &amp; Sessions</a></li>
        </>
      );
    case 'ui_slate':
      return (
        <>
          <li><a href="#ui-slate-philosophy">Decoupled UI Architecture</a></li>
          <li><a href="#ui-layout-xml">HUD Layout Styling XML</a></li>
          <li><a href="#ui-slate-sdk">Slate &amp; Runtime Menus (C++)</a></li>
        </>
      );
    default: return null;
  }
}
