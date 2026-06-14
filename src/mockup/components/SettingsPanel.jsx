/**
 * SettingsPanel.jsx - Global Options Menu
 * 
 * PORTING NOTES FOR UNREAL ENGINE / SLATE:
 * - This corresponds to a master `USettingsManager` UMG UserWidget.
 * - The left sidebar maps to an `SListView`, and the main content area maps to an `SWidgetSwitcher` where each tab index is a different child widget (Audio, Display, Gameplay).
 * - React `useState` hooks mirror the temporary state variables in C++. The "APPLY SETTINGS" button maps to calling the C++ GameUserSettings / custom SettingsManager to flush variables to disk (Game.ini / XML) and re-apply them to the viewport.
 * - The scrollable right panel maps to an `SScrollBox`.
 */
import { useEffect, useState } from "react";
import { Button } from "./common/Button";
import { Toggle } from "./common/Toggle";
import { Slider } from "./common/Slider";
import { DropDown } from "./common/DropDown";
import { SegmentedControl } from "./common/SegmentedControl";
import { Tabs } from "./common/Tabs";

const DEFAULT_BINDINGS = [
  ["Move", "WASD"],
  ["Sprint", "Shift"],
  ["Jump", "Space"],
  ["Crouch", "C"],
  ["Interact", "E"],
  ["Inventory", "Tab"],
  ["Reload", "R"],
  ["Map", "M"],
];

