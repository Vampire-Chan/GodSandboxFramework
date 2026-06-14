/**
 * Subtitle.jsx - Cinematic dialog subtitles overlay.
 * 
 * PORTING NOTES FOR UNREAL ENGINE / SLATE:
 * - This maps to a centered text overlay placed at the bottom, sitting above the radar and context boxes.
 * - STextBlock is used with heavy black shadow properties (ShadowColor/ShadowOffset) or an outline to ensure readability on bright backgrounds.
 */
import React from "react";

export function Subtitle({ subtitle }) {
  if (!subtitle) return null;

  return (
    <div className="hud-subtitle">
      <p className="hud-subtitle-text">
        {subtitle}
      </p>
    </div>
  );
}
