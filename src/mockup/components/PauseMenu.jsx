/**
 * PauseMenu.jsx - In-Game Pause Overlay
 * 
 * PORTING NOTES FOR UNREAL ENGINE / SLATE:
 * - Usually instantiated dynamically when the input action "Pause" is triggered.
 * - This widget must set `bIsFocusable = true` and lock the game input mode (`FInputModeUIOnly`).
 * - Background blurring uses `SBackgroundBlur`.
 * - Returning to game simply means removing this widget from parent and restoring input mode `FInputModeGameOnly`.
 */
import { useState } from "react";
import Mods from "./Mods";
import SettingsPanel, { ControlsBindingEditor } from "./SettingsPanel";
import { Button } from "./common/Button";
import { MenuSidebar } from "./common/MenuSidebar";
import { TabCharacter } from "./pause/TabCharacter";
import { TabQuit } from "./pause/TabQuit";
import "./components.css";

// Dark Gold RPG palette — mirrors CSS custom properties in themes.css.
const C = {
  bg:         "#06050a",  panel:      "#0c0a12",  panelAlt:  "#100d18",
  card:       "#15121e",  cardHover:  "#1e1a2a",  line:      "#26203a",
  line2:      "#342c4a",  accent:     "#d4a535",  accentDim: "#7a5c18",
  accentPale: "rgba(212,165,53,0.09)",
  accentGlow: "rgba(212,165,53,0.22)",
  text:       "#c4bcd0",  textDim:    "#5a5068",  textBright:"#ece4f8",
  textMuted:  "#2e2640",  red:        "#8a1c1c",  redPale:   "rgba(138,28,28,0.14)",
  green:      "#1e6b3a",  greenPale:  "rgba(30,107,58,0.12)",  greenText: "#3a9660",
  yellow:     "#b8880a",  yellowPale: "rgba(184,136,10,0.12)", yellowText: "#d4a428",
  white:      "#ece8f8",  crimson:    "#8a1c1c",  crimsonLit: "#c43030",
};

const PLAYER = {
  name: "Viktor Dren", alias: "V.DREN", profession: "Street Medic",
  rank: "Competent", cash: "$4,820", playtime: "61h 14m",
  deathWeight: 2.75, deathThreshold: 5.0, nomad: false,
  titles: ["The Rat", "Ironside"], location: "Millhaven · Sector 01",
  serverTime: "03:41", combatStats: { Pistols: 72, Shotguns: 34, RifleAuto: 18, BladeLong: 55, BladeShort: 61, Thrown: 22 },
};

const QUALITY_OPTS = ["Low", "Medium", "High", "Ultra"];

const NAV = [
  { id: "character", icon: "◈", label: "Character" },
  { id: "settings",  icon: "⊙", label: "Settings" },
  { id: "controls",  icon: "⊞", label: "Controls" },
  { id: "mods",      icon: "⊚", label: "Mods" },
  { id: "quit",      icon: "⊘", label: "Quit" },
];

const SETTINGS_ITEMS = [
  { id: "audio", label: "Audio", icon: "♪" },
  { id: "video", label: "Video", icon: "⊡" },
  { id: "controls", label: "Controls", icon: "⊞" },
  { id: "gameplay", label: "Gameplay", icon: "⚙" },
  { id: "accessibility", label: "Accessibility", icon: "◎" },
];

function tier(val) {
  if (val < 20) return { label: "Untrained", color: C.textMuted };
  if (val < 40) return { label: "Novice",    color: C.textDim };
  if (val < 60) return { label: "Competent", color: C.text };
  if (val < 80) return { label: "Skilled",   color: C.yellowText };
  if (val < 95) return { label: "Expert",    color: C.accent };
  return              { label: "Master",     color: "#e080c0" };
}

function barColor(val) {
  if (val < 40) return C.textMuted;
  if (val < 70) return C.yellow;
  return C.accent;
}

