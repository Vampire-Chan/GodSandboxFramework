/**
 * TabCharacter.jsx - Pause Menu Tab
 * 
 * PORTING NOTES FOR UNREAL ENGINE / SLATE:
 * - Displays character summary statistics, death weight progression, and combat skills.
 * - In C++, bind these stats to the `AttributesComponent` or a `UPlayerManager` subsystem.
 * - Layout uses CSS Grid and Flexbox which maps to Slate's grid and vertical/horizontal boxes.
 */
import React from "react";

export function TabCharacter({ player, colors, tierFn, barColorFn }) {
  const dwPct = (player.deathWeight / player.deathThreshold) * 100;
  const dwColor = dwPct > 70 ? colors.red : dwPct > 40 ? colors.yellow : colors.greenText;

  return (
    <>
      <div className="stat-grid">
        {[
          { label: "Cash on Hand", val: player.cash, sub: "Liquid assets" },
          { label: "Play Time", val: player.playtime, sub: "This character" },
          { label: "Profession", val: player.profession, sub: `Rank: ${player.rank}` },
          { label: "Server Time", val: player.serverTime, sub: player.location },
        ].map(({ label, val, sub }) => (
          <div key={label} className="stat-card">
            <div className="stat-card-label">{label}</div>
            <div className="stat-card-val">{val}</div>
            <div className="stat-card-sub">{sub}</div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 20 }}>
        <div className="section-label">Death Weight</div>
        <div style={{ background: colors.card, border: `1px solid ${colors.line}`, padding: "14px 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 28, fontWeight: 700, color: dwColor, lineHeight: 1, fontFamily: "'IBM Plex Mono', monospace" }}>
                {player.deathWeight.toFixed(2)}
                <span style={{ fontSize: 14, color: colors.textDim, fontWeight: 400 }}> / {player.deathThreshold.toFixed(1)}</span>
              </div>
              <div style={{ fontSize: 11, color: colors.textDim, marginTop: 4, fontFamily: "'IBM Plex Mono', monospace" }}>
                {player.nomad ? "⚠ NOMAD STATUS" : "Profession safe"}
              </div>
            </div>
            <div style={{ textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: colors.textDim }}>
              <div>Execution ×3.0</div><div>Headshot  ×1.5</div><div>Standard  ×1.0</div><div>Fall      ×0.5</div>
            </div>
          </div>
          <div style={{ height: 8, background: colors.line, borderRadius: 1, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${dwPct}%`, background: `linear-gradient(90deg, ${colors.green} 0%, ${dwColor} 100%)`, borderRadius: 1, transition: "width 0.5s" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5, fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: colors.textMuted }}>
            <span>0.0 — SAFE</span><span style={{ color: colors.yellow }}>2.5 — WARNING</span><span style={{ color: colors.red }}>5.0 — NOMAD</span>
          </div>
        </div>
      </div>

      <div>
        <div className="section-label">Combat Proficiency</div>
        <div className="combat-list">
          {Object.entries(player.combatStats).map(([skill, val]) => {
            const t = tierFn(val);
            return (
              <div key={skill} className="combat-row">
                <span className="combat-name">{skill}</span>
                <div className="combat-track">
                  <div className="combat-fill" style={{ width: `${val}%`, background: barColorFn(val) }} />
                </div>
                <span className="combat-tier" style={{ color: t.color }}>{t.label}</span>
                <span className="combat-val">{val}</span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
