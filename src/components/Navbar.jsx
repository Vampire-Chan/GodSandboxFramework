import React from 'react';

export default function Navbar({ currentPage, onNavigate }) {
  return (
    <nav className="god-navbar">
      <div className="nav-brand" onClick={() => onNavigate('home')} style={{ cursor: 'pointer' }}>
        <div className="brand-logo">JL</div>
        <span className="brand-name">JUSTLIVE</span>
      </div>
      <div className="nav-links">
        <a 
          href="#home" 
          className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
        >
          Home
        </a>
        <a 
          href="#features" 
          className={`nav-link ${currentPage === 'features' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); onNavigate('features'); }}
        >
          Features
        </a>
        <a 
          href="#docs" 
          className={`nav-link ${currentPage === 'docs' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); onNavigate('docs'); }}
        >
          Docs
        </a>
        <a 
          href="#mockup" 
          className={`nav-link ${currentPage === 'mockup' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); onNavigate('mockup'); }}
        >
          Interface Demo
        </a>
        <a href="#modding" className="nav-link">Modding</a>
        <a href="#community" className="nav-link">Community</a>
      </div>
      <div className="nav-actions">
        <button className="god-btn outline">Sign In</button>
        <button className="god-btn primary">Play Now</button>
      </div>
    </nav>
  );
}
