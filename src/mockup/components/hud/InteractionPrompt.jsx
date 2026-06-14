/**
 * InteractionPrompt.jsx - Contextual interaction prompt key overlay.
 * 
 * PORTING NOTES FOR UNREAL ENGINE / SLATE:
 * - This maps to a screen-space UI element positioned dynamically above the interactable actor or centered at the bottom of the screen.
 * - Key glyph background maps to an image representing the keyboard/controller key or dynamically binding raw input key names.
 * - Text color and shadows map to `STextBlock` color and shadow offsets.
 */
import React from "react";

export function InteractionPrompt({ interaction, colors }) {
  if (!interaction) return null;

  return (
    <div className="hud-interaction">
      <div className="hud-interaction-prompt">
        <div className="hud-interaction-key">
          {interaction.key}
        </div>
        <span className="hud-interaction-text">
          {interaction.text}
        </span>
      </div>
    </div>
  );
}
