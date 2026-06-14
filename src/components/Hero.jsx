import React from 'react';

export default function Hero({ onNavigate }) {
  return (
    <div className="hero-section" id="home">
      <div className="hero-background"></div>
      <div className="hero-content">
        <div className="status-badge">
          <span className="status-dot"></span>
          Servers Online
        </div>
        <h1 className="hero-title">Live The <span className="text-accent">JustLive</span> Experience</h1>
        <p className="hero-subtitle">
          A fully data-driven, open-world city simulation where every decision matters. Moddable, dynamic, and built for the future.
        </p>
        <div className="hero-actions">
          <button className="god-btn primary large">Download Runtime</button>
          <button 
            className="god-btn outline large"
            onClick={() => onNavigate && onNavigate('docs')}
          >
            Read Docs
          </button>
        </div>
      </div>
    </div>
  );
}
