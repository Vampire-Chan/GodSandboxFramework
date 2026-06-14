/**
 * Slider.jsx - Atomic UI Component
 * 
 * PORTING NOTES FOR UNREAL ENGINE / SLATE:
 * - This maps directly to an `SSlider` in Slate.
 * - React uses an <input type="range"> which browser renders natively. In Slate, the value must be normalized between 0.0 and 1.0. 
 * - You will need to map your `min` and `max` (e.g., 80 to 130) to the 0.0-1.0 range when binding to `SSlider`, and unmap it on value changed.
 * - The suffix (e.g., "%") should be appended to an `STextBlock` next to the slider in an `SHorizontalBox`.
 */
import React from "react";

export function Slider({ label, value, onChange, min = 0, max = 100, suffix = "%", className = "" }) {
  return (
    <div className={`setting-row ${className}`}>
      {label && <div className="setting-label">{label}</div>}
      <div className="slider-wrap">
        <input
          type="range"
          className="pm-slider"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        <span className="slider-val">{value}{suffix}</span>
      </div>
    </div>
  );
}
