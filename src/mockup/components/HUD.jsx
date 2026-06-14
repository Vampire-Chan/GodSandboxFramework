/**
 * HUD.jsx - Main Viewport Overlay
 * 
 * PORTING NOTES FOR UNREAL ENGINE / SLATE:
 * - The root of this file corresponds to an `SOverlay` which sits on top of the game viewport.
 * - The components within (EquipmentHud, ContextInfo, etc.) are positioned using `SOverlay::Slot` padding and alignment.
 * - React handles re-rendering when state (e.g., ammo count) changes. In Unreal Engine, use delegates (event-driven) instead of ticking/polling where possible.
 * - Flexbox layouts translate to nested `SHorizontalBox` and `SVerticalBox`.
 */
import { useState, useEffect } from "react";
import ObjectivePill from "./ObjectivePill";
import { ContextInfo } from "./hud/ContextInfo";
import { EquipmentHud } from "./hud/EquipmentHud";
import { HelpBox } from "./hud/HelpBox";
import { NotificationList } from "./hud/NotificationList";
import { WantedStars } from "./hud/WantedStars";
import { Radar } from "./hud/Radar";
import { Crosshair } from "./hud/Crosshair";
import { NpcOverhead } from "./hud/NpcOverhead";
import { InteractionPrompt } from "./hud/InteractionPrompt";
import { Subtitle } from "./hud/Subtitle";
import { MobileControls } from "./hud/MobileControls";


// Dark Gold RPG palette — mirrors CSS custom properties in themes.css.
// When porting to Slate, use FLinearColor constructed from these hex values.
const C = {
  bg:         "#06050a",  panel:      "#0c0a12",  panelAlt:  "#100d18",
  card:       "#15121e",  cardHover:  "#1e1a2a",  line:      "#26203a",
  line2:      "#342c4a",  accent:     "#d4a535",  accentDim: "#7a5c18",
  accentPale: "rgba(212,165,53,0.09)",
  accentGlow: "rgba(212,165,53,0.22)",
  accentBright: "#f0c84a",
  text:       "#c4bcd0",  textDim:    "#5a5068",  textBright:"#ece4f8",
  textMuted:  "#2e2640",  red:        "#8a1c1c",  green:     "#1e6b3a",
  blue:       "#2c7aab",  gray:       "#5a5068",  gold:      "#d4a535",
  bgOverlay:  "rgba(12,10,18,0.88)",
  crimson:    "#8a1c1c",  crimsonLit: "#c43030",
  greenText:  "#3a9660",  yellowText: "#d4a428",
};

const HELP_TIPS = [
  { key: "TAB", action: "Open Editor" },
  { key: "ESC", action: "Pause Menu" },
  { key: "F1", action: "Toggle Help" },
  { key: "F2", action: "Cycle HUD Context" },
  { key: "F3", action: "Toggle Equipment" },
  { key: "F4", action: "Toggle Objective" },
  { key: "N", action: "Spawn Notification" },
  { key: "D", action: "Spawn Dialogue Box" },
  { key: "I", action: "Trigger Dialogue" }
];

