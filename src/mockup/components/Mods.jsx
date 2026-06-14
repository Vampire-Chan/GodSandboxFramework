/**
 * Mods.jsx - Mod Management UI
 * 
 * PORTING NOTES FOR UNREAL ENGINE / SLATE:
 * - This maps to an `SListView` or `STileView` populated dynamically by the `UModManager`.
 * - The `ExpandableCategory` elements map to `SExpandableArea` containing the `STileView` or `SListView`.
 * - In React, the mock data is an array of objects. In Unreal, this should be parsed from `ModManager::ScanMods()` which loads `Mods.xml` metadata.
 * - Selecting a mod triggers `onAction("open_editor")` or "PLAY". In UE, this would trigger loading the Mod's persistent level and mounting its VFS @mods prefix.
 */
import { useState } from "react";
import { ExpandableCategory } from "./common/ExpandableCategory";
import { GameOptionCard } from "./common/GameOptionCard";
import "./components.css";

// Dark Gold RPG palette — mirrors CSS custom properties in themes.css.
const C = {
  bg:         "#06050a",  panel:      "#0c0a12",  panelAlt:  "#100d18",
  card:       "#15121e",  cardHover:  "#1e1a2a",  line:      "#26203a",
  line2:      "#342c4a",  accent:     "#d4a535",  accentDim: "#7a5c18",
  accentPale: "rgba(212,165,53,0.09)",
  text:       "#c4bcd0",  textDim:    "#5a5068",  textBright:"#ece4f8",
  textMuted:  "#2e2640",  red:        "#8a1c1c",  redPale:   "rgba(138,28,28,0.14)",
  green:      "#1e6b3a",  greenPale:  "rgba(30,107,58,0.12)",  greenText: "#3a9660",
  yellow:     "#b8880a",  yellowPale: "rgba(184,136,10,0.12)",  yellowText: "#d4a428",
  white:      "#ece8f8",  blue:       "#2c7aab",  bluePale:  "rgba(44,122,171,0.12)", blueText: "#4a9ecb",
};

// Mock mod data
const STANDALONE_MODS = [
  { id: 1, name: "Base Game", version: "1.0.0", size: "48.2 GB", status: "installed", selected: true },
  { id: 2, name: "Neon Dreams", version: "2.1.0", size: "12.5 GB", status: "installed", selected: false },
  { id: 3, name: "Street Stories", version: "1.5.0", size: "8.3 GB", status: "installed", selected: false },
];

const ADDON_MODS = [
  { id: 101, name: "Enhanced Graphics Pack", version: "3.2.0", size: "2.1 GB", enabled: true, category: "Graphics" },
  { id: 102, name: "Extended Dialogue System", version: "1.8.0", size: "0.4 GB", enabled: true, category: "Gameplay" },
  { id: 103, name: "New Mission Pack Vol 1", version: "2.0.0", size: "3.2 GB", enabled: true, category: "Content" },
  { id: 104, name: "Weapon Balance Overhaul", version: "1.3.0", size: "0.25 GB", enabled: false, category: "Balance" },
  { id: 105, name: "UI Overhaul", version: "1.9.0", size: "0.18 GB", enabled: true, category: "UI" },
  { id: 106, name: "Survival Mode", version: "1.1.0", size: "0.56 GB", enabled: false, category: "Gameplay" },
];

export default function Mods() {
  const [selectedStandalone, setSelectedStandalone] = useState(1);
  const [enabledAddons, setEnabledAddons] = useState(new Set([101, 102, 103, 105]));
  const [expandedCategory, setExpandedCategory] = useState(null);

  const toggleAddon = (id) => {
    const newEnabled = new Set(enabledAddons);
    if (newEnabled.has(id)) {
      newEnabled.delete(id);
    } else {
      newEnabled.add(id);
    }
    setEnabledAddons(newEnabled);
  };

  const handlePlayStandalone = (id) => {
    const mod = STANDALONE_MODS.find((m) => m.id === id);
    console.log(`Playing: ${mod.name}`);
  };

  // Group addons by category
  const categories = {};
  ADDON_MODS.forEach((mod) => {
    if (!categories[mod.category]) {
      categories[mod.category] = [];
    }
    categories[mod.category].push(mod);
  });

  const activeAddonCount = enabledAddons.size;
  const totalAddonCount = ADDON_MODS.length;

  return (
    <div className="mods-root" style={{ minWidth: 0 }}>
      <div className="mods-header">
        <h2 className="mods-title">MOD MANAGER</h2>
        <div className="mods-stats">
          <span className="mods-stat">Standalone: 1 Selected</span>
          <span className="mods-divider">·</span>
          <span className="mods-stat">Addons: {activeAddonCount}/{totalAddonCount} Enabled</span>
        </div>
      </div>

      <div className="mods-content">
        {/* STANDALONE SECTION */}
        <div className="mods-section">
          <div className="mods-section-header">
            <h3 className="mods-section-title">STANDALONE GAMES</h3>
            <span className="mods-section-desc">Select one complete game variant</span>
          </div>

          <div className="mods-list">
            {STANDALONE_MODS.map((mod) => (
              <GameOptionCard
                key={mod.id}
                id={mod.id}
                name={mod.name}
                version={mod.version}
                size={mod.size}
                isSelected={selectedStandalone === mod.id}
                onSelect={setSelectedStandalone}
                onPlay={handlePlayStandalone}
              />
            ))}
          </div>
        </div>

        {/* ADDON SECTION */}
        <div className="mods-section">
          <div className="mods-section-header">
            <h3 className="mods-section-title">ADD-ON MODS</h3>
            <span className="mods-section-desc">Enable/disable content additions (cumulative)</span>
          </div>

          <div className="mods-list">
            {Object.entries(categories).map(([category, mods]) => (
              <ExpandableCategory
                key={category}
                title={category}
                countInfo={`${mods.filter((m) => enabledAddons.has(m.id)).length}/${mods.length}`}
              >
                {mods.map((mod) => {
                  const isEnabled = enabledAddons.has(mod.id);
                  return (
                    <div
                      key={mod.id}
                      className={`mods-item mods-item-addon ${isEnabled ? 'enabled' : 'disabled'}`}
                    >
                      <div className="mods-toggle">
                        <div
                          className={`toggle-switch ${isEnabled ? 'on' : ''}`}
                          onClick={() => toggleAddon(mod.id)}
                        >
                          <div className="toggle-knob" />
                        </div>
                      </div>

                      <div className="mods-item-info">
                        <div className="mods-item-name">{mod.name}</div>
                        <div className="mods-item-meta">
                          <span className="mods-version">v{mod.version}</span>
                          <span className="mods-separator">·</span>
                          <span className="mods-size">{mod.size}</span>
                          {isEnabled && (
                            <>
                              <span className="mods-separator">·</span>
                              <span className="mods-status-enabled">✓ ACTIVE</span>
                            </>
                          )}
                          {!isEnabled && (
                            <>
                              <span className="mods-separator">·</span>
                              <span className="mods-status-disabled">✗ INACTIVE</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </ExpandableCategory>
            ))}
          </div>
        </div>
      </div>

      <div className="mods-footer">
        <div className="mods-footer-warning">
          ⚠ Changes take effect on next game launch
        </div>
      </div>
    </div>
  );
}
