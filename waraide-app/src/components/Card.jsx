import React from 'react';

/**
 * Carte générique (conteneur stylé) — utilisée dans toute l'app.
 */
export default function Card({ children, className = '', style }) {
  return (
    <div className={`wa-card ${className}`} style={style}>
      {children}
    </div>
  );
}
