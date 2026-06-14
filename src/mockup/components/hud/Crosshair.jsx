/**
 * Crosshair.jsx - Central Target Indicator overlay.
 * 
 * PORTING NOTES FOR UNREAL ENGINE / SLATE:
 * - This sits at the absolute center of the viewport, typically positioned using an `SOverlay::Slot` with center alignment.
 * - In UMG/Slate, this is a simple `SImage` showing a crosshair brush.
 */
import React from "react";

export function Crosshair({ opacity = 0.6, isAiming = false, recoilActive = false }) {
  // Compute tick spacing based on aim and recoil states
  const baseSpacing = isAiming ? 6 : 12;
  const spacing = baseSpacing + (recoilActive ? 14 : 0);
  
  const tickColor = isAiming ? "var(--color-accent)" : "#fff";
  const scale = recoilActive ? 1.3 : 1;

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "36px",
        height: "36px",
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "transform 0.08s ease"
      }}
    >
      {/* Center Precision Dot */}
      <div
        style={{
          width: isAiming ? "3px" : "4px",
          height: isAiming ? "3px" : "4px",
          backgroundColor: tickColor,
          borderRadius: "50%",
          opacity: isAiming ? 1 : opacity,
          transition: "all 0.15s ease",
          boxShadow: isAiming ? "0 0 6px var(--color-accent)" : "none"
        }}
      />

      {/* Crosshair Ticks - Top, Bottom, Left, Right */}
      {!isAiming ? (
        <>
          {/* Top Tick */}
          <div style={{
            position: "absolute",
            top: `calc(50% - ${spacing}px - 4px)`,
            left: "50%",
            transform: "translateX(-50%)",
            width: "2px",
            height: "6px",
            backgroundColor: tickColor,
            opacity: opacity,
            transition: "top 0.08s ease, opacity 0.15s ease"
          }} />
          
          {/* Bottom Tick */}
          <div style={{
            position: "absolute",
            bottom: `calc(50% - ${spacing}px - 4px)`,
            left: "50%",
            transform: "translateX(-50%)",
            width: "2px",
            height: "6px",
            backgroundColor: tickColor,
            opacity: opacity,
            transition: "bottom 0.08s ease, opacity 0.15s ease"
          }} />

          {/* Left Tick */}
          <div style={{
            position: "absolute",
            left: `calc(50% - ${spacing}px - 4px)`,
            top: "50%",
            transform: "translateY(-50%)",
            width: "6px",
            height: "2px",
            backgroundColor: tickColor,
            opacity: opacity,
            transition: "left 0.08s ease, opacity 0.15s ease"
          }} />

          {/* Right Tick */}
          <div style={{
            position: "absolute",
            right: `calc(50% - ${spacing}px - 4px)`,
            top: "50%",
            transform: "translateY(-50%)",
            width: "6px",
            height: "2px",
            backgroundColor: tickColor,
            opacity: opacity,
            transition: "right 0.08s ease, opacity 0.15s ease"
          }} />
        </>
      ) : (
        /* Aiming (ADS) Holographic Scope Rings */
        <>
          {/* Outer circle line */}
          <div style={{
            position: "absolute",
            width: `${24 + (recoilActive ? 8 : 0)}px`,
            height: `${24 + (recoilActive ? 8 : 0)}px`,
            border: "1.5px solid var(--color-accent)",
            borderRadius: "50%",
            opacity: 0.35,
            boxShadow: "0 0 8px var(--color-accent-pale)",
            transition: "all 0.08s ease"
          }} />

          {/* Glowing ticks */}
          <div style={{ position: "absolute", top: `calc(50% - ${spacing}px - 3px)`, left: "50%", transform: "translateX(-50%)", width: "1.5px", height: "4px", backgroundColor: tickColor }} />
          <div style={{ position: "absolute", bottom: `calc(50% - ${spacing}px - 3px)`, left: "50%", transform: "translateX(-50%)", width: "1.5px", height: "4px", backgroundColor: tickColor }} />
          <div style={{ position: "absolute", left: `calc(50% - ${spacing}px - 3px)`, top: "50%", transform: "translateY(-50%)", width: "4px", height: "1.5px", backgroundColor: tickColor }} />
          <div style={{ position: "absolute", right: `calc(50% - ${spacing}px - 3px)`, top: "50%", transform: "translateY(-50%)", width: "4px", height: "1.5px", backgroundColor: tickColor }} />
        </>
      )}

      {/* Bullet Spark Effect on Recoil */}
      {recoilActive && (
        <div style={{
          position: "absolute",
          width: "20px",
          height: "20px",
          background: "radial-gradient(circle, rgba(255,230,150,0.8) 0%, rgba(200,114,31,0) 70%)",
          borderRadius: "50%",
          animation: "pulse 0.05s ease-out"
        }} />
      )}
    </div>
  );
}
