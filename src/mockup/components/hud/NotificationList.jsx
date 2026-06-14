/**
 * NotificationList.jsx - HUD Subcomponent
 * 
 * PORTING NOTES FOR UNREAL ENGINE / SLATE:
 * - Displays in-game notification logs (e.g. pickup, mission alerts).
 * - Maps to an `SVerticalBox` containing notification items.
 * - Dynamic list rendering is best handled via an event listener in C++ that adds/removes widgets to a vertical scrollbox or container, with a timer to trigger fade-outs.
 */
import React from "react";

export function NotificationList({ showNotifications, notifications, colors }) {
  if (!showNotifications) return null;

  return (
    <div className="hud-notifications">
      {notifications.map((n) => {
         const typeClass = n.type || "system";
         return (
            <div 
              key={n.id} 
              className={`hud-notification ${typeClass} ${n.isRemoving ? "isRemoving" : ""}`}
            >
              {n.icon && <div className={`hud-notif-icon ${typeClass}`}>{n.icon}</div>}
              <div className="hud-notif-content">
                {n.title && <div className="hud-notif-title">{n.title}</div>}
                <div className="hud-notif-text">{n.text}</div>
              </div>
            </div>
         );
      })}
    </div>
  );
}
