/**
 * GameOptionCard.jsx - List Item Component
 * 
 * PORTING NOTES FOR UNREAL ENGINE / SLATE:
 * - This is a custom row widget meant to be generated inside an `SListView`'s `OnGenerateRow` delegate.
 * - In React, it's a `div` with `onClick` that fires `onSelect`. It visually fakes a radio button.
 * - In Slate, this should inherit from `STableRow<TSharedPtr<FGameOptionData>>`.
 * - The selection state (`isSelected`) in React is passed down from the parent map. In Slate, `STableRow` handles hovering and selection highlights natively via `STableViewBase::GetSelectionMode()`.
 * - The internal "PLAY" button would be an `SButton` bound to a delegate, appearing or enabling only if the row is selected.
 */
import React from "react";

export function GameOptionCard({ id, name, version, size, isSelected, onSelect, onPlay }) {
  return (
    <div
      className={`mods-item mods-item-standalone ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(id)}
    >
      <div className="mods-radio">
        <div className="radio-outer">
          {isSelected && <div className="radio-inner" />}
        </div>
      </div>

      <div className="mods-item-info">
        <div className="mods-item-name">{name}</div>
        <div className="mods-item-meta">
          <span className="mods-version">v{version}</span>
          <span className="mods-separator">·</span>
          <span className="mods-size">{size}</span>
        </div>
      </div>

      <button
        className={`mods-play-btn ${isSelected ? 'active' : 'disabled'}`}
        onClick={(e) => {
          e.stopPropagation();
          if (isSelected && onPlay) {
            onPlay(id);
          }
        }}
        disabled={!isSelected}
      >
        ▶ PLAY
      </button>
    </div>
  );
}
