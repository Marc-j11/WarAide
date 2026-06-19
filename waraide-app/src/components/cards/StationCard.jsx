import React from 'react';

export default function StationCard({ station }) {
  return (
    <div className="station-card">
      <h3>{station?.name || 'Station'}</h3>
    </div>
  );
}
