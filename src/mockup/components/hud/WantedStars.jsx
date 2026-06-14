/**
 * WantedStars.jsx - HUD Subcomponent
 * 
 * PORTING NOTES FOR UNREAL ENGINE / SLATE:
 * - Displays the wanted status stars, bank balance, and current bounty overlay.
 * - Wanted stars: dynamically draw star icons in an `SHorizontalBox` based on C++ wanted level integer.
 * - Balance/Bounty cards: simple formatted `STextBlock` widgets aligned inside a vertical container.
 */
import React from "react";

export function WantedStars({ wantedLevel = 3, balance = "$14,250", bounty = "$5,000", colors, uiLayout = "desktop" }) {
  const isPhone = uiLayout === "phone";
  return (
    <div 
      className="hud-top-right"
      style={{ 
        top: isPhone ? "270px" : "20px", 
        transition: "all 0.3s ease-in-out"
      }}
    >
       {/* Wanted Level */}
       <div className="hud-wanted-level">
          <span className="hud-wanted-text">WANTED</span>
          {[1, 2, 3, 4, 5].map(i => {
            const isActive = i <= wantedLevel;
            return (
              <span 
                key={i} 
                className={`hud-wanted-star ${isActive ? "" : "inactive"}`}
              >
                ★
              </span>
            );
          })}
       </div>

       {/* Balance Card */}
       <div className="hud-balance-bounty">
          <div className="hud-balance">
            <span className="hud-balance-label">BALANCE</span>
            <span className="hud-balance-amount">{balance}</span>
          </div>
          <div className="hud-bounty">
            <span className="hud-bounty-label">BOUNTY</span>
            <span className="hud-bounty-amount">{bounty}</span>
          </div>
       </div>
    </div>
  );
}