export default function HUD({ onAction, onDialogueTest, suppressed, uiLayout = "desktop" }) {
  const [notifications, setNotifications] = useState([]);
  const [helpVisible, setHelpVisible] = useState(true);
  const [equipVisible, setEquipVisible] = useState(true);
  const [objective, setObjective] = useState({ title: "Locate the Missing Data Drive", distance: "1.2 km" });
  
  // 0: All, 1: Health/Armor, 2: Health Only
  const [contextMode, setContextMode] = useState(0); 

  // Final Visibility Gates (Suppressed by Interaction Menu)
  const showNotifications = !suppressed;
  const showHelp = helpVisible && !suppressed;  
  // Context states
  const [areaContext, setAreaContext] = useState({ type: 'location', name: 'Downtown District' });
  const [interaction, setInteraction] = useState({ audible: true, key: "E", text: "Speak to Informant" });
  const [subtitle, setSubtitle] = useState("");
  const [npcText, setNpcText] = useState({ text: "Psst! Come here.", x: "65%", y: "40%" });

  // Lifted Weapon state to allow interactive shooting/reloading on mobile
  const [weapons, setWeapons] = useState([
    { id: "unarmed", icon: "✊", currentAmmo: 0, maxAmmo: 0, type: "Melee", label: "FIST", bulletType: "MELEE" },
    { id: "knife", icon: "🔪", currentAmmo: 0, maxAmmo: 0, type: "Melee", label: "KNIFE", bulletType: "BLADE" },
    { id: "pistol", icon: "🔫", currentAmmo: 15, maxAmmo: 45, type: "9mm", label: "PISTOL", bulletType: "9x19MM" },
    { id: "smg", icon: "🔫", currentAmmo: 30, maxAmmo: 90, type: ".45 ACP", label: "SMG", bulletType: ".45ACP" },
    { id: "rifle", icon: "︻╦╤─", currentAmmo: 30, maxAmmo: 120, type: "5.56mm", label: "ASSAULT RIFLE M4", bulletType: "5.56MM" }
  ]);
  const [activeSlot, setActiveSlot] = useState(4); // Default to rifle (index 4)
  const [isReloading, setIsReloading] = useState(false);
  const [scrollIndex, setScrollIndex] = useState(2); // Scroll window start index (default fits 2, 3, 4)

  // Character movement/combat states for touch overlays
  const [isAiming, setIsAiming] = useState(false);
  const [recoilActive, setRecoilActive] = useState(false);
  const [movementState, setMovementState] = useState("idle"); // "idle", "walking", "running", "crouched", "prone"

  // Simulate incoming notifications
  useEffect(() => {
    const notifs = [
      { id: Date.now(), text: "Picked up 9mm Ammo", type: "item" },
      { id: Date.now()+1, text: "Mission Objective Updated", type: "quest" },
      { id: Date.now()+2, text: "Bounty Increased +$500", type: "bounty" }
    ];

    let t1 = setTimeout(() => addNotif(notifs[0]), 2000);
    let t2 = setTimeout(() => addNotif(notifs[1]), 5000);
    let t3 = setTimeout(() => addNotif(notifs[2]), 9000);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const removeNotif = (id) => {
    setNotifications((prev) => prev.map(n => n.id === id ? { ...n, isRemoving: true } : n));
    setTimeout(() => {
      setNotifications((prev) => prev.filter(n => n.id !== id));
    }, 400); // 400ms to allow exit animation
  };

  const addNotif = (n) => {
    setNotifications((prev) => {
      const active = prev.filter(x => !x.isRemoving);
      const maxNotifs = 8; // Increased max capacity since we use full column height
      let newList = [n, ...prev];
      if (active.length >= maxNotifs) {
        // Tag the oldest active notification for removal
        const oldestActive = active[active.length - 1];
        newList = newList.map(x => x.id === oldestActive.id ? { ...x, isRemoving: true } : x);
      }
      return newList;
    });
    
    // Auto remove after 6s
    setTimeout(() => {
      removeNotif(n.id);
    }, 6000);
  };

  const handleTestNotif = () => {
    const templates = [
      { type: "item", title: "", text: "Picked up Heavy Ammo x40", icon: "📦" },
      { type: "quest", title: "OBJECTIVE UPDATED", text: "Investigate the distress signal. It might be a trap or a survivor.", icon: "⌖" },
      { type: "bounty", title: "BOUNTY INCREASED", text: "+$500 for property damage.", icon: "☠" },
      { type: "alert", title: "WARNING", text: "Weapon Durability critically low.", icon: "⚠" },
      { type: "system", title: "SYSTEM", text: "Progress Saved.", icon: "💾" },
      { type: "quest", title: "MISSION FAILED", text: "The target escaped the sector. Return to base.", icon: "✕" },
      { type: "alert", title: "CRITICAL COMMAND OVERRIDE", text: "The syndicate has mobilized their entire fleet against your sector. All planetary defenses are offline. You must reactivate the shield generators located at coordinates [X: 145, Y: 290] before the invasion fleet arrives in exactly T-minus 10 minutes. Failure means total destruction of the outpost.", icon: "☢" }
    ];
    const rIdx = Math.floor(Math.random() * templates.length);
    const tmpl = templates[rIdx];
    addNotif({ id: Date.now(), ...tmpl });
  };

  // Firing action
  const handleShoot = () => {
    const activeWep = weapons[activeSlot];
    if (activeWep.maxAmmo === 0) return; // Melee weapons do not consume ammo
    if (isReloading) return;
    if (activeWep.currentAmmo <= 0) {
      handleReload();
      return;
    }

    setRecoilActive(true);
    setWeapons(prev => prev.map((w, idx) => {
      if (idx === activeSlot) {
        return { ...w, currentAmmo: w.currentAmmo - 1 };
      }
      return w;
    }));

    setTimeout(() => {
      setRecoilActive(false);
    }, 80);
  };

  // Reload action
  const handleReload = () => {
    const activeWep = weapons[activeSlot];
    if (activeWep.maxAmmo === 0 || activeWep.currentAmmo === activeWep.maxAmmo || isReloading) return;

    setIsReloading(true);
    setTimeout(() => {
      setWeapons(prev => prev.map((w, idx) => {
        if (idx === activeSlot) {
          return { ...w, currentAmmo: w.maxAmmo };
        }
        return w;
      }));
      setIsReloading(false);
    }, 1200);
  };

  const handleSelectSlot = (idx) => {
    setActiveSlot(idx);
  };

  const handleScrollLeft = () => {
    setScrollIndex(prev => Math.max(0, prev - 1));
  };

  const handleScrollRight = () => {
    setScrollIndex(prev => Math.min(2, prev + 1));
  };

  const handleAim = () => {
    setIsAiming(prev => !prev);
  };

  const handleJump = () => {
    const prev = movementState;
    setMovementState("jumping");
    setTimeout(() => {
      setMovementState(prev);
    }, 800);
  };

  const handleCrouch = () => {
    setMovementState(prev => prev === "crouched" ? "idle" : "crouched");
  };

  const handleProne = () => {
    setMovementState(prev => prev === "prone" ? "idle" : "prone");
  };

  const handlePullPhone = () => {
    onAction("toggle_phone");
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Tab") { e.preventDefault(); onAction("open_editor"); }
      if (e.key === "Escape") onAction("open_pause");
      if (e.key === "F1") { e.preventDefault(); setHelpVisible(v => !v); }
      if (e.key === "F2") { e.preventDefault(); setContextMode(m => (m + 1) % 3); }
      if (e.key === "F3") { e.preventDefault(); setEquipVisible(v => !v); }
      if (e.key === "F4") { e.preventDefault(); setObjective(o => o ? null : { title: "Locate the Missing Data Drive", distance: "1.2 km" }); }
      if (e.key.toLowerCase() === "n") { e.preventDefault(); handleTestNotif(); }
      if (e.key.toLowerCase() === "d") { e.preventDefault(); if (onDialogueTest) onDialogueTest(); }
      if (e.key.toLowerCase() === "r") { e.preventDefault(); handleReload(); }
      
      // Simulate interactions and dialogues
      if (e.key.toLowerCase() === "i") {
         e.preventDefault();
         setInteraction(null);
         
         // In-world NPC Text
         setNpcText({ text: "Hey! Over here!", x: "60%", y: "45%" });
         
         // Cinematic Subtitle
         setSubtitle("Look, I don't know who you are, but you're stepping on some very big toes.");
         setTimeout(() => {
            setNpcText(null);
            setSubtitle("The syndicate isn't going to let this go. You need to zero your tracks and disappear.");
         }, 4000);
         setTimeout(() => {
            setSubtitle("");
            setInteraction({ audible: false, key: "F", text: "Enter Vehicle" });
         }, 8000);
      }
      
      // Simulate context change for testing
      if (e.key.toLowerCase() === "c") {
        setAreaContext(prev => prev.type === 'location' 
          ? { type: 'vehicle', name: 'Toyota Innova' } 
          : { type: 'location', name: 'Chinatown' });
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onAction, activeSlot, weapons, isReloading]);

  // Radar Ring Logic
  const allStats = [
    { id: 'health', val: 85, color: C.green },
    { id: 'armor', val: 60, color: C.gray },
    { id: 'stamina', val: 90, color: C.blue },
    { id: 'mana', val: 40, color: '#9b59b6' } // purple
  ];

  const activeStats = contextMode === 0 ? allStats 
                    : contextMode === 1 ? allStats.slice(0, 2)
                    : allStats.slice(0, 1);

  const radius = 86;
  const circumference = 2 * Math.PI * radius;
  const N = activeStats.length;
  const gap = N > 1 ? 16 : 0;
  const maxArcLen = (circumference / N) - gap;

  const isPhone = uiLayout === "phone";

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", fontFamily: "'Rajdhani', sans-serif" }}>
      
      {/* Top Left: Help Box & Notifications */}
      <div style={{ position: "absolute", top: "20px", left: "20px", bottom: "240px", width: "320px", display: "flex", flexDirection: "column", gap: "10px", pointerEvents: "none" }}>
        <HelpBox showHelp={showHelp} tips={HELP_TIPS} colors={C} onTestNotif={handleTestNotif} />
        <NotificationList showNotifications={showNotifications} notifications={notifications} colors={C} />
      </div>

      {/* Top Center: Objective Pill */}
      <ObjectivePill objective={objective} areaContext={areaContext} uiLayout={uiLayout} />

      {/* Top Right: Money, Bounty, Wanted */}
      <WantedStars wantedLevel={3} balance="$14,250" bounty="$5,000" colors={C} uiLayout={uiLayout} />

      {/* Center Crosshair */}
      <Crosshair opacity={0.6} isAiming={isAiming} recoilActive={recoilActive} />

      {/* Bottom Left: Radar and Icons */}
      <Radar activeStats={activeStats} colors={C} radius={radius} circumference={circumference} maxArcLen={maxArcLen} uiLayout={uiLayout} />

      {/* Bottom Layout / Equipment Elements */}
      {!isPhone ? (
        /* Desktop Layout: Stacked bottom-right */
        <div style={{ position: "absolute", bottom: "30px", right: "30px", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "12px" }}>
          <ContextInfo type={areaContext.type} name={areaContext.name} equipVisible={equipVisible} />
          <EquipmentHud 
            weaponName="ASSAULT RIFLE M4" 
            ammoType="5.56x45mm NATO" 
            currentAmmo={30} 
            maxAmmo={120} 
            visible={equipVisible} 
            uiLayout={uiLayout} 
            weapons={weapons}
            activeSlot={activeSlot}
            isReloading={isReloading}
            scrollIndex={scrollIndex}
            onSelectSlot={handleSelectSlot}
            onScrollLeft={handleScrollLeft}
            onScrollRight={handleScrollRight}
            onReload={handleReload}
          />
        </div>
      ) : (
        /* Phone Layout: Separated to balance screen layout. ContextInfo bottom-left is hidden entirely on Phone. */
        <>
          {/* Weapon Slot Widget centered at bottom */}
          <div style={{ position: "absolute", bottom: "20px", left: "50%", transform: "translateX(-50%)" }}>
            <EquipmentHud 
              weaponName="ASSAULT RIFLE M4" 
              ammoType="5.56x45mm NATO" 
              currentAmmo={30} 
              maxAmmo={120} 
              visible={equipVisible} 
              uiLayout={uiLayout} 
              weapons={weapons}
              activeSlot={activeSlot}
              isReloading={isReloading}
              scrollIndex={scrollIndex}
              onSelectSlot={handleSelectSlot}
              onScrollLeft={handleScrollLeft}
              onScrollRight={handleScrollRight}
              onReload={handleReload}
            />
          </div>
        </>
      )}

      {/* Phone Touch Controls Layer */}
      {isPhone && (
        <MobileControls 
          onShoot={handleShoot}
          onAim={handleAim}
          onReload={handleReload}
          onJump={handleJump}
          onCrouch={handleCrouch}
          onProne={handleProne}
          onPullPhone={handlePullPhone}
          isAiming={isAiming}
          movementState={movementState}
        />
      )}

      {/* NPC Overhead Text - Viewport Projected */}
      <NpcOverhead npcText={npcText} colors={C} />

      {/* Interaction Prompts - Center Bottom (Above Subtitles) */}
      <InteractionPrompt interaction={interaction} colors={C} />

      {/* Cinematic Subtitles - Bottom Center */}
      <Subtitle subtitle={subtitle} />

    </div>
  );
}
