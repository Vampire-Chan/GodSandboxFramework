/**
 * InteractionMenu.jsx - Radial Action Menu
 * 
 * PORTING NOTES FOR UNREAL ENGINE / SLATE:
 * - Radial menus are notoriously tricky in standard UMG. You typically create a custom `UWidget` (or `SWidget` subclass) that overrides `OnPaint` to draw the pie slices using `FSlateDrawElement::MakeLines` or custom geometry.
 * - The math calculating angles (`Math.atan2`) must translate to C++ `FMath::Atan2` to determine which slice the mouse/thumbstick is hovering over.
 * - This widget must intercept input while open, which means setting `bIsFocusable = true` and intercepting thumbstick/mouse movement axes.
 * - When an item is selected, a delegate fires back to the `TaskManager` or `PedManager` to execute the selected task (e.g., "Arrest", "Talk").
 */
import { useState, useEffect, useRef } from "react";
import { InteractionItem } from "./common/InteractionItem";
import "./components.css";

/**
 * ============================================================================
 * JUSTLIVE - ROCKSTAR STYLED INTERACTION MENU (V2.5: ARCHITECTURAL FINAL)
 * ============================================================================
 * 
 * ARCHITECTURAL OVERVIEW:
 * This component is designed as a "Stateful Hierarchical Stack". It mimics the 
 * deep-nested menu systems of Rockstar games while adhering to the JustLive 
 * "C++ First, XML Driven" design philosophy (replicated here in React).
 * 
 * DESIGN DECISIONS:
 * 1.  MENU STACK (History): We use an array ['root', 'sub'] to track depth. 
 *     This allows for infinite nesting and easy "Back" navigation.
 * 2.  FLAT DATA STRUCTURE: MENU_DATA is organized by keys (root, vehicles, etc.). 
 *     This makes lookups O(1) and simplifies sub-menu transitions.
 * 3.  PRIORITY RENDERING: Controls (Pickers/Sliders) are prioritized over labels.
 *     If text is long, it wraps to the next line to keep controls visible.
 * 4.  MIRRORED ANCHORING: The 'anchor' prop (left/right) dictates CSS classing 
 *     for both the physical position and the sliding animation direction.
 * 
 * ============================================================================
 */

const MENU_DATA = {
  root: {
    title: "INTERACTION",
    items: [
      { id: "spawn_vehicle", label: "VEHICLES", type: "folder", target: "vehicles", sub: "Request or manage active rides", icon: "🚗" },
      { id: "inventory", label: "INVENTORY", type: "folder", target: "inventory", sub: "Armor, health, and equipment", icon: "🎒" },
      { id: "ui_layout", label: "UI LAYOUT", type: "picker", options: ["Desktop", "Phone"], value: 0, sub: "Toggle in-game screen configuration", icon: "📱" },
      { id: "radio_volume", label: "RADIO VOLUME", type: "slider", min: 0, max: 100, value: 75, sub: "Adjust vehicle entertainment levels", icon: "📻" },
      { id: "voice_chat", label: "VOICE CHAT", type: "toggle", value: true, sub: "Toggle proximity communications", icon: "🎙" },
      { id: "quick_emote", label: "QUICK EMOTE", type: "picker", options: ["Wave", "Salute", "Point", "Smoke", "Drink"], value: 0, sub: "Execute rapid social gesture", icon: "👋" },
      { id: "passive_mode", label: "PASSIVE MODE", type: "button", sub: "Disable combat interactions", icon: "🏳" },
    ]
  },
  vehicles: {
    title: "VEHICLES",
    items: [
      { id: "request_delivery", label: "REQUEST ACTIVE", type: "button", sub: "Call your current personal vehicle", icon: "📦" },
      { id: "sel_vehicle", label: "SELECT VEHICLE", type: "picker", options: ["Innova", "M4 Coupe", "T20 Super", "Buffalo STX"], value: 0, sub: "Switch active personal vehicle", icon: "🚗" },
      { id: "empty_veh", label: "EMPTY VEHICLE", type: "button", sub: "Kick all passengers out", icon: "🚪" },
      { id: "door_control", label: "DOOR CONTROL", type: "folder", target: "doors", sub: "Manage specific vehicle doors", icon: "🎮" },
    ]
  },
  inventory: {
    title: "INVENTORY",
    items: [
      { id: "armor_type", label: "EQUIP ARMOR", type: "picker", options: ["None", "Light", "Standard", "Heavy", "Super Heavy"], value: 2, sub: "Select protection level", icon: "🛡" },
      { id: "health_kit", label: "USE MEDKIT", type: "button", sub: "Consume medkit to restore HP", icon: "💊" },
      { id: "helmet_visor", label: "HELMET VISOR", type: "toggle", value: false, sub: "Open or close active visor", icon: "🪖" },
    ]
  },
  doors: {
    title: "DOOR CONTROL",
    items: [
      { id: "door_all", label: "ALL DOORS", type: "button", sub: "Open or close everything", icon: "📂" },
      { id: "door_hood", label: "HOOD", type: "toggle", value: false, sub: "Access engine bay", icon: "🔧" },
      { id: "door_trunk", label: "TRUNK", type: "toggle", value: false, sub: "Access storage", icon: "📦" },
    ]
  }
};

