/**
 * DropDown.jsx - Atomic UI Component
 * 
 * PORTING NOTES FOR UNREAL ENGINE / SLATE:
 * - This maps to `SComboBox` or `STextComboBox` in Slate.
 * - In React, the `<select>` tag is natively handled by the browser. In Slate, `SComboBox` requires an array of options (usually `TSharedPtr<FString>`) passed via `OptionsSource`.
 * - The dropdown's visual customization (like background and text color of the open menu) is done by modifying `FComboBoxStyle` and `FTableRowStyle`.
 * - Event `onChange` translates to `OnSelectionChanged` delegate in Slate.
 */
import React from "react";

export function DropDown({ label, value, onChange, options, className = "" }) {
  return (
    <div className={`setting-row ${className}`}>
      {label && <div className="setting-label">{label}</div>}
      <select 
        className="mm-select mm-select-small" 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        style={{
          background: "var(--color-card)",
          color: "var(--color-text-bright)",
          border: "1px solid var(--color-line-2)",
          padding: "4px 8px",
          fontFamily: "var(--font-sans)",
          fontSize: "13px",
          fontWeight: 600,
          outline: "none",
          cursor: "pointer"
        }}
      >
        {options.map((opt) => (
          <option key={opt.value || opt} value={opt.value || opt}>
            {opt.label || opt}
          </option>
        ))}
      </select>
    </div>
  );
}
