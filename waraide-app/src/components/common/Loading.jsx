import React from 'react';

export default function Loading({ label = 'Chargement…' }) {
  return <div className="wa-loading">{label}</div>;
}