export default function InteractionMenu({ isOpen, onClose, anchor = "left", uiLayout = "desktop", onLayoutChange }) {
  // Navigation stack: ['root', 'sub_menu_id']
  const [history, setHistory] = useState(["root"]);
  // State for all menu items across all levels (mimics a runtime database)
  const [menuItemsState, setMenuItemsState] = useState(MENU_DATA);
  // Current selection index within the active menu
  const [selectedIndex, setSelectedIndex] = useState(0);
  // Ref for the scrollable list to handle auto-scrolling
  const listRef = useRef(null);

  const currentKey = history[history.length - 1];
  const currentMenu = menuItemsState[currentKey];

  // Sync menu state picker value with layout changes from parent
  useEffect(() => {
    const layoutIdx = uiLayout === "desktop" ? 0 : 1;
    setMenuItemsState(prev => {
      const rootItems = prev.root.items.map(item => {
        if (item.id === "ui_layout" && item.value !== layoutIdx) {
          return { ...item, value: layoutIdx };
        }
        return item;
      });
      return {
        ...prev,
        root: { ...prev.root, items: rootItems }
      };
    });
  }, [uiLayout]);

  /**
   * Updates the value of a specific item in the menu database.
   * This handles all interactive types (Pickers, Sliders, Toggles).
   */
  const updateItemValue = (menuId, itemId, newValue) => {
    setMenuItemsState(prev => ({
      ...prev,
      [menuId]: {
        ...prev[menuId],
        items: prev[menuId].items.map(item => 
          item.id === itemId ? { ...item, value: newValue } : item
        )
      }
    }));

    if (itemId === "ui_layout" && onLayoutChange) {
      onLayoutChange(newValue === 0 ? "desktop" : "phone");
    }
  };

  /**
   * Pops the current menu from the stack or closes the menu if at root.
   */
  const handleBack = () => {
    if (history.length > 1) {
      setHistory(prev => prev.slice(0, -1));
      setSelectedIndex(0); // Reset selection for cleaner feel
    } else {
      onClose();
    }
  };

  // ── KEYBOARD INTERFACE ────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e) => {
      const activeItem = currentMenu.items[selectedIndex];

      // Vertical Navigation
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : currentMenu.items.length - 1));
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(prev => (prev < currentMenu.items.length - 1 ? prev + 1 : 0));
      } 
      
      // Horizontal Interaction (Sliders, Pickers, Toggles)
      else if (e.key === "ArrowLeft") {
        if (activeItem.type === "picker") {
          const nextVal = activeItem.value > 0 ? activeItem.value - 1 : activeItem.options.length - 1;
          updateItemValue(currentKey, activeItem.id, nextVal);
        } else if (activeItem.type === "slider") {
          updateItemValue(currentKey, activeItem.id, Math.max(activeItem.min, activeItem.value - 5));
        } else if (activeItem.type === "toggle") {
          updateItemValue(currentKey, activeItem.id, !activeItem.value);
        }
      } else if (e.key === "ArrowRight") {
        if (activeItem.type === "picker") {
          const nextVal = activeItem.value < activeItem.options.length - 1 ? activeItem.value + 1 : 0;
          updateItemValue(currentKey, activeItem.id, nextVal);
        } else if (activeItem.type === "slider") {
          updateItemValue(currentKey, activeItem.id, Math.min(activeItem.max, activeItem.value + 5));
        } else if (activeItem.type === "toggle") {
          updateItemValue(currentKey, activeItem.id, !activeItem.value);
        }
      } 
      
      // Primary Actions
      else if (e.key === "Enter") {
        if (activeItem.type === "folder") {
          setHistory(prev => [...prev, activeItem.target]);
          setSelectedIndex(0);
        } else if (activeItem.type === "button") {
          console.log("Interaction Triggered:", activeItem.label);
        } else if (activeItem.type === "toggle") {
          updateItemValue(currentKey, activeItem.id, !activeItem.value);
        }
      } 
      
      // Secondary Actions
      else if (e.key === "Backspace") {
        e.preventDefault();
        handleBack();
      } else if (e.key === "Escape" || e.key === "F5") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, selectedIndex, currentKey, currentMenu, onClose]);

  // ── AUTO-SCROLL BEHAVIOR ─────────────────────────────────────────────────
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.children[selectedIndex];
      if (activeEl) {
        // Keeps the selection arrow visible and items within the viewport container
        activeEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [selectedIndex, currentKey]);

  if (!isOpen) return null;

  return (
    <div className={`im-root im-anchor-${anchor}`}>
      {/* 
          im-shell: The main container.
          animate-slide-in: Handles the side-aware entry animation.
      */}
      <div className="im-shell animate-slide-in">
        
        {/* HEADER: Dynamic Title and Breadcrumbs */}
        <div className="im-header">
          <div className="im-header-title">{currentMenu.title}</div>
          <div className="im-header-sub">
            {history.length > 1 
              ? `‹ BACK TO ${menuItemsState[history[history.length-2]].title}` 
              : "Viktor Dren — Street Medic"}
          </div>
          <div className="im-header-bar" />
        </div>

        {/* LIST: Contains all items for the current level */}
        <div className="im-list" ref={listRef}>
          {currentMenu.items.map((item, idx) => (
            <InteractionItem
              key={item.id}
              item={item}
              isActive={selectedIndex === idx}
              onSelect={() => setSelectedIndex(idx)}
              onArrowLeft={() => {
                if (item.type === "picker") {
                  const nextVal = item.value > 0 ? item.value - 1 : item.options.length - 1;
                  updateItemValue(currentKey, item.id, nextVal);
                } else if (item.type === "slider") {
                  updateItemValue(currentKey, item.id, Math.max(item.min, item.value - 5));
                } else if (item.type === "toggle") {
                  updateItemValue(currentKey, item.id, !item.value);
                }
              }}
              onArrowRight={() => {
                if (item.type === "picker") {
                  const nextVal = item.value < item.options.length - 1 ? item.value + 1 : 0;
                  updateItemValue(currentKey, item.id, nextVal);
                } else if (item.type === "slider") {
                  updateItemValue(currentKey, item.id, Math.min(item.max, item.value + 5));
                } else if (item.type === "toggle") {
                  updateItemValue(currentKey, item.id, !item.value);
                }
              }}
            />
          ))}
        </div>

        {/* FOOTER: Controls Hints */}
        <div className="im-footer">
          <div className="im-hint">
            <span className="im-key">↑↓</span> NAV 
            <span className="im-key">←→</span> ADJ 
            <span className="im-key">ENT</span> {currentMenu.items[selectedIndex]?.type === "folder" ? "OPEN" : "EXEC"} 
            <span className="im-key">BS</span> BACK
          </div>
        </div>

      </div>

      {/* Backdrop: Subtle world dimming with click-to-close */}
      <div className="im-backdrop" onClick={onClose} />
    </div>
  );
}
