/**
 * InteractionItem.jsx - Common UI Component
 * 
 * PORTING NOTES FOR UNREAL ENGINE / SLATE:
 * - This maps to a row item inside the interaction menu list view.
 * - In UMG/Slate, this is a composite UserWidget containing `STextBlock` widgets for name/description, 
 *   an `SImage` for the icon, and a child widget switcher or horizontal box for active controls (picker, slider, toggle, button hint).
 * - React handles conditional rendering depending on `item.type`. In C++, this should dynamically construct or switch the active control slot based on the item's metadata type.
 */
import React from "react";

export function InteractionItem({ item, isActive, onSelect, onArrowLeft, onArrowRight }) {
  return (
    <div
      className={`im-item ${isActive ? "active" : ""}`}
      onClick={onSelect}
    >
      {/* Item Info (Left Side) */}
      <div className="im-item-main">
        <div className="im-item-icon">{item.icon}</div>
        <div className="im-item-content">
          <div className="im-item-label">{item.label}</div>
          <div className="im-item-desc">{item.sub}</div>
        </div>
      </div>

      {/* Interaction Controls (Right Side - Prioritized) */}
      <div className="im-control">
        {item.type === "picker" && (
          <div className="im-picker">
            <span className="im-picker-arrow" onClick={(e) => { e.stopPropagation(); onArrowLeft(); }}>‹</span>
            <span className="im-picker-val">{item.options[item.value]}</span>
            <span className="im-picker-arrow" onClick={(e) => { e.stopPropagation(); onArrowRight(); }}>›</span>
          </div>
        )}

        {item.type === "slider" && (
          <div className="im-slider">
            <div className="im-slider-track">
              <div className="im-slider-fill" style={{ width: `${(item.value / item.max) * 100}%` }} />
            </div>
            <span className="im-slider-val">{item.value}</span>
          </div>
        )}

        {item.type === "toggle" && (
          <div className={`im-toggle ${item.value ? "on" : ""}`} onClick={(e) => { e.stopPropagation(); onArrowLeft(); }}>
            <div className="im-toggle-knob" />
          </div>
        )}

        {(item.type === "button" || item.type === "folder") && (
          <div className="im-btn-hint">{item.type === "folder" ? "▶" : "•"}</div>
        )}
      </div>
    </div>
  );
}
