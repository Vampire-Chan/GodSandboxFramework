/**
 * Radar.jsx - HUD Subcomponent
 * 
 * PORTING NOTES FOR UNREAL ENGINE / SLATE:
 * - This maps to the HUD minimap / radar widget.
 * - In Unreal Engine, rendering the actual map inside the circle is achieved via a SceneCapture2D rendering to a render target, mapped to a UI material with a circular mask.
 * - The context-aware rings are best rendered using a custom `SWidget` subclass overriding `OnPaint`, drawing arcs using `FSlateDrawElement::MakeLines` or standard UI Arc materials with dynamic material instances (MID).
 * - Stat variables (health, armor, stamina, mana) should be fetched from the player character's `AttributesComponent`.
 */
import React from "react";

export function Radar({ activeStats, colors, radius = 86, circumference = 2 * Math.PI * 86, maxArcLen, uiLayout = "desktop" }) {
  const isPhone = uiLayout === "phone";
  return (
    <div 
      className="hud-bottom-left"
      style={{ 
        bottom: isPhone ? "auto" : "30px", 
        top: isPhone ? "20px" : "auto",
        left: isPhone ? "auto" : "30px", 
        right: isPhone ? "20px" : "auto",
        transition: "all 0.3s ease-in-out"
      }}
    >
      
      {/* Radar & Ring */}
      <div className="hud-radar">
        
        {/* Radar Inner Circle */}
        <div className="hud-radar-inner">
          <div className="hud-radar-ring" />
          {/* Player Arrow */}
          <div className="hud-radar-player" />
        </div>

        {/* SVG Context-Aware Ring */}
        <svg width="190" height="190" className="hud-radar-svg">
          {activeStats.map((stat, i) => {
            const rotationOffset = (360 / activeStats.length) * i;
            const bgDashArray = `${maxArcLen} ${circumference - maxArcLen}`;
            const fillLen = maxArcLen * (stat.val / 100);
            const fgDashArray = `${fillLen} ${circumference - fillLen}`;
            
            return (
              <g key={stat.id} style={{ transformOrigin: "center", transform: `rotate(${rotationOffset}deg)` }}>
                {/* Background Arc */}
                <circle cx="95" cy="95" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" strokeDasharray={bgDashArray} strokeLinecap="square" />
                {/* Foreground Value Arc */}
                <circle cx="95" cy="95" r={radius} fill="none" stroke={stat.color} strokeWidth="5" strokeDasharray={fgDashArray} strokeLinecap="square" style={{ transition: "stroke-dasharray 0.3s, stroke 0.3s" }} />
              </g>
            );
          })}
        </svg>
      </div>

      {/* 4 Bottom Action/Context Icons */}
      <div className="hud-action-icons">
         {['📱', '🎒', '🚗', '📻'].map((icon, i) => (
           <div key={i} className="hud-action-icon">
             {icon}
           </div>
         ))}
      </div>
    </div>
  );
}
