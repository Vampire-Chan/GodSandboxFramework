/**
 * MenuSidebar.jsx - Shared Sidebar Component for Main & Pause Menus
 * 
 * PORTING NOTES FOR UNREAL ENGINE / SLATE:
 * - This corresponds to an `SVerticalBox` sidebar panel in Unreal Engine / Slate.
 * - Key navigation (ArrowUp, ArrowDown, Enter, Escape) maps to `OnKeyDown` event overrides in the parent SCompoundWidget.
 * - Active tab switching translates to changing the active widget index of an `SWidgetSwitcher`.
 * - The visual design uses flexbox layout with custom borders and glassmorphism.
 */
import { useEffect, useState } from "react";
import { PlayerProfileCard } from "./PlayerProfileCard";

export function MenuSidebar({
  items = [],
  activeId,
  onSelect,
  onEscape,
  logoTitle = "JustLive",
  logoSub = "",
  profile,
  variant = "mainmenu", // "mainmenu" | "pausemenu"
  showContent = true,
  withPanel = false,
  footer,
  actionButton,
  disableKeyboardNav = false
}) {
  const isPauseMenu = variant === "pausemenu";
  const prefix = isPauseMenu ? "pm" : "mm";
  const [selectedIdx, setSelectedIdx] = useState(0);

  // Sync selected index with activeId when activeId changes externally
  useEffect(() => {
    const idx = items.findIndex(item => item.id === activeId);
    if (idx !== -1) {
      setSelectedIdx(idx);
    }
  }, [activeId, items]);

  // Shared Keyboard Navigation Logic
  useEffect(() => {
    if (disableKeyboardNav) return;

    const handleKeyDown = (e) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        const nextIdx = selectedIdx > 0 ? selectedIdx - 1 : items.length - 1;
        setSelectedIdx(nextIdx);
        onSelect(items[nextIdx].id, nextIdx, false);
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        const nextIdx = selectedIdx < items.length - 1 ? selectedIdx + 1 : 0;
        setSelectedIdx(nextIdx);
        onSelect(items[nextIdx].id, nextIdx, false);
      }
      if (e.key === "Enter") {
        e.preventDefault();
        if (items[selectedIdx]) {
          onSelect(items[selectedIdx].id, selectedIdx, true);
        }
      }
      if (e.key === "Escape" && onEscape) {
        e.preventDefault();
        onEscape();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIdx, items, disableKeyboardNav, onSelect, onEscape]);

  const logoClass = isPauseMenu ? "pm-wordmark" : "mm-logo";
  const titleClass = isPauseMenu ? "pm-game-title" : "mm-logo-title";
  const subClass = isPauseMenu ? "pm-game-sub" : "mm-logo-sub";
  const extraClasses = !isPauseMenu ? "mm-sidebar-transparent" : "";

  return (
    <div className={`${prefix}-sidebar ${extraClasses} ${showContent ? "show-content" : ""} ${withPanel ? "with-panel" : ""}`}>
      {/* Logo/Wordmark */}
      <div className={logoClass}>
        <div className={titleClass}>{logoTitle}</div>
        <div className={subClass}>{logoSub}</div>
      </div>

      {/* Profile Card */}
      {profile && (
        <PlayerProfileCard
          name={profile.name}
          profession={profile.profession}
          location={profile.location}
          deathWeight={profile.deathWeight}
          deathThreshold={profile.deathThreshold}
          titles={profile.titles}
          status={profile.status}
          variant={variant}
        />
      )}

      {/* Navigation List */}
      <nav className={`${prefix}-nav`}>
        {items.map((item, idx) => {
          const isActive = activeId === item.id;
          const isFocused = selectedIdx === idx;
          return (
            <button
              key={item.id}
              className={`${prefix}-nav-item ${isActive ? "active" : ""} ${isFocused ? "focused" : ""}`}
              onClick={() => onSelect(item.id, idx, true)}
              onMouseEnter={() => setSelectedIdx(idx)}
              style={{
                background: "none",
                border: "none",
                textAlign: "left",
                fontFamily: "inherit",
                width: "100%",
                outline: "none"
              }}
            >
              <span className="nav-icon" style={{ opacity: isActive ? 1 : 0.7 }}>{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              <span className="nav-arrow" style={{ opacity: isActive ? 1 : 0 }}>▶</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Action Button (e.g. Pause Menu Resume) */}
      {actionButton && <div className="sidebar-action-wrap">{actionButton}</div>}

      {/* Bottom Footer (e.g. Main Menu Build Info) */}
      {footer && <div className="sidebar-footer-wrap">{footer}</div>}
    </div>
  );
}
