/**
 * PlayerProfileCard.jsx - Common UI Component
 * 
 * PORTING NOTES FOR UNREAL ENGINE / SLATE:
 * - This displays player metadata (name, profession, location, status chips, death weight track).
 * - Maps to a container widget (like `SVerticalBox`) with `STextBlock` widgets.
 * - In UMG/Slate, the progress bar uses `SProgressBar` bound to a normalized float (`DeathWeight / DeathThreshold`).
 * - Status chips and titles map to horizontal boxes (`SHorizontalBox` or custom wrap boxes) wrapping text blocks.
 */
import React from "react";

export function PlayerProfileCard({ 
  name, 
  profession, 
  location, 
  status = [], 
  deathWeight, 
  deathThreshold, 
  titles = [], 
  variant = "mainmenu" // "mainmenu" | "pausemenu"
}) {
  const isPauseMenu = variant === "pausemenu";
  const dwPct = deathThreshold ? (deathWeight / deathThreshold) * 100 : 0;
  const dwColor = dwPct > 70 ? "#a83428" : dwPct > 40 ? "#c0920c" : "#4aad72";
  const prefix = isPauseMenu ? "pm" : "mm";

  return (
    <div className={`${prefix}-player-card`}>
      <div className={`${prefix}-player-name`}>{name}</div>
      <div className={`${prefix}-player-prof`}>{profession}</div>
      <div className={`${prefix}-player-loc`}>
        <div className={`${prefix}-player-loc-dot`} />
        {location}
      </div>

      {deathThreshold !== undefined && (
        <div className="dw-row">
          <div className="dw-label">
            <span>Death Weight</span>
            <span className="dw-val">{deathWeight.toFixed(2)} / {deathThreshold.toFixed(1)}</span>
          </div>
          <div className="dw-track">
            <div className="dw-fill" style={{ width: `${dwPct}%`, background: dwColor }} />
          </div>
        </div>
      )}

      {titles.length > 0 && (
        <div className={`${prefix}-titles`}>
          {titles.map((t) => (
            <span key={t} className="title-chip">{t}</span>
          ))}
        </div>
      )}

      {status.length > 0 && (
        <div className={`${prefix}-status-row`}>
          {status.map((val) => (
            <span key={val} className={`${prefix}-status-chip`}>{val}</span>
          ))}
        </div>
      )}
    </div>
  );
}
