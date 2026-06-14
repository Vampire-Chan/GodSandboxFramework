/**
 * LoadingScreen.jsx — GTA 4-Style Loading Screen
 *
 * DESIGN INTENT:
 *   - Two-layer parallax: bg image (Ken Burns slow zoom-in, never zooms OUT)
 *     and a character/object cutout (loading_1a) pinned to the bottom of the screen.
 *   - The cutout can drift on X (slow parallax sway) but NEVER leaves the bottom Y edge.
 *   - Fade in / fade out like GTA 4 — a full-opacity black overlay fades out on mount
 *     and fades back in before onComplete fires.
 *   - No JustLive logo. The loading space is purely atmospheric visuals + info overlay.
 *   - Bottom-left: progress bar + current XML asset being streamed.
 *   - Bottom-right: area name currently loading for the player.
 *
 * PORTING NOTES FOR UNREAL ENGINE / SLATE:
 *   - Registered via FLoadingScreenAttributes / GetMoviePlayer() for level transitions.
 *   - Background image = FSlateBrush asset; Ken Burns = FSlateActiveTimerRegistration
 *     updating a UVTransform/scale on the brush each frame. Scale ONLY increases.
 *   - Cutout image = second FSlateBrush, bottom-anchored via SOverlay::Slot VAlign_Bottom.
 *     X drift = FMath::Sin(Elapsed * DriftSpeed) * MaxDrift pixels per frame.
 *   - Fade overlay = SBorder with FLinearColor opacity driven by ActiveTimer.
 *   - Progress bar = SJLSegmentedProgressBar (N-slot custom SLeafWidget).
 *   - XML stream text = TAttribute<FText> bound to UDataManager::GetCurrentStreamingAsset().
 *   - Area name = TAttribute<FText> bound to UWorldCycleManager::GetLoadingAreaName().
 */
import { useEffect, useRef, useState } from "react";
import "./components.css";

const C = {
  bg:         "#06050a",  accent:     "#d4a535",  accentDim: "#7a5c18",
  text:       "#c4bcd0",  textDim:    "#5a5068",  textBright:"#ece4f8",
  line:       "#26203a",  line2:      "#342c4a",
};

// Simulated XML asset stream — what DataManager is currently parsing
const XML_ASSETS = [
  "Assets.xml → Parsing PedDefinitions...",
  "Assets.xml → Loading WeaponStaticInfo...",
  "Peds.xml → Streaming LoadoutConfigs...",
  "TimeCycles.xml → Baking lighting zones...",
  "AnimationMovementSet.xml → Resolving BlendSpaces...",
  "ParticleNiagaras.xml → Registering VFX pools...",
  "AudioWeapons.xml → Loading SFX definitions...",
  "RagdollProfiles.xml → Compiling physics configs...",
  "Weapons.xml → Finalizing attachment tables...",
  "Finalizing sector stream...",
];

const AREAS = [
  "MILLHAVEN — SECTOR 01",
  "MILLHAVEN — SECTOR 01",
  "MILLHAVEN — DOCKS",
  "MILLHAVEN — DOWNTOWN",
  "MILLHAVEN — OUTSKIRTS",
];

// Placeholder colored gradient rectangles standing in for actual game images.
// In Unreal: swap for FSlateBrush pointing to @content/UI/LoadingScreens/loading_1.uasset
//            and @content/UI/LoadingScreens/loading_1a.uasset (cutout with alpha channel)
const BG_PLACEHOLDER_STYLE = {
  background: `
    radial-gradient(ellipse 60% 80% at 70% 60%, rgba(30, 20, 50, 0.9) 0%, transparent 70%),
    radial-gradient(ellipse 40% 60% at 20% 80%, rgba(10, 8, 18, 0.95) 0%, transparent 60%),
    linear-gradient(160deg, #0a0812 0%, #12101e 40%, #0e0c1a 70%, #06050a 100%)
  `,
};

