import React from 'react';

export default function RouteCard({ route }) {
  return (
    <div className="route-card">
      <h4>{route?.name || 'Route'}</h4>
    </div>
  );
}
