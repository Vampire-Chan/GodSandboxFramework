/**
 * MainMenu.jsx - Application Entry Point UI
 *
 * PORTING NOTES FOR UNREAL ENGINE / SLATE:
 * - The sidebar maps to an SVerticalBox fixed at 280px width.
 * - RIGHT PANEL — REALTIME SCENE:
 *     When no sub-panel is open, the right area renders the LIVE GAME WORLD directly.
 *     In Unreal, this is achieved via:
 *       1. A dedicated SceneCapture2D Actor placed in the "MenuWorld" level.
 *       2. Its output targets a UTextureRenderTarget2D.
 *       3. The render target is bound to an FSlateBrush via FSlateImageBrush.
 *       4. SImage widget uses that brush — it updates every frame with the live scene.
 *     The player character stands idle in the world (menu-specific AnimBP state).
 *     Camera angle is configured per-level in the MenuCameraActor blueprint.
 *     Fog, lighting, and atmospheric effects are fully Lumen-rendered in real time.
 * - Sub-panels (Settings, Mods) slide over the scene with a frosted glass overlay,
 *   partially revealing the live scene at the edges.
 * - The scene continues rendering behind the panels (no freeze/pause during menu).
 */
import { useState } from "react";
import Mods from "./Mods";
import SettingsPanel from "./SettingsPanel";
import { Button } from "./common/Button";
import { MenuSidebar } from "./common/MenuSidebar";
import "./components.css";

const MENU_ITEMS = [
  { id: "continue", label: "CONTINUE",       sub: "RESUME SECTOR 01",         icon: "▶" },
  { id: "new",      label: "NEW GAME",        sub: "START FRESH",              icon: "⊕" },
  { id: "load",     label: "LOAD GAME",       sub: "RESTORE PREVIOUS STATE",   icon: "⊂" },
  { id: "mods",     label: "MODS",            sub: "MANAGE GAME VARIANTS",     icon: "⊚" },
  { id: "settings", label: "SETTINGS",        sub: "AUDIO · VIDEO · CONTROLS", icon: "⊙" },
  { id: "quit",     label: "QUIT TO DESKTOP", sub: "",                         icon: "⊘" },
];

const SETTINGS_ITEMS = [
  { id: "audio",         label: "Audio",         icon: "♪" },
  { id: "video",         label: "Video",         icon: "⊡" },
  { id: "controls",      label: "Controls",      icon: "⊞" },
  { id: "gameplay",      label: "Gameplay",      icon: "⚙" },
  { id: "accessibility", label: "Accessibility", icon: "◎" },
];

const PROFILE = {
  name:           "Viktor Dren",
  profession:     "Street Medic",
  location:       "Millhaven · Sector 01",
  status:         ["Online", "Rank: Competent"],
  deathWeight:    2.75,
  deathThreshold: 5.0,
  titles:         ["The Rat", "Ironside"],
};