// Character cutout placeholder — in Unreal: PNG with alpha, bottom-docked
const CUTOUT_PLACEHOLDER_STYLE = {
  background: `
    linear-gradient(180deg,
      transparent 0%,
      rgba(60, 40, 100, 0.15) 30%,
      rgba(40, 30, 70, 0.3) 60%,
      rgba(20, 15, 40, 0.6) 85%,
      rgba(6, 5, 10, 0.9) 100%
    )
  `,
  // Silhouette shape via clip-path — represents a character figure
  clipPath: `polygon(
    20% 100%, 22% 65%, 18% 55%, 20% 40%, 28% 30%,
    35% 22%, 40% 18%, 45% 16%, 50% 15%, 55% 16%,
    60% 18%, 65% 22%, 72% 30%, 80% 40%, 82% 55%,
    78% 65%, 80% 100%
  )`,
};

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [xmlAsset, setXmlAsset] = useState(XML_ASSETS[0]);
  const [areaName] = useState(AREAS[Math.floor(Math.random() * AREAS.length)]);
  const [fadeOpacity, setFadeOpacity] = useState(1); // starts opaque (black), fades out
  const [bgScale, setBgScale] = useState(1.0);       // Ken Burns — only increases
  const [cutoutX, setCutoutX] = useState(0);         // X drift in px
  const [imgFade, setImgFade] = useState(0);         // image fade-in opacity

  const elapsedRef = useRef(0);
  const animFrameRef = useRef(null);
  const durationMs = 4000;

  // ── ENTRY FADE IN: black → transparent over 600ms
  useEffect(() => {
    let startTime = null;
    const fadeIn = (ts) => {
      if (!startTime) startTime = ts;
      const t = Math.min((ts - startTime) / 600, 1);
      setFadeOpacity(1 - t);           // black fades out
      setImgFade(t);                   // images fade in
      if (t < 1) requestAnimationFrame(fadeIn);
    };
    const id = requestAnimationFrame(fadeIn);
    return () => cancelAnimationFrame(id);
  }, []);

  // ── KEN BURNS + CUTOUT DRIFT: runs every animation frame
  useEffect(() => {
    let lastTs = null;
    const tick = (ts) => {
      if (!lastTs) lastTs = ts;
      const dt = (ts - lastTs) / 1000; // seconds
      lastTs = ts;
      elapsedRef.current += dt;
      const elapsed = elapsedRef.current;

      // Background: scale starts at 1.0, grows slowly, NEVER shrinks below 1.0
      setBgScale(prev => Math.max(1.0, prev + dt * 0.012));

      // Cutout: slow sinusoidal X drift — max ±28px, never leaves bottom Y
      setCutoutX(Math.sin(elapsed * 0.18) * 28);

      animFrameRef.current = requestAnimationFrame(tick);
    };
    animFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  // ── PROGRESS + XML ASSET STREAM
  useEffect(() => {
    const interval = 50;
    const steps = durationMs / interval;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const pct = (step / steps) * 100;
      setProgress(pct);

      // Advance XML asset label at milestone percentages
      const assetIdx = Math.min(
        Math.floor((pct / 100) * XML_ASSETS.length),
        XML_ASSETS.length - 1
      );
      setXmlAsset(XML_ASSETS[assetIdx]);

      if (step >= steps) {
        clearInterval(timer);
        // EXIT FADE: images fade out → black, then call onComplete
        let exitStart = null;
        const fadeOut = (ts) => {
          if (!exitStart) exitStart = ts;
          const t = Math.min((ts - exitStart) / 500, 1);
          setFadeOpacity(t);   // black fades back in
          setImgFade(1 - t);
          if (t < 1) requestAnimationFrame(fadeOut);
          else setTimeout(onComplete, 100);
        };
        requestAnimationFrame(fadeOut);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="ls-root" style={{ overflow: "hidden" }}>

      {/* ── LAYER 0: Background image (Ken Burns slow zoom-in, never zooms out) ─────
          Slate port: SBox > SImage with FSlateActiveTimerRegistration driving
          a FWidgetTransform scale on the image widget. Scale only increases.
          Transform origin = center of image.                                         */}
      <div style={{
        position: "absolute", inset: 0,
        transform: `scale(${bgScale})`,
        transformOrigin: "center center",
        transition: "none",
        willChange: "transform",
        opacity: imgFade,
        ...BG_PLACEHOLDER_STYLE,
      }} />

      {/* ── LAYER 1: Atmospheric overlays (god-ray, vignette, scanlines) ───────── */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `
          radial-gradient(ellipse 30% 70% at 50% 0%, rgba(212,165,53,0.07) 0%, transparent 60%),
          linear-gradient(to top, rgba(6,5,10,0.85) 0%, transparent 40%),
          linear-gradient(to bottom, rgba(6,5,10,0.5) 0%, transparent 20%)
        `,
      }} />
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 4px)",
      }} />

      {/* ── LAYER 2: Character/object cutout — bottom-anchored, X drift only ───────
          Slate port: SOverlay::Slot HAlign_Center VAlign_Bottom, no bottom padding.
          X drift = SBox with a FSlateRenderTransform updated by FSlateActiveTimerRegistration.
          Image uses alpha-channel PNG (loading_1a.png). Never moves on Y axis.       */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: "50%",
        transform: `translateX(calc(-50% + ${cutoutX}px))`,
        width: "380px",
        height: "520px",
        opacity: imgFade * 0.55,
        pointerEvents: "none",
        willChange: "transform",
        ...CUTOUT_PLACEHOLDER_STYLE,
      }} />

      {/* Cutout feet gradient — blends bottom of figure into ground seamlessly */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "180px",
        background: "linear-gradient(to top, rgba(6,5,10,1) 0%, rgba(6,5,10,0.7) 40%, transparent 100%)",
        pointerEvents: "none",
      }} />

      {/* ── LAYER 3: Bottom info bar — progress + XML stream + area name ──────────
          Slate port: SOverlay::Slot VAlign_Bottom, SVerticalBox containing
          tip row, segmented progress bar, and footer info row.                       */}
      <div style={{
        position: "absolute",
        bottom: 0, left: 0, right: 0,
        padding: "0 40px 28px",
        background: "linear-gradient(to top, rgba(6,5,10,0.98) 0%, rgba(6,5,10,0.7) 60%, transparent 100%)",
        opacity: imgFade,
      }}>

        {/* Decorative top separator of the info bar */}
        <div style={{
          height: "1px",
          background: `linear-gradient(90deg, transparent, ${C.accent}40, transparent)`,
          marginBottom: "14px",
        }} />

        {/* XML stream label — what DataManager is currently parsing */}
        <div style={{
          fontFamily: "var(--font-mono)",
          fontSize: "11px",
          color: C.accentDim,
          letterSpacing: "0.8px",
          marginBottom: "9px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}>
          <span style={{
            display: "inline-block",
            width: "5px", height: "5px",
            background: C.accent,
            clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
            boxShadow: `0 0 6px ${C.accent}80`,
            flexShrink: 0,
          }} />
          <span style={{ color: C.accent, fontWeight: 700 }}>STREAMING //</span>
          <span style={{ color: C.textDim }}>{xmlAsset}</span>
        </div>

        {/* Progress bar */}
        <div className="ls-progress-container">
          <div className="ls-progress-bar" style={{ flex: 1 }}>
            <div className="ls-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="ls-progress-percent">{Math.floor(progress)}%</span>
        </div>

        {/* Footer info row: left = generic status, right = area name */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "8px",
          fontFamily: "var(--font-mono)",
          fontSize: "10px",
          letterSpacing: "1.2px",
          textTransform: "uppercase",
        }}>
          <span style={{ color: C.textDim }}>INITIALIZING WORLD STREAM</span>
          <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
            <span style={{
              width: "4px", height: "4px",
              background: "var(--color-green-text, #3a9660)",
              clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
              flexShrink: 0,
            }} />
            <span style={{ color: C.textBright, fontWeight: 600 }}>{areaName}</span>
          </div>
        </div>
      </div>

      {/* ── LAYER 4: Full-screen black fade — entry/exit transition overlay ─────── */}
      <div style={{
        position: "absolute", inset: 0,
        background: "#000",
        opacity: fadeOpacity,
        pointerEvents: "none",
        transition: "none",
      }} />
    </div>
  );
}
