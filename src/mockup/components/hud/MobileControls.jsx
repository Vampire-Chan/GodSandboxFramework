/**
 * MobileControls.jsx - HUD Component
 * 
 * Simulated virtual joystick and touch action buttons for mobile layout.
 * Includes interactive mouse/touch dragging physics and visual feedback.
 */
import { useState, useEffect, useRef } from "react";

export function MobileControls({ 
  onShoot, 
  onAim, 
  onReload, 
  onJump, 
  onCrouch, 
  onProne, 
  onPullPhone,
  isAiming = false,
  movementState = "idle" // "idle", "walking", "running"
}) {
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [activeActions, setActiveActions] = useState({
    shoot: false,
    aim: false,
    jump: false,
    crouch: false,
    prone: false,
    phone: false
  });
  
  const joystickRef = useRef(null);
  const maxRadius = 45; // Max drag radius in pixels

  const handleStart = (e) => {
    setIsDragging(true);
    updateJoystick(e);
  };

  const handleMove = (e) => {
    if (!isDragging) return;
    updateJoystick(e);
  };

  const handleEnd = () => {
    setIsDragging(false);
    setJoystickPos({ x: 0, y: 0 });
  };

  const updateJoystick = (e) => {
    if (!joystickRef.current) return;
    const rect = joystickRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Get mouse/touch coordinates
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    let deltaX = clientX - centerX;
    let deltaY = clientY - centerY;
    
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    if (distance > maxRadius) {
      const angle = Math.atan2(deltaY, deltaX);
      deltaX = Math.cos(angle) * maxRadius;
      deltaY = Math.sin(angle) * maxRadius;
    }
    
    setJoystickPos({ x: deltaX, y: deltaY });
  };

  // Add event listeners for mouse up outside the container when dragging
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleEnd);
      window.addEventListener("touchmove", handleMove, { passive: false });
      window.addEventListener("touchend", handleEnd);
    }
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging]);

  const triggerAction = (actionKey, callback) => {
    setActiveActions(prev => ({ ...prev, [actionKey]: true }));
    if (callback) callback();
    
    // Auto reset visual active state after a brief moment if it's a transient action (like shoot or jump)
    if (actionKey !== "aim" && actionKey !== "crouch" && actionKey !== "prone") {
      setTimeout(() => {
        setActiveActions(prev => ({ ...prev, [actionKey]: false }));
      }, 150);
    }
  };

  // Toggle buttons logic for persistent states
  const handleToggleAction = (actionKey, callback, activeState) => {
    setActiveActions(prev => ({ ...prev, [actionKey]: !activeState }));
    if (callback) callback();
  };

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 50 }}>
      
      {/* ================= BOTTOM LEFT: JOYSTICK ================= */}
      <div 
        style={{
          position: "absolute",
          bottom: "40px",
          left: "60px",
          width: "130px",
          height: "130px",
          background: "rgba(10, 12, 16, 0.45)",
          border: "2px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "auto",
          touchAction: "none",
          backdropFilter: "blur(6px)",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4), inset 0 0 15px rgba(255, 255, 255, 0.02)",
          cursor: "grab"
        }}
        ref={joystickRef}
        onMouseDown={handleStart}
        onTouchStart={handleStart}
      >
        {/* Direction Indicator Labels */}
        <div style={{ position: "absolute", top: "8px", fontSize: "9px", fontFamily: "monospace", color: "rgba(255,255,255,0.25)", fontWeight: "bold" }}>W</div>
        <div style={{ position: "absolute", bottom: "8px", fontSize: "9px", fontFamily: "monospace", color: "rgba(255,255,255,0.25)", fontWeight: "bold" }}>S</div>
        <div style={{ position: "absolute", left: "8px", fontSize: "9px", fontFamily: "monospace", color: "rgba(255,255,255,0.25)", fontWeight: "bold" }}>A</div>
        <div style={{ position: "absolute", right: "8px", fontSize: "9px", fontFamily: "monospace", color: "rgba(255,255,255,0.25)", fontWeight: "bold" }}>D</div>

        {/* Outer concentric rings */}
        <div style={{
          position: "absolute",
          width: "80px",
          height: "80px",
          border: "1px dashed rgba(255, 255, 255, 0.05)",
          borderRadius: "50%"
        }} />

        {/* Joystick Handle */}
        <div 
          style={{
            width: "52px",
            height: "52px",
            background: isDragging 
              ? "linear-gradient(135deg, var(--color-accent) 0%, #e08030 100%)" 
              : "rgba(255, 255, 255, 0.12)",
            border: isDragging 
              ? "2.5px solid #fff" 
              : "2.5px solid rgba(255, 255, 255, 0.25)",
            borderRadius: "50%",
            transform: `translate(${joystickPos.x}px, ${joystickPos.y}px)`,
            transition: isDragging ? "none" : "transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            boxShadow: isDragging 
              ? "0 4px 15px rgba(200, 114, 31, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.2)"
              : "0 2px 8px rgba(0, 0, 0, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {/* Inner core circle */}
          <div style={{
            width: "16px",
            height: "16px",
            background: isDragging ? "#fff" : "rgba(255, 255, 255, 0.4)",
            borderRadius: "50%"
          }} />
        </div>
      </div>

      {/* ================= BOTTOM RIGHT: ACTION BUTTONS CLUSTER ================= */}
      <div 
        style={{
          position: "absolute",
          bottom: "30px",
          right: "40px",
          width: "280px",
          height: "240px",
          pointerEvents: "none"
        }}
      >
        {/* SHOOT BUTTON (Large Primary) */}
        <button 
          onMouseDown={() => triggerAction("shoot", onShoot)}
          onTouchStart={() => triggerAction("shoot", onShoot)}
          style={{
            position: "absolute",
            bottom: "45px",
            right: "45px",
            width: "78px",
            height: "78px",
            background: "linear-gradient(135deg, #a83428 0%, #d32f2f 100%)",
            border: "2px solid rgba(255, 255, 255, 0.3)",
            borderRadius: "50%",
            color: "#fff",
            fontSize: "26px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 6px 20px rgba(168, 52, 40, 0.5), inset 0 0 10px rgba(255, 255, 255, 0.2)",
            cursor: "pointer",
            pointerEvents: "auto",
            transform: activeActions.shoot ? "scale(0.9)" : "scale(1)",
            transition: "transform 0.08s ease, background 0.15s ease",
            userSelect: "none",
            touchAction: "none"
          }}
        >
          🔥
        </button>

        {/* AIM BUTTON (Scope) */}
        <button 
          onClick={() => handleToggleAction("aim", onAim, isAiming)}
          style={{
            position: "absolute",
            bottom: "135px",
            right: "35px",
            width: "52px",
            height: "52px",
            background: isAiming 
              ? "linear-gradient(135deg, var(--color-accent) 0%, #e08030 100%)" 
              : "rgba(10, 12, 16, 0.6)",
            border: isAiming 
              ? "2px solid #fff" 
              : "1.5px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "50%",
            color: isAiming ? "#fff" : "var(--color-text-bright)",
            fontSize: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: isAiming 
              ? "0 4px 12px rgba(200, 114, 31, 0.5)" 
              : "0 4px 10px rgba(0, 0, 0, 0.3)",
            cursor: "pointer",
            pointerEvents: "auto",
            transform: activeActions.aim ? "scale(0.9)" : "scale(1)",
            transition: "transform 0.08s ease, background 0.15s ease",
            userSelect: "none",
            touchAction: "none"
          }}
        >
          🎯
        </button>

        {/* JUMP BUTTON */}
        <button 
          onMouseDown={() => triggerAction("jump", onJump)}
          onTouchStart={() => triggerAction("jump", onJump)}
          style={{
            position: "absolute",
            bottom: "25px",
            right: "145px",
            width: "50px",
            height: "50px",
            background: "rgba(10, 12, 16, 0.6)",
            border: "1.5px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "50%",
            color: "var(--color-text-bright)",
            fontSize: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
            cursor: "pointer",
            pointerEvents: "auto",
            transform: activeActions.jump ? "scale(0.9)" : "scale(1)",
            transition: "transform 0.08s ease",
            userSelect: "none",
            touchAction: "none"
          }}
        >
          ⬆️
        </button>

        {/* CROUCH BUTTON (Toggleable) */}
        <button 
          onClick={() => triggerAction("crouch", onCrouch)}
          style={{
            position: "absolute",
            bottom: "90px",
            right: "145px",
            width: "48px",
            height: "48px",
            background: movementState === "crouched" 
              ? "rgba(200, 114, 31, 0.35)" 
              : "rgba(10, 12, 16, 0.6)",
            border: movementState === "crouched"
              ? "1.5px solid var(--color-accent)"
              : "1.5px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "50%",
            color: movementState === "crouched" ? "var(--color-accent)" : "var(--color-text-bright)",
            fontSize: "15px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
            cursor: "pointer",
            pointerEvents: "auto",
            transition: "all 0.15s ease",
            userSelect: "none",
            touchAction: "none"
          }}
        >
          🧘
        </button>

        {/* PRONE BUTTON (Toggleable) */}
        <button 
          onClick={() => triggerAction("prone", onProne)}
          style={{
            position: "absolute",
            bottom: "150px",
            right: "125px",
            width: "46px",
            height: "46px",
            background: movementState === "prone" 
              ? "rgba(200, 114, 31, 0.35)" 
              : "rgba(10, 12, 16, 0.6)",
            border: movementState === "prone"
              ? "1.5px solid var(--color-accent)"
              : "1.5px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "50%",
            color: movementState === "prone" ? "var(--color-accent)" : "var(--color-text-bright)",
            fontSize: "14px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
            cursor: "pointer",
            pointerEvents: "auto",
            transition: "all 0.15s ease",
            userSelect: "none",
            touchAction: "none"
          }}
        >
          🛏️
        </button>

        {/* PHONE BUTTON (Trigger Phone UI) */}
        <button 
          onClick={() => triggerAction("phone", onPullPhone)}
          style={{
            position: "absolute",
            bottom: "200px",
            right: "75px",
            width: "48px",
            height: "48px",
            background: "rgba(10, 12, 16, 0.65)",
            border: "1.5px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "50%",
            color: "var(--color-text-bright)",
            fontSize: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
            cursor: "pointer",
            pointerEvents: "auto",
            transform: activeActions.phone ? "scale(0.9)" : "scale(1)",
            transition: "transform 0.08s ease, background 0.15s ease",
            userSelect: "none",
            touchAction: "none"
          }}
          title="Pull Phone"
        >
          📱
        </button>
      </div>

      {/* Floating State Banner / Debug Logging for user visual feedback */}
      <div 
        style={{
          position: "absolute",
          bottom: "24px",
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "11px",
          color: "rgba(255,255,255,0.4)",
          textTransform: "uppercase",
          letterSpacing: "1.5px"
        }}
      >
        Touch Controls Active
      </div>
    </div>
  );
}
