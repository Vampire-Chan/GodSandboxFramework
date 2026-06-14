/**
 * Startup.jsx - Initial Boot Sequence UI
 * 
 * PORTING NOTES FOR UNREAL ENGINE / SLATE:
 * - This plays before the main menu. It usually loads independently during GameInstance initialization.
 * - In Unreal Engine, startup logos are often played via Startup Movies in Project Settings, or by a dedicated Level Sequence.
 * - If done in UMG, it's a series of `SImage` widgets fading in and out using UMG Animations or C++ tick interpolation on Opacity.
 * - React uses `setTimeout` chains. In C++, you would use `FTimerManager` to sequence the state transitions (e.g., Logo 1 -> Logo 2 -> Loading Screen).
 *
 * SPARKS — Slate port:
 *   Each spark is a FSlateDrawElement::MakeBox (2px solid FLinearColor gold).
 *   Positions are updated via FSlateActiveTimerRegistration + elapsed time math.
 *   12 sparks with randomised drift/duration — stored in a TArray<FSparkState> struct.
 */
import { useEffect, useState } from "react";
import "./components.css";

// Fixed spark definitions — deterministic so no hydration issues.
// Each spark: left position (%), CSS custom properties for animation timing + drift.
// Slate equivalent: TArray<FSparkDef> { float Left, float Dur, float Delay, float Drift }
const SPARKS = [
  { left: "8%",  dur: "6.2s", delay: "0.0s", drift: "14px"  },
  { left: "15%", dur: "4.8s", delay: "0.7s", drift: "-10px" },
  { left: "23%", dur: "7.1s", delay: "1.4s", drift: "22px"  },
  { left: "31%", dur: "5.3s", delay: "0.2s", drift: "-18px" },
  { left: "42%", dur: "6.8s", delay: "2.1s", drift: "8px"   },
  { left: "50%", dur: "4.5s", delay: "0.9s", drift: "-6px"  },
  { left: "58%", dur: "7.4s", delay: "1.8s", drift: "20px"  },
  { left: "66%", dur: "5.6s", delay: "0.4s", drift: "-24px" },
  { left: "74%", dur: "6.0s", delay: "2.5s", drift: "12px"  },
  { left: "82%", dur: "4.9s", delay: "1.1s", drift: "-14px" },
  { left: "90%", dur: "7.8s", delay: "0.6s", drift: "18px"  },
  { left: "97%", dur: "5.1s", delay: "1.9s", drift: "-8px"  },
];

export default function Startup({ onComplete }) {
  const [step, setStep] = useState(0);

  // Sequence: Engine logo (0) → JustLive title (1) → Press any key (2)
  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 2000);
    const t2 = setTimeout(() => setStep(2), 5000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Any key/click on step 2 triggers onComplete
  useEffect(() => {
    const handleKey = () => {
      if (step >= 2) onComplete();
    };
    window.addEventListener("keydown", handleKey);
    window.addEventListener("mousedown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("mousedown", handleKey);
    };
  }, [step, onComplete]);

  return (
    <div className="st-root">
      {/* Deep void + atmospheric gradient background */}
      <div className="st-bg" />

      {/* Floating gold sparks — drift from bottom to top continuously.
          Slate port: FSlateActiveTimerRegistration updates Y position each frame
          using elapsed time; each spark wrapped in an SLeafWidget with custom OnPaint. */}
      <div className="st-sparks" aria-hidden="true">
        {SPARKS.map((s, i) => (
          <div
            key={i}
            className="st-spark"
            style={{
              left: s.left,
              "--spark-dur":   s.dur,
              "--spark-delay": s.delay,
              "--spark-drift": s.drift,
              animationDuration:  s.dur,
              animationDelay:     s.delay,
            }}
          />
        ))}
      </div>

      {/* STEP 0: Engine logo */}
      {step === 0 && (
        <div className="st-content">
          <h1 className="st-title">UNREAL ENGINE</h1>
          <p className="st-subtitle">POWERED BY UE 5.7</p>
        </div>
      )}

      {/* STEP 1: JustLive title reveal — Cinzel gold gradient */}
      {step === 1 && (
        <div className="st-content">
          <h1 className="st-main-title">JUSTLIVE</h1>
          <p className="st-main-subtitle">A Data-Driven World</p>
        </div>
      )}

      {/* STEP 2: Press any key — pulsing gold framed prompt */}
      {step >= 2 && (
        <div className="st-content st-full-screen">
          <h1 className="st-title-large">JUSTLIVE</h1>
          <div style={{ position: "relative" }}>
            <p className="st-prompt">PRESS ANY KEY TO START</p>
          </div>
        </div>
      )}
    </div>
  );
}
