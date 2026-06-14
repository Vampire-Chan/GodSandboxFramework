import { useState, useEffect } from "react";
import Startup from "./components/Startup";
import MainMenu from "./components/MainMenu";
import LoadingScreen from "./components/LoadingScreen";
import HUD from "./components/HUD";
import PauseMenu from "./components/PauseMenu";

import DialogueBox from "./components/DialogueBox";
import InteractionMenu from "./components/InteractionMenu";

import "./themes.css";
import "./App.css";

/**
 * ============================================================================
 * JUSTLIVE - MAIN APPLICATION ENTRY (MOCKUP)
 * ============================================================================
 */

export default function App({ onExit }) {
  // Navigation State
  const [screen, setScreen] = useState("STARTUP");
  const [dialogueVisible, setDialogueVisible] = useState(false);
  
  // INTERACTION MENU STATE
  const [interactionMenuOpen, setInteractionMenuOpen] = useState(false);
  const [imAnchor, setImAnchor] = useState("left"); // Can be "left" or "right"

  // UI Layout Mode (desktop vs phone)
  const [uiLayout, setUiLayout] = useState("desktop");
  const [isTransitioningLayout, setIsTransitioningLayout] = useState(false);

  const handleLayoutChange = (newLayout) => {
    if (newLayout === uiLayout) return;
    setIsTransitioningLayout(true);
    // Switch the layout at the peak of the black screen fade (300ms)
    setTimeout(() => {
      setUiLayout(newLayout);
    }, 300);
    // Finish transition after 600ms
    setTimeout(() => {
      setIsTransitioningLayout(false);
    }, 600);
  };

  // LOGIC: Check if the "Game World" should be rendered/simulated in background
  const isPlaying = ["HUD", "PAUSE", "EDITOR"].includes(screen);

  // ── GLOBAL KEY HANDLERS ──────────────────────────────────────────────────
  useEffect(() => {
    const handleGlobalKey = (e) => {
      // Toggle Interaction Menu with F5
      if (e.key === "F5") {
        e.preventDefault();
        if (screen === "HUD") {
          setInteractionMenuOpen(prev => !prev);
        }
      }
      
      // OPTIONAL: Toggle side with F6 for testing purposes
      if (e.key === "F6") {
        setImAnchor(prev => prev === "left" ? "right" : "left");
      }
    };
    window.addEventListener("keydown", handleGlobalKey);
    return () => window.removeEventListener("keydown", handleGlobalKey);
  }, [screen]);

  return (
    <div className="mockup-root-container" style={{ width: "100%", height: "100%", overflow: "hidden", backgroundColor: "#000", position: "relative" }}>
      
      {/* Persistent Floating Back Button to return to Website */}
      <button 
        onClick={onExit}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          zIndex: 9999,
          background: "rgba(20, 20, 20, 0.85)",
          border: "1px solid #c8721f",
          color: "#fff",
          padding: "8px 16px",
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: "13px",
          fontWeight: 700,
          cursor: "pointer",
          letterSpacing: "1px",
          clipPath: "polygon(4px 0%, 100% 0%, calc(100% - 4px) 100%, 0% 100%)",
          transition: "all 0.15s ease",
          boxShadow: "0 0 10px rgba(0,0,0,0.5)"
        }}
        onMouseEnter={(e) => {
          e.target.style.background = "#c8721f";
          e.target.style.boxShadow = "0 0 15px rgba(200, 114, 31, 0.4)";
        }}
        onMouseLeave={(e) => {
          e.target.style.background = "rgba(20, 20, 20, 0.85)";
          e.target.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";
        }}
      >
        ✕ EXIT DEMO
      </button>

      {/* 1. STARTUP SEQUENCE */}
      {screen === "STARTUP" && <Startup onComplete={() => setScreen("MAIN_MENU")} />}
      
      {/* 2. PRIMARY UI LAYER */}
      {screen === "MAIN_MENU" && (
        <MainMenu 
          onAction={(action) => {
            if (action === "continue" || action === "new" || action === "load") {
              setScreen("LOADING");
            } else if (action === "quit") {
              if (onExit) onExit();
              else alert("Quit to Desktop");
            }
          }} 
        />
      )}

      {/* 3. TRANSITION LAYER */}
      {screen === "LOADING" && <LoadingScreen onComplete={() => setScreen("HUD")} />}

      {/* 4. ACTIVE GAME LAYER (HUD + WORLD) */}
      {isPlaying && (
        <div style={{ position: "absolute", inset: 0 }}>
          
          {/* SIMULATED WORLD RENDER */}
          <div style={{ 
            position: "absolute", inset: 0, 
            background: "linear-gradient(to bottom, #111, #222)",
            display: "flex", alignItems: "center", justifyContent: "center",
            opacity: screen === "HUD" ? 1 : 0.4 // Dims when paused or in editor
          }}>
            <h2 style={{ color: "rgba(255,255,255,0.05)", fontSize: "5rem", fontFamily: "'Rajdhani', sans-serif" }}>WORLD RENDER</h2>
          </div>

          {/* HUD LAYER: Accepts 'suppressed' prop when Interaction Menu is active */}
          {screen === "HUD" && (
            <HUD 
              onAction={(action) => {
                if (action === "open_pause") setScreen("PAUSE");
                if (action === "toggle_phone") setInteractionMenuOpen(prev => !prev);
              }}
              onDialogueTest={() => setDialogueVisible(true)}
              suppressed={interactionMenuOpen}
              uiLayout={uiLayout}
            />
          )}
        </div>
      )}

      {/* 5. OVERLAY LAYERS (Modals, Interaction Menus) */}
      
      {screen === "HUD" && (
        <InteractionMenu 
          isOpen={interactionMenuOpen} 
          onClose={() => setInteractionMenuOpen(false)} 
          anchor={imAnchor}
          uiLayout={uiLayout}
          onLayoutChange={handleLayoutChange}
        />
      )}

      {screen === "PAUSE" && (
        <PauseMenu 
          onResume={() => setScreen("HUD")}
          onQuit={() => setScreen("MAIN_MENU")}
        />
      )}


      {/* 6. GLOBAL DIALOGUE OVERLAY */}
      {dialogueVisible && (
        <DialogueBox
          title="Confirm Action"
          subtitle="— SYSTEM PROMPT —"
          message="System status OK. Awaiting further commands."
          buttons={[
            { label: "Cancel", variant: "secondary", onClick: () => setDialogueVisible(false) },
            { label: "Initialize", variant: "success", onClick: () => setDialogueVisible(false) },
          ]}
          onClose={() => setDialogueVisible(false)}
        />
      )}
      
      {/* Cinematic Screen Fade Overlay for Layout Switching */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#000",
        zIndex: 99999,
        pointerEvents: "none",
        opacity: isTransitioningLayout ? 1 : 0,
        transition: "opacity 0.3s ease-in-out"
      }} />

    </div>
  );
}
