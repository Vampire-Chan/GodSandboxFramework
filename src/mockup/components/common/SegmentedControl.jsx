/**
 * SegmentedControl.jsx - Atomic UI Component
 * 
 * PORTING NOTES FOR UNREAL ENGINE / SLATE:
 * - There is no direct "SegmentedControl" primitive in UMG/Slate. 
 * - This must be built as an `SHorizontalBox` containing multiple `SCheckBox` elements configured with `ESlateCheckBoxType::ToggleButton`.
 * - You will need a C++ wrapper (or UMG UserWidget) that ensures mutual exclusivity (like a Radio Button group), deselecting others when one is clicked.
 * - In React, mapping an array of strings to buttons handles this easily. In UE, instantiate the toggle buttons dynamically in a loop and bind their OnCheckStateChanged delegates to a common handler.
 */
import React from "react";

export function SegmentedControl({ label, value, options, onChange, className = "" }) {
  return (
    <div className={`setting-row ${className}`}>
      {label && <div className="setting-label">{label}</div>}
      <div className="quality-picker">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            className={`quality-btn ${value === opt ? "active" : ""}`}
            onClick={() => onChange(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
