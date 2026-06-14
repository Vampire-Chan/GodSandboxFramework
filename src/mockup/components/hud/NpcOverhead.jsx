/**
 * NpcOverhead.jsx - World-projected speech bubble component.
 * 
 * PORTING NOTES FOR UNREAL ENGINE / SLATE:
 * - This maps to a 3D Widget Component attached to an Actor or projected from 3D space to 2D screen space.
 * - In Unreal Engine, project the NPC's socket location (e.g., `Head`) to screen space using `UGameplayStatics::ProjectWorldToScreen`.
 * - The root element is set to absolute screen-space coordinates updated during Tick or via Bindings.
 * - Glassmorphic styles translate to an image brush background with a custom material for blur/tint.
 */
import React from "react";

export function NpcOverhead({ npcText, colors }) {
  if (!npcText) return null;

  return (
    <div
      className="hud-npc-text"
      style={{
        left: npcText.x,
        top: npcText.y
      }}
    >
      <span className="hud-npc-speech">
        {npcText.text}
      </span>
      <div className="hud-npc-tail" />
    </div>
  );
}