// Simulated "live scene" placeholder. In Unreal this is an FSlateBrush pointing at
// UTextureRenderTarget2D updated each frame by SceneCapture2D in the MenuWorld level.
function LiveSceneViewport() {
  return (
    <div style={{
      position: "relative",
      width: "100%", height: "100%",
      overflow: "hidden",
      // Placeholder for the real-time SceneCapture render target
      background: `
        radial-gradient(ellipse 70% 90% at 65% 55%, rgba(30, 22, 55, 0.9) 0%, transparent 65%),
        radial-gradient(ellipse 50% 60% at 30% 80%, rgba(10, 8, 18, 0.95) 0%, transparent 60%),
        radial-gradient(ellipse 40% 40% at 80% 20%, rgba(50, 30, 80, 0.3) 0%, transparent 55%),
        linear-gradient(160deg, #080610 0%, #0e0c1c 35%, #0a0816 65%, #06050a 100%)
      `,
    }}>
      {/* Subtle atmospheric glow representing city lights in the scene */}
      <div style={{
        position: "absolute",
        bottom: "10%", left: "15%", right: "15%",
        height: "35%",
        background: `
          radial-gradient(ellipse 80% 60% at 50% 100%,
            rgba(212,165,53,0.06) 0%,
            rgba(180,100,50,0.04) 40%,
            transparent 70%
          )
        `,
        pointerEvents: "none",
      }} />

      {/* Vignette edges */}
      <div style={{
        position: "absolute", inset: 0,
        background: `
          radial-gradient(ellipse 100% 100% at 50% 50%,
            transparent 55%,
            rgba(6,5,10,0.6) 85%,
            rgba(6,5,10,0.9) 100%
          )
        `,
        pointerEvents: "none",
      }} />

      {/* Scene info badge — top-right corner */}
      <div style={{
        position: "absolute",
        top: "20px", right: "20px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "6px 14px",
        background: "rgba(6,5,10,0.65)",
        border: "1px solid rgba(212,165,53,0.15)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}>
        {/* Live indicator dot */}
        <span style={{
          display: "inline-block",
          width: "5px", height: "5px",
          borderRadius: "50%",
          background: "#3a9660",
          boxShadow: "0 0 6px #3a966080",
          animation: "pulse 2s ease-in-out infinite",
          flexShrink: 0,
        }} />
        <span style={{
          fontFamily: "var(--font-mono)",
          fontSize: "9px",
          color: "rgba(236,228,248,0.5)",
          letterSpacing: "1.5px",
          textTransform: "uppercase",
        }}>LIVE · MILLHAVEN SECTOR 01</span>
      </div>

      {/*
       * ── SLATE PORTING NOTE ──────────────────────────────────────────────────
       * Replace this entire LiveSceneViewport component with:
       *
       *   SNew(SImage)
       *   .Image(TAttribute<const FSlateBrush*>::CreateLambda([this]()
       *   {
       *       // MenuRTBrush is updated each frame via SceneCapture2D
       *       // bound to the MenuWorld's dedicated capture actor.
       *       return MenuRTBrush.IsValid() ? MenuRTBrush.Get() : FAppStyle::GetBrush("WhiteBrush");
       *   }))
       *   .ColorAndOpacity(FLinearColor::White)
       *
       * The SceneCapture2D should be configured in the MenuWorld level:
       *   - Capture source: Final Color (HDR)
       *   - Projection: Perspective, 70-80° FOV
       *   - Texture target: RT_MenuScene (1920×1080 or native res ÷ 2 for perf)
       *   - Update mode: Always (realtime)
       *   - Camera position: slightly behind/above player character idle pose
       *
       * DOF/Motion Blur should be ON in the capture for premium feel.
       * ────────────────────────────────────────────────────────────────────────
       */}

      {/* Center watermark — visible when no sub-panel open */}
      <div style={{
        position: "absolute",
        bottom: "22px", left: "22px",
        fontFamily: "var(--font-mono)",
        fontSize: "9px",
        color: "rgba(212,165,53,0.25)",
        letterSpacing: "2px",
        textTransform: "uppercase",
        pointerEvents: "none",
      }}>
        SCENE · REALTIME · UE5.7 LUMEN
      </div>
    </div>
  );
}

export default function MainMenu({ onAction }) {
  const [selected,     setSelected]     = useState(0);
  const [openSection,  setOpenSection]  = useState(null);
  const [settingsTab,  setSettingsTab]  = useState("audio");

  return (
    <div className="mm-root">
      <div className="mm-bg" />
      <div className="city-silhouette" />
      <div className="accent-rail" />

      <div className={`mm-shell ${openSection ? "has-panel" : ""}`}>

        {/* ── SIDEBAR ──────────────────────────────────────────────────────── */}
        <MenuSidebar
          items={MENU_ITEMS}
          activeId={MENU_ITEMS[selected]?.id}
          onSelect={(id, idx, isConfirmed) => {
            setSelected(idx);
            if (isConfirmed) {
              if (["continue", "new", "load", "quit"].includes(id)) {
                onAction(id);
              } else if (id === "mods" || id === "settings") {
                setOpenSection(id);
              }
            }
          }}
          onEscape={() => setOpenSection(null)}
          logoTitle="JUSTLIVE"
          logoSub="— MAIN MENU —"
          profile={PROFILE}
          variant="mainmenu"
          showContent={true}
          withPanel={!!openSection}
          disableKeyboardNav={!!openSection}
          footer={
            <div className="mm-footer" style={{ padding: "0 18px 14px", borderTop: "none" }}>
              <div className="mm-footer-label">BUILD</div>
              <div className="mm-footer-version">5.7.0X-JL-WIN64</div>
              <div className="mm-footer-build">v0.8.21</div>
            </div>
          }
        />

        {/* ── RIGHT CONTENT AREA ──────────────────────────────────────────── */}
        {/* When no sub-section is open, show the live scene viewport.
            When a sub-section is open, the panel slides on top of the scene
            (scene continues rendering beneath via SceneCapture2D in Unreal). */}

        {!openSection ? (
          /* LIVE SCENE — real-time game world rendered behind the menu UI */
          <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
            <LiveSceneViewport />
          </div>
        ) : openSection === "mods" ? (
          /* MODS PANEL — slides in from right, covers scene */
          <div className="mm-panel" style={{
            flex: 1,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}>
            <Mods />
          </div>
        ) : openSection === "settings" ? (
          /* SETTINGS PANEL — slides in from right, covers scene */
          <div className="mm-panel" style={{
            flex: 1,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}>
            <SettingsPanel
              tabs={SETTINGS_ITEMS}
              activeTab={settingsTab}
              onTabChange={setSettingsTab}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
