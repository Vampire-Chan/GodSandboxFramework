/**
 * ContextInfo.jsx - HUD Component
 * 
 * PORTING NOTES FOR UNREAL ENGINE / SLATE:
 * - This displays contextual overlays like current location, vehicle name, etc.
 * - React uses CSS linear-gradient for the background. In Slate, this requires a UI material bound to an `SImage` or custom `FSlateBrush`.
 * - The CSS transition (`transform: translateY(20px)`) for hiding/showing should be implemented via UMG Widget Animations, or interpolating the Render Transform in `NativeTick`.
 * - Text styling (letterSpacing, uppercase) maps directly to UMG `TextBlock` properties or `FSlateFontInfo`.
 */
import React from "react";

export function ContextInfo({ type = 'location', name = 'Downtown District', equipVisible = true }) {
  return (
    <div className={`hud-context-info ${type} ${equipVisible ? "" : "hidden"}`}>
      {type === 'location' ? (
         <span className="hud-context-icon">📍</span>
      ) : (
         <span className="hud-context-icon">🚗</span>
      )}
      <span className="hud-context-name">
        {name}
      </span>
    </div>
  );
}