export default function PauseMenu({ onResume, onQuit }) {
  const [tab, setTab] = useState("character");
  const [settingsTab, setSettingsTab] = useState("audio");
  const [notif, setNotif] = useState(null);
  const [notifKey, setNotifKey] = useState(0);
  const [expandedMenu, setExpandedMenu] = useState(null);

  const [gfxOverall, setGfxOverall]     = useState("High");
  const [shadows, setShadows]           = useState("High");
  const [postProcess, setPostProcess]   = useState("Medium");
  const [masterVol, setMasterVol]       = useState(80);
  const [musicVol, setMusicVol]         = useState(55);
  const [sfxVol, setSfxVol]             = useState(75);
  const [voiceVol, setVoiceVol]         = useState(72);
  const [chatVol, setChatVol]           = useState(65);
  const [vsync, setVsync]               = useState(true);
  const [motionBlur, setMotionBlur]     = useState(false);
  const [subtitles, setSubtitles]       = useState(true);
  const [hints, setHints]               = useState(true);
  const [invertY, setInvertY]           = useState(false);
  const [holdToAim, setHoldToAim]       = useState(false);
  const [autoReload, setAutoReload]     = useState(true);
  const [aimAssist, setAimAssist]       = useState(true);
  const [controllerVibration, setControllerVibration] = useState(true);
  const [colorBlindMode, setColorBlindMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [uiScale, setUiScale]           = useState(100);
  const [fov, setFov]                   = useState(90);
  const dwPct = (PLAYER.deathWeight / PLAYER.deathThreshold) * 100;
  const dwColor = dwPct > 70 ? C.red : dwPct > 40 ? C.yellow : C.greenText;

  const notify = (msg) => {
    setNotif(msg);
    setNotifKey((k) => k + 1);
    setTimeout(() => setNotif(null), 2600);
  };

  const CONTENT = {
    character: { icon: "◈", title: "Character", body: <TabCharacter player={PLAYER} colors={C} tierFn={tier} barColorFn={barColor} /> },
    settings:  { icon: "⊙", title: "Settings",  body: <SettingsPanel tabs={SETTINGS_ITEMS} activeTab={settingsTab} onTabChange={setSettingsTab} /> },
    controls:  { 
      icon: "⊞", 
      title: "Controls",  
      body: (
        <ControlsBindingEditor
          title="Key Bindings · Keyboard & Mouse"
          subtitle="Click any binding, press a key, and the change updates immediately for the mockup state."
          compact
        />
      ) 
    },
    mods:      { icon: "⊚", title: "Mods",      body: <Mods /> },
    quit:      { icon: "⊘", title: "Quit",      body: <TabQuit onQuit={onQuit} notify={notify} /> },
  };

  const current = CONTENT[tab];

  // Sidebar shows blurred only when no expanded menu
  const shouldShowSidebarContent = !expandedMenu;

  return (
    <div className="pm-root">
      <div className="pm-bg" />
      <div className="city-silhouette" />
      <div className="accent-rail" />
      {notif && <div key={notifKey} className="pm-notif">✓ {notif}</div>}
      <div className="pm-shell">
        <MenuSidebar
          items={NAV}
          activeId={tab}
          onSelect={(id, idx, isConfirmed) => {
            setTab(id);
            if (id === 'mods') {
              setExpandedMenu(isConfirmed ? (expandedMenu === 'mods' ? null : 'mods') : null);
            } else {
              setExpandedMenu(null);
            }
          }}
          onEscape={onResume}
          logoTitle="JustLive"
          logoSub="— PAUSED —"
          profile={PLAYER}
          variant="pausemenu"
          showContent={shouldShowSidebarContent}
          withPanel={!!expandedMenu}
          disableKeyboardNav={!!expandedMenu}
          actionButton={<Button className="pm-resume-btn" onClick={onResume}>▶ RESUME</Button>}
        />
        <div className="pm-content">
          <div className="pm-content-header">
            <span className="pm-content-icon">{current.icon}</span><span className="pm-content-title">{current.title}</span>
            <div className="pm-server-time"><span>SERVER</span><span className="server-time-val">{PLAYER.serverTime}</span></div>
          </div>
          <div className={`pm-content-body tab-${tab}`}>{current.body}</div>
        </div>
      </div>
    </div>
  );
}
