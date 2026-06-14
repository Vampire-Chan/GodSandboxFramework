/**
 * EquipmentHud.jsx - HUD Component
 * 
 * PORTING NOTES FOR UNREAL ENGINE / SLATE:
 * - This component belongs on the viewport overlay (UMG UserWidget added to viewport).
 * - In React, inline styles with flexbox are used to lay out the ammo counters and weapon names.
 * - In UMG/Slate, you use `SHorizontalBox` and `SVerticalBox`. The blur backdrop (`backdropFilter: "blur(4px)"`) is achieved using an `SBackgroundBlur` widget.
 * - The visibility toggle (sliding in and out) in React uses CSS transitions. In UE, use UMG Animations or a C++ tick interpolation of the Render Transform Translation.
 * - The data (weaponName, currentAmmo) must be bound to the `InventoryComponent` and `WeaponInstance` tracked in C++.
 */
import React, { useState, useEffect } from "react";

export function EquipmentHud({ 
  weaponName = "ASSAULT RIFLE M4", 
  ammoType = "5.56x45mm NATO", 
  currentAmmo = 30, 
  maxAmmo = 120, 
  visible = true,
  uiLayout = "desktop",
  onWeaponChange,
  
  // State synchronization props (lifted to HUD)
  weapons: propWeapons,
  activeSlot: propActiveSlot,
  isReloading: propIsReloading,
  scrollIndex: propScrollIndex,
  onSelectSlot,
  onScrollLeft,
  onScrollRight,
  onReload
}) {
  const isPhone = uiLayout === "phone";
  
  // Fallback local states if props not provided
  const [localActiveSlot, setLocalActiveSlot] = useState(4);
  const [localScrollIndex, setLocalScrollIndex] = useState(2);
  const [localIsReloading, setLocalIsReloading] = useState(false);
  const [localWeapons, setLocalWeapons] = useState([
    { id: "unarmed", icon: "✊", currentAmmo: 0, maxAmmo: 0, type: "Melee", label: "FIST", bulletType: "MELEE" },
    { id: "knife", icon: "🔪", currentAmmo: 0, maxAmmo: 0, type: "Melee", label: "KNIFE", bulletType: "BLADE" },
    { id: "pistol", icon: "🔫", currentAmmo: 15, maxAmmo: 45, type: "9mm", label: "PISTOL", bulletType: "9x19MM" },
    { id: "smg", icon: "🔫", currentAmmo: 30, maxAmmo: 90, type: ".45 ACP", label: "SMG", bulletType: ".45ACP" },
    { id: "rifle", icon: "︻╦╤─", currentAmmo: currentAmmo, maxAmmo: maxAmmo, type: "5.56mm", label: "RIFLE", bulletType: "5.56MM" }
  ]);

  // Sync rifle ammo from parent when it changes locally
  useEffect(() => {
    if (propWeapons === undefined) {
      setLocalWeapons(prev => prev.map((w, idx) => {
        if (idx === 4) {
          return { ...w, currentAmmo: currentAmmo, maxAmmo: maxAmmo };
        }
        return w;
      }));
    }
  }, [currentAmmo, maxAmmo, propWeapons]);

  const activeSlot = propActiveSlot !== undefined ? propActiveSlot : localActiveSlot;
  const scrollIndex = propScrollIndex !== undefined ? propScrollIndex : localScrollIndex;
  const isReloading = propIsReloading !== undefined ? propIsReloading : localIsReloading;
  const weapons = propWeapons !== undefined ? propWeapons : localWeapons;

  const handleSelectSlot = (idx) => {
    if (onSelectSlot) {
      onSelectSlot(idx);
    } else {
      setLocalActiveSlot(idx);
      if (onWeaponChange) {
        onWeaponChange(weapons[idx]);
      }
    }
  };

  const handleScrollLeft = () => {
    if (onScrollLeft) {
      onScrollLeft();
    } else {
      setLocalScrollIndex(prev => Math.max(0, prev - 1));
    }
  };

  const handleScrollRight = () => {
    if (onScrollRight) {
      onScrollRight();
    } else {
      setLocalScrollIndex(prev => Math.min(2, prev + 1));
    }
  };

  const handleReload = () => {
    if (onReload) {
      onReload();
    } else {
      const activeWep = weapons[activeSlot];
      if (activeWep.maxAmmo === 0 || activeWep.currentAmmo === activeWep.maxAmmo || localIsReloading) return;

      setLocalIsReloading(true);
      setTimeout(() => {
        setLocalWeapons(prev => prev.map((w, idx) => {
          if (idx === activeSlot) {
            return { ...w, currentAmmo: w.maxAmmo };
          }
          return w;
        }));
        setLocalIsReloading(false);
      }, 1200);
    }
  };

  if (visible === false) return null;

  const activeWeapon = (weapons && activeSlot !== undefined && activeSlot >= 0 && activeSlot < weapons.length) 
    ? weapons[activeSlot] 
    : null;

  if (isPhone) {
    const visibleWeapons = weapons.slice(scrollIndex, scrollIndex + 3);

    return (
      <div 
        style={{ 
          display: "flex", 
          alignItems: "center",
          gap: "10px", 
          pointerEvents: "auto",
          transition: "all 0.3s ease",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(15px)"
        }}
      >
        {/* Left Pagination Arrow */}
        <button 
          onClick={handleScrollLeft}
          disabled={scrollIndex === 0}
          style={{
            background: "rgba(20, 20, 20, 0.75)",
            border: "1px solid var(--color-line)",
            color: scrollIndex === 0 ? "var(--color-text-muted)" : "var(--color-accent)",
            width: "30px",
            height: "56px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            cursor: scrollIndex === 0 ? "not-allowed" : "pointer",
            borderRadius: "4px",
            transition: "all 0.15s ease",
            backdropFilter: "blur(4px)"
          }}
          onMouseEnter={(e) => {
            if (scrollIndex > 0) e.currentTarget.style.borderColor = "var(--color-accent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--color-line)";
          }}
        >
          ◀
        </button>

        {/* Weapons List (3 Visible Slots) */}
        <div style={{ display: "flex", gap: "6px" }}>
          {visibleWeapons.map((w) => {
            const actualIdx = weapons.findIndex(x => x.id === w.id);
            const isActive = activeSlot === actualIdx;
            return (
              <div 
                key={w.id}
                onClick={() => handleSelectSlot(actualIdx)}
                style={{
                  background: "var(--color-bg-overlay)",
                  border: isActive ? "1.5px solid var(--color-accent)" : "1px solid var(--color-line)",
                  boxShadow: isActive ? "0 0 12px rgba(200, 114, 31, 0.3)" : "none",
                  borderRadius: "6px",
                  padding: "6px 10px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "2px",
                  cursor: "pointer",
                  width: "80px",
                  height: "56px",
                  transition: "all 0.15s ease",
                  backdropFilter: "blur(6px)",
                  userSelect: "none"
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.borderColor = "var(--color-line-2)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.borderColor = "var(--color-line)";
                }}
              >
                {/* Weapon Icon */}
                <span style={{ 
                  fontSize: "16px", 
                  color: isActive ? "var(--color-text-bright)" : "var(--color-text-dim)",
                  fontFamily: "var(--font-sans)",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "20px"
                }}>
                  {w.icon}
                </span>
                
                {/* Small Ammo & Bullet Type */}
                <span style={{ 
                  fontSize: "8px", 
                  fontFamily: "'IBM Plex Mono', monospace", 
                  color: isActive ? "var(--color-accent)" : "var(--color-text-muted)",
                  fontWeight: 600,
                  letterSpacing: "0.5px"
                }}>
                  {w.bulletType}
                </span>
                <span style={{ 
                  fontSize: "9px", 
                  fontFamily: "'IBM Plex Mono', monospace", 
                  color: isActive ? "var(--color-text-bright)" : "var(--color-text-dim)",
                  fontWeight: 700
                }}>
                  {isReloading && isActive ? "LOAD..." : (w.maxAmmo > 0 ? `${w.currentAmmo} / ${w.maxAmmo}` : "—")}
                </span>
              </div>
            );
          })}
        </div>

        {/* Right Pagination Arrow */}
        <button 
          onClick={handleScrollRight}
          disabled={scrollIndex === 2}
          style={{
            background: "rgba(20, 20, 20, 0.75)",
            border: "1px solid var(--color-line)",
            color: scrollIndex === 2 ? "var(--color-text-muted)" : "var(--color-accent)",
            width: "30px",
            height: "56px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            cursor: scrollIndex === 2 ? "not-allowed" : "pointer",
            borderRadius: "4px",
            transition: "all 0.15s ease",
            backdropFilter: "blur(4px)"
          }}
          onMouseEnter={(e) => {
            if (scrollIndex < 2) e.currentTarget.style.borderColor = "var(--color-accent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--color-line)";
          }}
        >
          ▶
        </button>

        {/* Dedicated Reload Button */}
        <button 
          onClick={handleReload}
          disabled={activeWeapon.maxAmmo === 0 || activeWeapon.currentAmmo === activeWeapon.maxAmmo || isReloading}
          style={{
            background: isReloading ? "var(--color-accent-dim)" : "var(--color-accent)",
            border: "1px solid var(--color-accent)",
            boxShadow: isReloading ? "none" : "0 0 10px rgba(200, 114, 31, 0.2)",
            color: "#fff",
            width: "50px",
            height: "56px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
            cursor: (activeWeapon.maxAmmo === 0 || activeWeapon.currentAmmo === activeWeapon.maxAmmo || isReloading) ? "not-allowed" : "pointer",
            borderRadius: "6px",
            transition: "all 0.15s ease",
            backdropFilter: "blur(4px)",
            opacity: (activeWeapon.maxAmmo === 0 || activeWeapon.currentAmmo === activeWeapon.maxAmmo) && !isReloading ? 0.4 : 1
          }}
          onMouseEnter={(e) => {
            if (!isReloading && activeWeapon.maxAmmo > 0 && activeWeapon.currentAmmo !== activeWeapon.maxAmmo) {
              e.currentTarget.style.background = "#e08030";
              e.currentTarget.style.boxShadow = "0 0 15px rgba(200, 114, 31, 0.4)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isReloading && activeWeapon.maxAmmo > 0 && activeWeapon.currentAmmo !== activeWeapon.maxAmmo) {
              e.currentTarget.style.background = "var(--color-accent)";
              e.currentTarget.style.boxShadow = "0 0 10px rgba(200, 114, 31, 0.2)";
            }
          }}
        >
          <span style={{ fontSize: "16px" }}>⟳</span>
          <span style={{ fontSize: "7px", fontWeight: "bold", marginTop: "2px" }}>
            {isReloading ? "LOAD" : "RELOAD"}
          </span>
        </button>
      </div>
    );
  }

  // Desktop layout (default)
  return (
    <div className={`hud-equipment ${visible ? "" : "hidden"}`}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
        <span className="hud-weapon-name">
          {activeWeapon ? activeWeapon.label : weaponName}
        </span>
        <span className="hud-weapon-ammo">
          {activeWeapon ? activeWeapon.bulletType : ammoType}
        </span>
      </div>
      
      <div className="hud-equipment-divider" />

      <div className="hud-ammo-display">
        <span className="hud-ammo-count">
          {isReloading ? "—" : (activeWeapon ? activeWeapon.currentAmmo : currentAmmo)}
        </span>
        <span className="hud-ammo-max">
          / {activeWeapon ? (activeWeapon.maxAmmo > 0 ? activeWeapon.maxAmmo : "—") : maxAmmo}
        </span>
      </div>
    </div>
  );
}
