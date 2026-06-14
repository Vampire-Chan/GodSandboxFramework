import React from 'react';

export default function Card({ title, description, icon, stats }) {
  return (
    <div className="god-card">
      <div className="god-card-inner">
        <div className="card-header">
          {icon && <div className="card-icon">{icon}</div>}
          <h3 className="card-title">{title}</h3>
        </div>
        <p className="card-description">{description}</p>
        
        {stats && (
          <div className="card-stats">
            {stats.map((stat, i) => (
              <div className="stat-item" key={i}>
                <span className="stat-label">{stat.label}</span>
                <span className="stat-value">{stat.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
