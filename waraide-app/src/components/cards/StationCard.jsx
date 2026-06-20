import React from 'react';

/**
 * Carte d'une station / point de transport.
 * Props: station = { nom, type, transports?: ['woro','gbaka'], distance?: number (m) }
 */
export default function StationCard({ station, onClick }) {
  if (!station) return null;

  const transports = station.transports || ['woro'];
  const isGbaka = transports.includes('gbaka');
  const colorClass = isGbaka ? 'blue' : 'orange';
  const icon = isGbaka ? 'ti-bus' : 'ti-car';

  const transportLabel = transports
    .map((t) => (t === 'gbaka' ? 'Gbaka' : 'Woro woro'))
    .join(', ');

  return (
    <div className="wa-stop-card" onClick={onClick} style={onClick ? { cursor: 'pointer' } : undefined}>
      <div className={`wa-icon-box ${colorClass}`}>
        <i className={`ti ${icon}`} style={{ fontSize: 17 }} />
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 13, fontWeight: 500, margin: 0, color: 'var(--wa-text)' }}>
          {station.nom}
        </p>
        <p style={{ fontSize: 11, color: 'var(--wa-text-dim)', margin: '2px 0 0' }}>
          {station.distance != null ? `${Math.round(station.distance)} m · ` : ''}
          {transportLabel}
        </p>
      </div>
    </div>
  );
}
