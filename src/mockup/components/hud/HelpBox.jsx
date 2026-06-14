/**
 * HelpBox.jsx - HUD Subcomponent
 * 
 * PORTING NOTES FOR UNREAL ENGINE / SLATE:
 * - Maps to a guide/help panel on the HUD.
 * - In Slate, this would be an `SVerticalBox` containing key-action rows inside a styled `SBorder`.
 */
import React from "react";

export function HelpBox({ showHelp, tips, colors, onTestNotif }) {
  if (!showHelp) return null;

  return (
    <div className="hud-help-box">
      <div className="hud-help-header">
         <span className="hud-help-title">KEYBINDINGS</span>
         <button className="hud-test-notif-btn" onClick={onTestNotif}>TEST NOTIF</button>
      </div>
      {tips.map((t, idx) => (
        <div key={idx} className="hud-help-item">
          <span className="hud-help-key">[{t.key}]</span>
          <span className="hud-help-action">{t.action}</span>
        </div>
      ))}
    </div>
  );
}
