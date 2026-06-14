/**
 * ObjectivePill.jsx - HUD Component
 * 
 * PORTING NOTES FOR UNREAL ENGINE / SLATE:
 * - This corresponds to an `SBorder` or `SBox` with rounded corners (set via `FSlateBrush` and `DrawAs=RoundedBox`).
 * - In React, the pulsating dot is handled by CSS `@keyframes` animations. In UMG/Slate, this is best implemented by a UMG widget animation that loops on an `SImage`'s render opacity and transform scale.
 * - This widget must read the current active `UMissionObjective` object.
 */
import { useState, useEffect } from "react";
import "./components.css";

export default function ObjectivePill({ objective, areaContext, uiLayout = "desktop" }) {
  const isPhone = uiLayout === "phone";
  const [state, setState] = useState("visible"); // hidden, dot, expanding, visible, collapsing, poof
  const [contentVisible, setContentVisible] = useState(true);
  
  const [displayType, setDisplayType] = useState("objective");
  const [displayTitle, setDisplayTitle] = useState("CURRENT OBJECTIVE");
  const [displayDesc, setDisplayDesc] = useState("Locate the Missing Data Drive");
  const [displayValue, setDisplayValue] = useState("1254m");
  
  const [distance, setDistance] = useState(1254);
  const [speed, setSpeed] = useState(45);
  const [timeSeconds, setTimeSeconds] = useState(0);

  const [lastContextName, setLastContextName] = useState(areaContext?.name);

  // Timer states (milliseconds)
  const [timeLeft, setTimeLeft] = useState(8000);
  const [duration, setDuration] = useState(8000);

  // Interval tickers for dynamic values
  useEffect(() => {
    const interval = setInterval(() => {
      setDistance(prev => {
        if (prev <= 10) return 1254;
        return prev - Math.floor(Math.random() * 3) - 1;
      });

      setSpeed(prev => {
        const delta = Math.floor(Math.random() * 9) - 4;
        const next = prev + delta;
        return Math.max(32, Math.min(next, 78));
      });

      setTimeSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Core function to calculate text length, set timer, and trigger animations
  const triggerPill = (type, titleText, descText, valText) => {
    setContentVisible(false);
    
    // Calculate display duration based on character count: 120ms per char, minimum 5 seconds
    const textLength = (titleText || "").length + (descText || "").length + (valText || "").length;
    const computedDuration = Math.max(5500, textLength * 120);

    setTimeout(() => {
      setDisplayType(type);
      setDisplayTitle(titleText);
      setDisplayDesc(descText);
      setDisplayValue(valText);
      
      setDuration(computedDuration);
      setTimeLeft(computedDuration);
      setState("visible");
      setContentVisible(true);
    }, 300);
  };

  // Watch for objective changes from props
  useEffect(() => {
    if (objective) {
      triggerPill(
        "objective",
        "CURRENT OBJECTIVE",
        objective.title || "Locate the Missing Data Drive",
        `${distance}m`
      );
    } else {
      setState("hidden");
    }
  }, [objective, objective?.title]);

  // Watch for area/vehicle context changes to display dynamic zone announcements
  useEffect(() => {
    if (areaContext && areaContext.name !== lastContextName) {
      setLastContextName(areaContext.name);
      
      const title = areaContext.type === 'vehicle' ? "VEHICLE BOARDED" : "NEW ZONE ENTERED";
      const desc = areaContext.name;
      const val = areaContext.type === 'vehicle' ? `${speed} km/h` : `Active: ${timeSeconds}s`;
      
      triggerPill("context", title, desc, val);
      setTimeSeconds(0);
    }
  }, [areaContext, areaContext?.name]);

  // Keep dynamic values ticking in real-time
  useEffect(() => {
    if (state === "visible" && contentVisible) {
      if (displayType === "objective") {
        setDisplayValue(`${distance}m`);
      } else if (displayType === "context") {
        if (areaContext?.type === 'vehicle') {
          setDisplayValue(`${speed} km/h`);
        } else {
          setDisplayValue(`Active: ${timeSeconds}s`);
        }
      }
    }
  }, [distance, speed, timeSeconds, displayType, state, contentVisible, areaContext]);

  // Timer countdown countdown logic
  useEffect(() => {
    if (state !== "visible" || timeLeft <= 0) return;

    const tickRate = 50; // butter-smooth updates
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const next = prev - tickRate;
        if (next <= 0) {
          clearInterval(timer);
          handleTimerExpired();
          return 0;
        }
        return next;
      });
    }, tickRate);

    return () => clearInterval(timer);
  }, [state, timeLeft, duration]);

  const handleTimerExpired = () => {
    setContentVisible(false);
    
    setTimeout(() => {
      // If we finished a temporary area context display and there is an active objective, revert to it
      if (displayType === "context" && objective) {
        triggerPill(
          "objective",
          "CURRENT OBJECTIVE",
          objective.title || "Locate the Missing Data Drive",
          `${distance}m`
        );
      } else {
        // Otherwise collapse completely
        setState("hidden");
      }
    }, 300);
  };

  const wrapperClass = `pill-wrapper ${
    state === "hidden" ? "state-hidden" :
    state === "dot" ? "state-dot" :
    state === "expanding" || state === "visible" ? "state-expanded" :
    state === "collapsing" ? "state-expanded" :
    state === "poof" ? "state-poof" : ""
  }`;

  return (
    <div className="objective-pill-container" style={{ pointerEvents: "auto" }}>
      <div className={wrapperClass} style={{ position: "relative" }}>
        
        {/* Depleting visual timer progress bar at the bottom edge */}
        {state === "visible" && (
          <div 
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              height: "3px",
              background: "linear-gradient(90deg, var(--color-accent) 0%, #ffaa44 100%)",
              width: `${Math.max(0, Math.min(100, (timeLeft / duration) * 100))}%`,
              boxShadow: "0 0 8px var(--color-accent)",
              transition: "width 0.05s linear",
              zIndex: 10
            }} 
          />
        )}

        <div className={`pill-content ${contentVisible ? "content-visible" : "content-hidden"}`}>
          <div className="pill-label">{displayTitle}</div>
          <div className="pill-title">{displayDesc}</div>
          <div className="pill-footer">
            <div className="pill-footer-dot" />
            <span className="pill-distance">{displayValue}</span>
            <span style={{ 
              marginLeft: "12px", 
              fontSize: "10px", 
              fontFamily: "'IBM Plex Mono', monospace", 
              color: "var(--color-accent)",
              opacity: 0.85,
              fontWeight: 600
            }}>
              ⏱ {(timeLeft / 1000).toFixed(1)}s
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