export function ControlsBindingEditor({ title = "Key Bindings", subtitle = "Click a binding, then press a new key to replace it.", compact = false }) {
  const [bindings, setBindings] = useState(DEFAULT_BINDINGS);
  const [editingAction, setEditingAction] = useState(null);

  useEffect(() => {
    if (!editingAction) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      event.preventDefault();

      if (event.key === "Escape") {
        setEditingAction(null);
        return;
      }

      const key = event.key.length === 1 ? event.key.toUpperCase() : event.key;
      if (!key) {
        return;
      }

      setBindings((currentBindings) => currentBindings.map(([action, currentKey]) => {
        if (action !== editingAction) {
          return [action, currentKey];
        }

        return [action, key === " " ? "Space" : key];
      }));
      setEditingAction(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [editingAction]);

  const resetBindings = () => {
    setBindings(DEFAULT_BINDINGS);
    setEditingAction(null);
  };

  return (
    <div className={compact ? "mm-settings-group compact" : "mm-settings-group"}>
      <div className="mm-section-label">{title}</div>
      <div className="mm-controls-grid">
        {bindings.map(([action, key]) => {
          const isEditing = editingAction === action;

          return (
            <div className="mm-ctrl-row" key={action}>
              <span className="mm-ctrl-action">{action}</span>
              <button
                type="button"
                className={`mm-ctrl-key ${isEditing ? "editing" : ""}`}
                onClick={() => setEditingAction(action)}
              >
                {isEditing ? "Press a key" : key}
              </button>
            </div>
          );
        })}
      </div>
      <div className="mm-settings-actions">
        <Button variant="primary" onClick={resetBindings}>RESET BINDINGS</Button>
        <Button variant="secondary" onClick={() => setEditingAction(null)}>CANCEL</Button>
      </div>
      <div className="mm-settings-note">
        {subtitle}
      </div>
    </div>
  );
}

export default function SettingsPanel({ tabs, activeTab, onTabChange }) {
  const [gfxQuality, setGfxQuality] = useState("High");
  const [resolution, setResolution] = useState("2560x1440");
  const [windowMode, setWindowMode] = useState("Borderless");
  const [textureQuality, setTextureQuality] = useState("High");
  const [shadowQuality, setShadowQuality] = useState("Medium");
  const [masterVol, setMasterVol] = useState(80);
  const [musicVol, setMusicVol] = useState(55);
  const [sfxVol, setSfxVol] = useState(75);
  const [voiceVol, setVoiceVol] = useState(70);
  const [chatVol, setChatVol] = useState(65);
  const [vsync, setVsync] = useState(true);
  const [motionBlur, setMotionBlur] = useState(false);
  const [subtitles, setSubtitles] = useState(true);
  const [hints, setHints] = useState(true);
  const [autoReload, setAutoReload] = useState(true);
  const [holdToAim, setHoldToAim] = useState(false);
  const [invertY, setInvertY] = useState(false);
  const [aimAssist, setAimAssist] = useState(true);
  const [subtitleSize, setSubtitleSize] = useState("Medium");
  const [uiScale, setUiScale] = useState(100);
  const [screenReader, setScreenReader] = useState(true);
  const [colorBlindMode, setColorBlindMode] = useState(false);
  const [highContrast, setHighContrast] = useState(true);
  const [reduceFlashes, setReduceFlashes] = useState(false);
  const [holdToInteract, setHoldToInteract] = useState(false);

  const QUALITY = ["Low", "Medium", "High", "Ultra"];

  return (
    <div className="mm-settings-layout">
      <Tabs 
        title="SETTINGS" 
        tabs={tabs} 
        activeTab={activeTab} 
        onTabChange={onTabChange} 
      />

      {/* Settings Content Area */}
      <div className="settings-content">
        <div className="mm-settings-content-inner">
          <h3 className="mm-settings-heading">
            {activeTab}
          </h3>

          {activeTab === 'audio' && (
            <>
              <div className="mm-settings-group">
                <div className="mm-section-label">Audio Mix</div>
                <Slider label="Master Volume" value={masterVol} onChange={setMasterVol} />
                <Slider label="Music Volume" value={musicVol} onChange={setMusicVol} />
                <Slider label="SFX Volume" value={sfxVol} onChange={setSfxVol} />
                <Slider label="Voice Volume" value={voiceVol} onChange={setVoiceVol} />
                <Slider label="Chat Volume" value={chatVol} onChange={setChatVol} />
              </div>
              <div className="mm-settings-group">
                <div className="mm-section-label">Audio Options</div>
                <Toggle label="Subtitles" checked={subtitles} onChange={setSubtitles} />
                <Toggle label="Gameplay Hints" checked={hints} onChange={setHints} />
              </div>
            </>
          )}

          {activeTab === 'video' && (
            <>
              <div className="mm-settings-group">
                <div className="mm-section-label">Display</div>
                <DropDown label="Resolution" value={resolution} onChange={setResolution} options={["1920x1080", "2560x1440", "3840x2160"]} />
                <DropDown label="Window Mode" value={windowMode} onChange={setWindowMode} options={["Fullscreen", "Borderless", "Windowed"]} />
                <Toggle label="VSync" checked={vsync} onChange={setVsync} />
                <Toggle label="Motion Blur" checked={motionBlur} onChange={setMotionBlur} />
              </div>
              <div className="mm-settings-group">
                <div className="mm-section-label">Quality</div>
                <SegmentedControl label="Overall Quality" value={gfxQuality} onChange={setGfxQuality} options={QUALITY} />
                <SegmentedControl label="Texture Quality" value={textureQuality} onChange={setTextureQuality} options={QUALITY} />
                <SegmentedControl label="Shadow Quality" value={shadowQuality} onChange={setShadowQuality} options={QUALITY} />
              </div>
            </>
          )}

          {activeTab === 'controls' && (
            <>
              <div className="mm-settings-group">
                <div className="mm-section-label">Input Behavior</div>
                <Toggle label="Invert Y Axis" checked={invertY} onChange={setInvertY} />
                <Toggle label="Hold To Aim" checked={holdToAim} onChange={setHoldToAim} />
                <Toggle label="Auto Reload" checked={autoReload} onChange={setAutoReload} />
                <Toggle label="Aim Assist" checked={aimAssist} onChange={setAimAssist} />
                <Toggle label="Hold To Interact" checked={holdToInteract} onChange={setHoldToInteract} />
              </div>
              <ControlsBindingEditor />
            </>
          )}

          {activeTab === 'gameplay' && (
            <>
              <div className="mm-settings-group">
                <div className="mm-section-label">Gameplay</div>
                <Toggle label="Gameplay Hints" checked={hints} onChange={setHints} />
                <Toggle label="Subtitles" checked={subtitles} onChange={setSubtitles} />
                <Toggle label="Auto Reload" checked={autoReload} onChange={setAutoReload} />
                <Toggle label="Hold To Aim" checked={holdToAim} onChange={setHoldToAim} />
                <Slider label="UI Scale" value={uiScale} onChange={setUiScale} min={80} max={130} suffix="%" />
              </div>
            </>
          )}

          {activeTab === 'accessibility' && (
            <>
              <div className="mm-settings-group">
                <div className="mm-section-label">Accessibility</div>
                <DropDown label="Subtitle Size" value={subtitleSize} onChange={setSubtitleSize} options={["Small", "Medium", "Large"]} />
                <Toggle label="Screen Reader" checked={screenReader} onChange={setScreenReader} />
                <Toggle label="Color Blind Mode" checked={colorBlindMode} onChange={setColorBlindMode} />
                <Toggle label="High Contrast UI" checked={highContrast} onChange={setHighContrast} />
                <Toggle label="Reduce Flashing Effects" checked={reduceFlashes} onChange={setReduceFlashes} />
              </div>
            </>
          )}

          <div className="mm-settings-actions">
            <Button variant="primary">APPLY SETTINGS</Button>
            <Button variant="secondary">DEFAULTS</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
