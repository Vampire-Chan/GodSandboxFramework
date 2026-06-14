import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="god-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="brand-info-row">
            <div className="brand-logo large">JL</div>
            <span className="brand-name">JUSTLIVE</span>
          </div>
          <div className="publisher-info">
            &copy; 2025-2026 Vampire Games. All rights reserved.
          </div>
          <div className="legal-links" style={{ marginTop: '0.5rem' }}>
            <Link to="/legal" style={{ color: 'var(--doc-primary)', textDecoration: 'none', fontSize: '0.9rem' }}>Terms of Service & EULA</Link>
          </div>
        </div>
        
        <div className="footer-legal">
          <div className="footer-logos">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Unreal_Engine_Logo.svg/3840px-Unreal_Engine_Logo.svg.png" 
              alt="Unreal Engine Logo" 
              className="footer-logo engine"
            />
            <img 
              src="https://logos-world.net/wp-content/uploads/2021/09/Intel-Logo.png" 
              alt="Intel Logo" 
              className="footer-logo intel"
            />
            <img 
              src="https://assets.streamlinehq.com/image/private/w_300,h_300,ar_1/f_auto/v1/icons/technology/amd-izswzd0y9af2h5la9wqatx.png/amd-3y8g7t051xymkkd32r76sf.png" 
              alt="AMD Logo" 
              className="footer-logo amd"
            />
            <img 
              src="https://upload.wikimedia.org/wikipedia/sco/thumb/2/21/Nvidia_logo.svg/3840px-Nvidia_logo.svg.png" 
              alt="NVIDIA Logo" 
              className="footer-logo nvidia"
            />
          </div>
          <p className="trademark-text">
            Unreal, Unreal Engine, and Epic Games are trademarks or registered trademarks of Epic Games, Inc.
          </p>
          <p className="trademark-text">
            Intel, AMD, NVIDIA and all other trademarks are the property of their respective owners.
          </p>
        </div>
      </div>
    </footer>
  );
}
