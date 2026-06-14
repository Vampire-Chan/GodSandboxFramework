/**
 * TabQuit.jsx - Pause Menu Tab
 * 
 * PORTING NOTES FOR UNREAL ENGINE / SLATE:
 * - Warning dialog and action options for quitting or returning to menus.
 * - Map actions to C++ delegates triggering Level loading/unloading or executing `UKismetSystemLibrary::QuitGame`.
 */
import React from "react";

export function TabQuit({ onQuit, notify }) {
  return (
    <div className="quit-panel">
      <div className="quit-warn">
        ⚠ Your progress is saved to the server continuously.<br />
        Quitting will not result in data loss — but open trade<br />
        deals and active jobs will be cancelled if offline too long.
      </div>
      {[
        { 
          icon: "◫", 
          label: "Return to Main Menu", 
          sub: "Character saved", 
          danger: false, 
          action: () => { 
            notify("Returning to main menu…"); 
            setTimeout(onQuit, 1000); 
          } 
        },
        { 
          icon: "⊟", 
          label: "Quit to Desktop", 
          sub: "Character saved", 
          danger: true, 
          action: () => notify("Quitting to desktop…") 
        },
      ].map(({ icon, label, sub, danger, action }) => (
        <div key={label} className={`quit-btn ${danger ? "danger" : ""}`} onClick={action}>
          <span className="quit-btn-icon">{icon}</span>
          <span className="quit-btn-label">{label}</span>
          <span className="quit-btn-sub">{sub}</span>
        </div>
      ))}
    </div>
  );
}
