/**
 * Toggle.jsx - Atomic UI Component
 * 
 * PORTING NOTES FOR UNREAL ENGINE / SLATE:
 * - This maps to a standard `SCheckBox` (with a toggle style) in Slate.
 * - The `checked` state should be driven by an external C++ property (e.g., bound to a boolean in the SettingsManager).
 * - React handles the layout via CSS flexbox. In Slate, this layout is achieved using an `SHorizontalBox` containing an `STextBlock` (for the label) and the `SCheckBox` (for the toggle visual).
 * - The sliding knob animation should be implemented using Slate's FCurveSequence and FCurveHandle or UMG UI animations.
 */
import React from "react";

export function Toggle({ label, checked, onChange, className = "" }) {
  return (
    <div className={`setting-row ${className}`} onClick={() => onChange(!checked)}>
      {label && <div className="setting-label">{label}</div>}
      <div className={`toggle-switch ${checked ? "on" : ""}`}>
        <div className="toggle-knob" />
      </div>
    </div>
  );
}
